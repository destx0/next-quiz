import { db } from "./firebase";
import { collection, addDoc, arrayUnion, updateDoc, doc, getDoc } from "firebase/firestore";
import { getQuestionById } from "./firestore";

export const addQuestion = async (question) => {
  try {
    const docRef = await addDoc(collection(db, "questions"), {
      ...question,
      language: question.language || "english"
    });
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
              // This is a full question, add it to questions collection with language
              const questionWithLanguage = {
                ...question,
                language: quiz.language || "english"
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

    // Create the final quiz object with language
    const quizData = {
      ...quiz,
      sections: processedSections,
      language: quiz.language || "english",
      createdAt: new Date()
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
              const questionData = await getQuestionById(question.id);
              return {
                id: question.id,
                ...questionData,
                language: quiz.language || questionData.language || "english"
              };
            } else {
              const questionWithLanguage = {
                ...question,
                language: quiz.language || "english"
              };
              const questionId = await addQuestion(questionWithLanguage);
              return {
                id: questionId,
                ...questionWithLanguage
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
      language: quiz.language || "english",
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "fullQuizzes"), fullQuizData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding full quiz: ", e);
    throw e;
  }
};

export const updateTestBatch = async (testBatchId, quizId, quizData) => {
  try {
    const testBatchRef = doc(db, "testBatches", testBatchId);
    const testBatchDoc = await getDoc(testBatchRef);
    const testBatchData = testBatchDoc.data();

    // Find or create examDetails entry for this quiz
    let examDetails = testBatchData.examDetails || [];
    
    // Use exact title matching
    let existingExamIndex = examDetails.findIndex(
      exam => exam.title.trim().toLowerCase() === quizData.title.trim().toLowerCase()
    );

    if (existingExamIndex === -1) {
      // Create new exam entry
      examDetails.push({
        title: quizData.title,
        description: quizData.description,
        thumbnailLink: quizData.thumbnailLink,
        duration: quizData.duration,
        positiveScore: quizData.positiveScore,
        negativeScore: quizData.negativeScore,
        quizIds: [{
          language: quizData.language,
          quizId: quizId
        }]
      });
      console.log(`Created new exam entry for "${quizData.title}" with ${quizData.language} version`);
    } else {
      // Update existing exam entry
      let existingExam = examDetails[existingExamIndex];
      let languageIndex = existingExam.quizIds.findIndex(
        q => q.language.toLowerCase() === quizData.language.toLowerCase()
      );

      if (languageIndex === -1) {
        // Add new language version
        existingExam.quizIds.push({
          language: quizData.language,
          quizId: quizId
        });
        console.log(`Added ${quizData.language} version to existing quiz "${quizData.title}"`);
      } else {
        // Update existing language version
        existingExam.quizIds[languageIndex].quizId = quizId;
        console.log(`Updated ${quizData.language} version of quiz "${quizData.title}"`);
      }

      // Update metadata only if it's a new version
      if (languageIndex === -1) {
        existingExam = {
          ...existingExam,
          title: quizData.title, // Keep original title
          description: quizData.description || existingExam.description,
          thumbnailLink: quizData.thumbnailLink || existingExam.thumbnailLink,
          duration: quizData.duration || existingExam.duration,
          positiveScore: quizData.positiveScore || existingExam.positiveScore,
          negativeScore: quizData.negativeScore || existingExam.negativeScore,
        };
      }

      examDetails[existingExamIndex] = existingExam;
    }

    // Update the test batch document
    await updateDoc(testBatchRef, {
      quizzes: arrayUnion(quizId), // For backward compatibility
      examDetails: examDetails,
      updatedAt: new Date() // Add last update timestamp
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
      quizzes: [], // For backward compatibility
      examDetails: [], // New structure for language-specific quiz references
      createdAt: new Date()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error creating new batch: ", e);
    throw e;
  }
}; 