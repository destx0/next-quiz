import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const getQuizWithQuestions = async (quizId) => {
  console.log(`[getQuizWithQuestions] Starting with quizId: ${quizId}`);
  try {
    if (!quizId) {
      throw new Error("Quiz ID is undefined");
    }

    // Fetch from fullQuizzes collection instead of quizzes
    const quizDoc = await getDoc(doc(db, "fullQuizzes", quizId));
    console.log(
      `[getQuizWithQuestions] Quiz document exists: ${quizDoc.exists()}`
    );

    if (!quizDoc.exists()) {
      throw new Error(`Quiz with ID ${quizId} does not exist`);
    }

    // Return the complete quiz data as is - no need to fetch questions separately
    const quizData = { id: quizDoc.id, ...quizDoc.data() };
    console.log(`[getQuizWithQuestions] Complete quiz data retrieved`);
    return quizData;

  } catch (e) {
    console.error("[getQuizWithQuestions] Error:", e);
    throw e;
  }
};
