import { db } from "./firebase";
import {
	collection,
	addDoc,
	setDoc,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	arrayUnion,
	updateDoc,
} from "firebase/firestore";

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

export const addTestBatch = async (testBatch) => {
	try {
		// Check if testBatch and required fields are defined
		if (
			!testBatch ||
			!testBatch.title ||
			!testBatch.quizzes ||
			!Array.isArray(testBatch.quizzes)
		) {
			throw new Error("Invalid test batch data");
		}

		// Validate that all quiz IDs exist before adding the test batch
		for (const quizId of testBatch.quizzes) {
			if (!quizId) {
				throw new Error("Invalid quiz ID found");
			}
			const quizDoc = await getDoc(doc(db, "quizzes", quizId));
			if (!quizDoc.exists()) {
				throw new Error(`Quiz with ID ${quizId} does not exist`);
			}
		}

		const docRef = await addDoc(collection(db, "testBatches"), testBatch);
		return docRef.id;
	} catch (e) {
		console.error("Error adding test batch: ", e);
		throw e;
	}
};

export const getQuiz = async (quizId) => {
	try {
		const quizDoc = await getDoc(doc(db, "quizzes", quizId));
		if (!quizDoc.exists()) {
			throw new Error(`Quiz with ID ${quizId} does not exist`);
		}
		return quizDoc.data();
	} catch (e) {
		console.error("Error getting quiz: ", e);
		throw e;
	}
};

export const getTestBatch = async (testBatchId) => {
	try {
		const testBatchDoc = await getDoc(doc(db, "testBatches", testBatchId));
		if (!testBatchDoc.exists()) {
			throw new Error(`Test Batch with ID ${testBatchId} does not exist`);
		}
		return testBatchDoc.data();
	} catch (e) {
		console.error("Error getting test batch: ", e);
		throw e;
	}
};

export const getQuestionById = async (questionId) => {
	try {
		if (typeof questionId !== "string") {
			throw new Error(`Invalid question ID: ${questionId}`);
		}
		const questionDoc = await getDoc(doc(db, "questions", questionId));
		if (!questionDoc.exists()) {
			throw new Error(`Question with ID ${questionId} not found`);
		}
		return { id: questionDoc.id, ...questionDoc.data() };
	} catch (e) {
		console.error("Error getting question: ", e);
		throw e;
	}
};

export const getQuizWithQuestions = async (quizId) => {
	try {
		// Get the quiz data
		const quizDoc = await getDoc(doc(db, "quizzes", quizId));
		if (!quizDoc.exists()) {
			throw new Error(`Quiz with ID ${quizId} does not exist`);
		}
		let quizData = { id: quizDoc.id, ...quizDoc.data() };

		// Fetch full question data for each question in each section
		for (let section of quizData.sections) {
			const fullQuestions = await Promise.all(
				section.questions.map(async (question) => {
					const fullQuestionData = await getQuestionById(question.id);
					return fullQuestionData; // This already includes both id and data
				})
			);
			section.questions = fullQuestions;
		}

		return quizData;
	} catch (e) {
		console.error("Error getting quiz with questions: ", e);
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

export const updateQuestion = async (questionId, questionData) => {
	try {
		const questionRef = doc(db, "questions", questionId);
		await updateDoc(questionRef, questionData);
		console.log("Question updated successfully");
	} catch (e) {
		console.error("Error updating question: ", e);
		throw e;
	}
};
