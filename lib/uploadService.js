import { db } from "./firebase";
import {
  collection,
  addDoc,
  arrayUnion,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getQuestionById } from "./firestore";

export const addQuestion = async (question) => {
  try {
    // Preserve the original language from the question data
    const questionData = {
      ...question,
      // Only use default if language is not present in the question
      language: question.language || "english",
    };

    if (question.code) {
      const questionRef = doc(db, "questions", question.code);
      await setDoc(questionRef, questionData);
      return question.code;
    } else {
      const docRef = await addDoc(collection(db, "questions"), questionData);
      return docRef.id;
    }
  } catch (e) {
    console.error("Error adding question: ", e);
    throw e;
  }
};

export const addQuiz = async (quiz) => {
  try {
    // Process sections and questions
    const processedSections = await Promise.all(
      quiz.sections.map(async (section) => {
        const processedQuestions = await Promise.all(
          section.questions.map(async (question) => {
            if (question.id) {
              return { id: question.id };
            } else {
              // Use question's language if available, fallback to quiz language
              const questionWithLanguage = {
                ...question,
                language: question.language || quiz.language || "english",
              };
              const questionId = await addQuestion(questionWithLanguage);
              return { id: questionId };
            }
          })
        );

        return {
          ...section,
          questions: processedQuestions,
        };
      })
    );

    // Create the final quiz object
    const quizData = {
      ...quiz,
      sections: processedSections,
      // Use quiz's original language or fallback to english
      language: quiz.language || "english",
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "quizzes"), quizData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding quiz: ", e);
    throw e;
  }
};

export const addFullQuiz = async (quiz) => {
  try {
    // Store the original language
    const originalLanguage = quiz.language;
    console.log("Original language in addFullQuiz:", originalLanguage); // Debug log

    const processedSections = await Promise.all(
      quiz.sections.map(async (section) => {
        const processedQuestions = await Promise.all(
          section.questions.map(async (question) => {
            if (question.id) {
              const questionData = await getQuestionById(question.id);
              return {
                id: question.id,
                ...questionData,
                language:
                  originalLanguage || questionData.language || "english",
              };
            } else {
              const questionWithLanguage = {
                ...question,
                language: originalLanguage || question.language || "english",
              };
              const questionId = await addQuestion(questionWithLanguage);
              return {
                id: questionId,
                ...questionWithLanguage,
              };
            }
          })
        );

        return {
          ...section,
          questions: processedQuestions,
        };
      })
    );

    const fullQuizData = {
      ...quiz,
      sections: processedSections,
      // Ensure we use the original language
      language: originalLanguage || "english",
      createdAt: new Date(),
    };

    // Debug log before saving
    console.log("Saving quiz with language:", fullQuizData.language);

    const docRef = await addDoc(collection(db, "fullQuizzes"), fullQuizData);

    // Return both the ID and the original quiz data
    return {
      id: docRef.id,
      quizData: {
        ...quiz,
        language: originalLanguage, // Ensure we pass the original language
      },
    };
  } catch (e) {
    console.error("Error adding full quiz: ", e);
    throw e;
  }
};

export const updateQuiz = async (quizId, quizData) => {
  try {
    const quizRef = doc(db, "quizzes", quizId);
    await updateDoc(quizRef, {
      ...quizData,
      updatedAt: new Date(),
    });
    return quizId;
  } catch (e) {
    console.error("Error updating quiz: ", e);
    throw e;
  }
};

export const updateTestBatch = async (testBatchId, quizId, quizData) => {
  try {
    // Debug logs at the start
    console.log("updateTestBatch received data:", {
      testBatchId,
      quizId,
      quizTitle: quizData.title,
      quizLanguage: quizData.language,
      fullQuizData: quizData,
    });

    const testBatchRef = doc(db, "testBatches", testBatchId);
    const testBatchDoc = await getDoc(testBatchRef);
    const testBatchData = testBatchDoc.data();

    let examDetails = testBatchData.examDetails || [];
    let existingExamIndex = examDetails.findIndex(
      (exam) =>
        exam.title.trim().toLowerCase() === quizData.title.trim().toLowerCase()
    );

    // Get language directly from the original quiz data
    const quizLanguage = quizData.language;

    if (!quizLanguage) {
      console.warn("WARNING: No language found in quiz data:", quizData);
      throw new Error("Quiz language is required but was not provided");
    }

    if (existingExamIndex === -1) {
      // Create new exam entry with primaryQuizId
      const newExamEntry = {
        title: quizData.title,
        description: quizData.description,
        thumbnailLink: quizData.thumbnailLink,
        duration: quizData.duration,
        positiveScore: quizData.positiveScore,
        negativeScore: quizData.negativeScore,
        primaryQuizId: quizId,
        quizIds: [
          {
            language: quizLanguage,
            quizId: quizId,
          },
        ],
      };

      // Debug log before adding new entry
      console.log("Creating new exam entry:", newExamEntry);

      examDetails.push(newExamEntry);
    } else {
      // Debug log for existing exam
      console.log("Found existing exam:", examDetails[existingExamIndex]);

      let existingExam = examDetails[existingExamIndex];

      // Add primaryQuizId if it doesn't exist
      if (!existingExam.primaryQuizId) {
        existingExam.primaryQuizId = quizId;
      }

      let languageIndex = existingExam.quizIds.findIndex(
        (q) => q.language.toLowerCase() === quizLanguage.toLowerCase()
      );

      // Debug log for language matching
      console.log("Language matching:", {
        searchingFor: quizLanguage,
        existingLanguages: existingExam.quizIds.map((q) => q.language),
        foundAtIndex: languageIndex,
      });

      if (languageIndex === -1) {
        existingExam.quizIds.push({
          language: quizLanguage,
          quizId: quizId,
        });
      } else {
        existingExam.quizIds[languageIndex] = {
          language: quizLanguage,
          quizId: quizId,
        };
      }

      // Update metadata
      if (languageIndex === -1) {
        existingExam = {
          ...existingExam,
          title: quizData.title,
          description: quizData.description || existingExam.description,
          thumbnailLink: quizData.thumbnailLink || existingExam.thumbnailLink,
          duration: quizData.duration || existingExam.duration,
          positiveScore: quizData.positiveScore || existingExam.positiveScore,
          negativeScore: quizData.negativeScore || existingExam.negativeScore,
        };
      }

      examDetails[existingExamIndex] = existingExam;

      // Debug log final exam state
      console.log("Updated exam entry:", existingExam);

      // Update the primary quiz document with references to all language versions
      const primaryQuizRef = doc(db, "fullQuizzes", existingExam.primaryQuizId);
      await updateDoc(primaryQuizRef, {
        languageVersions: existingExam.quizIds.map((q) => ({
          language: q.language,
          quizId: q.quizId,
          isDefault: q.quizId === existingExam.primaryQuizId,
        })),
      });
    }

    // Final debug log before updating
    console.log("Final examDetails before update:", examDetails);

    // Update the test batch document
    await updateDoc(testBatchRef, {
      examDetails: examDetails,
      updatedAt: new Date(),
    });
  } catch (e) {
    console.error("Error updating test batch:", e);
    throw e;
  }
};

export const createNewBatch = async (batchData) => {
  try {
    const docRef = await addDoc(collection(db, "testBatches"), {
      ...batchData,
      quizzes: [], // For backward compatibility
      examDetails: [], // New structure for language-specific quiz references
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error creating new batch: ", e);
    throw e;
  }
};
