import { db } from "./firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

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

export const updateQuiz = async (quizId, quiz) => {
	try {
		await setDoc(doc(db, "quizzes", quizId), quiz);
	} catch (e) {
		console.error("Error updating quiz: ", e);
		throw e;
	}
};
