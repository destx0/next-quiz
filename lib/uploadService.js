import { db } from "./firebase";
import { collection, addDoc, arrayUnion, updateDoc, doc } from "firebase/firestore";
import { getQuestionById } from "./firestore";

export const addQuestion = async (question) => {
  try {
    const docRef = await addDoc(collection(db, "questions"), question);
    return docRef.id;
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
              // This is a referenced question, just keep the id
              return { id: question.id };
            } else {
              // This is a full question, add it to the questions collection and get the id
              const questionId = await addQuestion(question);
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
    // Process sections and questions
    const processedSections = await Promise.all(
      quiz.sections.map(async (section) => {
        const processedQuestions = await Promise.all(
          section.questions.map(async (question) => {
            if (question.id) {
              // This is a referenced question, get its full data
              const questionData = await getQuestionById(question.id);
              return {
                id: question.id,
                ...questionData
              };
            } else {
              // This is a full question, add it to questions collection and store both id and data
              const questionId = await addQuestion(question);
              return {
                id: questionId,
                ...question
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

    // Create the final quiz object with full question data
    const fullQuizData = {
      ...quiz,
      sections: processedSections,
      createdAt: new Date(),
    };

    // Save to fullQuizzes collection
    const docRef = await addDoc(collection(db, "fullQuizzes"), fullQuizData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding full quiz: ", e);
    throw e;
  }
};

export const updateTestBatch = async (testBatchId, quizId) => {
  try {
    const testBatchRef = doc(db, "testBatches", testBatchId);
    await updateDoc(testBatchRef, {
      quizzes: arrayUnion(quizId),
    });
  } catch (e) {
    console.error("Error updating test batch: ", e);
    throw e;
  }
};

export const createNewBatch = async (batchData) => {
  try {
    const docRef = await addDoc(collection(db, "testBatches"), {
      ...batchData,
      quizzes: [],
      createdAt: new Date()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error creating new batch: ", e);
    throw e;
  }
}; 