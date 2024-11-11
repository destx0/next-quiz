import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getQuestionById } from "@/lib/firestore";

export const fetchTestBatches = async (setTestBatches, setLoading) => {
  try {
    console.log("Fetching test batches...");
    const batchesSnapshot = await getDocs(collection(db, "testBatches"));
    
    const batchesData = await Promise.all(
      batchesSnapshot.docs.map(async (batchDoc) => {
        const batchData = batchDoc.data();
        console.log("Batch data:", batchData);
        console.log('Number of exam details:', batchData.examDetails?.length || 0);

        // Fetch quiz data for each exam in examDetails
        const examDetailsWithQuizzes = await Promise.all(
          (batchData.examDetails || []).map(async (exam) => {
            console.log('Fetching quiz data for exam:', exam.title, 'primaryQuizId:', exam.primaryQuizId);
            
            const quizDocRef = doc(db, 'fullQuizzes', exam.primaryQuizId);
            const quizDocSnap = await getDoc(quizDocRef);
            
            if (quizDocSnap.exists()) {
              console.log('Quiz data found for:', exam.title);
              return {
                ...exam,
                quizData: { 
                  id: exam.primaryQuizId, 
                  ...quizDocSnap.data() 
                }
              };
            }
            console.log('No quiz data found for:', exam.title);
            return {
              ...exam,
              quizData: {
                id: exam.primaryQuizId,
                title: `Quiz ${exam.primaryQuizId} (Not Found)`,
                error: "Quiz not found"
              }
            };
          })
        );

        return {
          id: batchDoc.id,
          ...batchData,
          examDetails: examDetailsWithQuizzes
        };
      })
    );

    console.log("Processed batch data:", batchesData);
    setTestBatches(batchesData.filter(Boolean));
  } catch (error) {
    console.error("Error fetching test batches:", error);
  } finally {
    setLoading(false);
  }
};

export const fetchAllQuizzes = async (setAllQuizzes) => {
  try {
    console.log("Fetching all quizzes...");
    const querySnapshot = await getDocs(collection(db, "quizzes"));
    console.log("All quizzes fetched:", querySnapshot.size);

    const quizzesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Processed quizzes data:", quizzesData);
    setAllQuizzes(quizzesData);
  } catch (error) {
    console.error("Error fetching all quizzes:", error);
  }
};

export const updateBatchOrder = async (batchId, examDetails) => {
  try {
    const batchRef = doc(db, "testBatches", batchId);
    await updateDoc(batchRef, { examDetails });
    console.log(`Batch ${batchId} order updated in Firebase`);
  } catch (error) {
    console.error("Error updating batch order:", error);
  }
};

export const downloadQuiz = async (quizId) => {
  try {
    const quizDocRef = doc(db, "quizzes", quizId);
    const quizDocSnap = await getDoc(quizDocRef);
    if (quizDocSnap.exists()) {
      const quizData = quizDocSnap.data();

      // Fetch all questions and flatten them into a single list
      const allQuestions = await Promise.all(
        quizData.sections.flatMap((section) =>
          section.questions.map(async (questionRef) => {
            const fullQuestion = await getQuestionById(questionRef.id);
            return {
              ...fullQuestion, // Spread all properties of fullQuestion
            };
          })
        )
      );

      const jsonString = JSON.stringify(allQuestions, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Create a filename-safe version of the quiz title
      const safeTitle = quizData.title
        .replace(/[^a-z0-9]/gi, "_") // Replace non-alphanumeric characters with underscores
        .replace(/_+/g, "_") // Replace multiple underscores with a single one
        .toLowerCase(); // Convert to lowercase

      link.download = `${safeTitle}_${quizId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error("Quiz not found");
    }
  } catch (error) {
    console.error("Error downloading quiz questions:", error);
  }
};
