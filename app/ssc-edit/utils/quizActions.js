import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const handleDeleteQuiz = async (
  batchId,
  quizId,
  setTestBatches,
  setAllQuizzes
) => {
  if (window.confirm("Are you sure you want to delete this quiz?")) {
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      if (batchId) {
        const batchRef = doc(db, "testBatches", batchId);
        await updateDoc(batchRef, {
          quizzes: arrayRemove(quizId),
        });
      }
      console.log(
        `Quiz ${quizId} deleted from Firestore${batchId ? ` and removed from batch ${batchId}` : ""}`
      );

      // Update local state
      setTestBatches((prevBatches) =>
        prevBatches.map((batch) =>
          batch.id === batchId
            ? {
                ...batch,
                quizzes: batch.quizzes.filter((quiz) => quiz.id !== quizId),
              }
            : batch
        )
      );
      setAllQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  }
};

export const handleAddToBatch = async (
  quizId,
  batchId,
  setTestBatches,
  allQuizzes
) => {
  try {
    const batchRef = doc(db, "testBatches", batchId);
    await updateDoc(batchRef, {
      quizzes: arrayUnion(quizId),
    });
    console.log(`Quiz ${quizId} added to batch ${batchId}`);

    // Update local state
    setTestBatches((prevBatches) =>
      prevBatches.map((batch) =>
        batch.id === batchId
          ? {
              ...batch,
              quizzes: [
                ...batch.quizzes,
                allQuizzes.find((q) => q.id === quizId),
              ],
            }
          : batch
      )
    );
  } catch (error) {
    console.error("Error adding quiz to batch:", error);
  }
};

export const handleRemoveFromBatch = async (
  quizId,
  batchId,
  setTestBatches
) => {
  try {
    const batchRef = doc(db, "testBatches", batchId);
    const batchDoc = await getDoc(batchRef);
    const batchData = batchDoc.data();

    // Filter out the quiz from examDetails
    const updatedExamDetails = batchData.examDetails.filter(
      (exam) => exam.primaryQuizId !== quizId
    );

    // Update Firebase
    await updateDoc(batchRef, {
      examDetails: updatedExamDetails,
    });

    // Update local state
    setTestBatches((prevBatches) =>
      prevBatches.map((batch) =>
        batch.id === batchId
          ? { ...batch, examDetails: updatedExamDetails }
          : batch
      )
    );
  } catch (error) {
    console.error("Error removing quiz from batch:", error);
  }
};

export const updateQuizMetadata = async (quizId, updatedQuiz) => {
  try {
    const quizRef = doc(db, "quizzes", quizId);
    await updateDoc(quizRef, {
      title: updatedQuiz.title,
      description: updatedQuiz.description,
      thumbnailLink: updatedQuiz.thumbnailLink,
      duration: updatedQuiz.duration,
      positiveScore: updatedQuiz.positiveScore,
      negativeScore: updatedQuiz.negativeScore,
    });
    console.log("Quiz metadata updated successfully");
  } catch (error) {
    console.error("Error updating quiz metadata:", error);
    throw error;
  }
};

export const handleLanguageChange = async (
  batchId,
  quizId,
  currentLanguage,
  newLanguage,
  setTestBatches
) => {
  try {
    console.log("handleLanguageChange started:", {
      batchId,
      quizId,
      currentLanguage,
      newLanguage,
    });

    const batchRef = doc(db, "testBatches", batchId);
    const batchDoc = await getDoc(batchRef);

    if (!batchDoc.exists()) {
      throw new Error(`Batch ${batchId} not found`);
    }

    const batchData = batchDoc.data();
    console.log("Current batch data:", batchData);

    // Find the exam in examDetails
    const updatedExamDetails = batchData.examDetails.map((exam) => {
      console.log("Processing exam:", exam);

      if (
        exam.primaryQuizId === quizId ||
        exam.quizIds.some((q) => q.quizId === quizId)
      ) {
        console.log("Found matching exam:", exam);

        // Update the language in quizIds array
        const updatedQuizIds = exam.quizIds.map((q) => {
          if (q.quizId === quizId) {
            console.log("Updating quiz language:", {
              quizId: q.quizId,
              oldLanguage: q.language,
              newLanguage,
            });
            return { ...q, language: newLanguage };
          }
          return q;
        });

        return { ...exam, quizIds: updatedQuizIds };
      }
      return exam;
    });

    console.log("Updated exam details:", updatedExamDetails);

    // Update Firebase
    await updateDoc(batchRef, {
      examDetails: updatedExamDetails,
    });
    console.log("Firebase update completed");

    // Update local state
    setTestBatches((prevBatches) => {
      const newBatches = prevBatches.map((batch) =>
        batch.id === batchId
          ? { ...batch, examDetails: updatedExamDetails }
          : batch
      );
      console.log("Updated local state:", newBatches);
      return newBatches;
    });

    // Update the quiz document
    const quizRef = doc(db, "fullQuizzes", quizId);
    await updateDoc(quizRef, {
      language: newLanguage,
    });
    console.log("Quiz document updated");

    console.log(
      `Language change completed: ${currentLanguage} -> ${newLanguage} for quiz ${quizId}`
    );
  } catch (error) {
    console.error("Language change failed:", error);
    throw error;
  }
};

export const downloadQuizData = async (quizId, language, flatten = false) => {
  try {
    // Fetch the quiz data from Firestore
    const quizRef = doc(db, "fullQuizzes", quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      throw new Error("Quiz not found");
    }

    const rawData = quizDoc.data();

    // Prepare the data based on flatten option
    let quizData;
    if (flatten && rawData.sections) {
      // Flatten the sections into a single questions array
      const allQuestions = rawData.sections.reduce((acc, section) => {
        const questionsWithSection = (section.questions || []).map((q) => ({
          ...q,
          section: section.name, // Add section name to each question
        }));
        return [...acc, ...questionsWithSection];
      }, []);

      quizData = {
        ...rawData,
        questions: allQuestions, // Replace sections with flattened questions
        sections: undefined, // Remove sections array
        language: language,
        quizId: quizId,
      };
    } else {
      // Keep original structure
      quizData = {
        ...rawData,
        language: language,
        quizId: quizId,
      };
    }

    // Convert to JSON string with proper formatting
    const jsonString = JSON.stringify(quizData, null, 2);

    // Create blob and download link
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set filename with quiz title and language
    const sanitizedTitle = (quizData.title || quizId)
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_");
    const filename = `${sanitizedTitle}_${language}${flatten ? "_flat" : ""}.json`;

    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Quiz ${quizId} downloaded successfully`);
  } catch (error) {
    console.error("Error downloading quiz:", error);
    throw error;
  }
};
