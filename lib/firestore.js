import { db } from "./firebase";
import {
	collection,
	setDoc,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	updateDoc,
	addDoc,
} from "firebase/firestore";

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

export const getAllTestBatches = async () => {
	try {
		const testBatchesRef = collection(db, "testBatches");
		const testBatchesSnapshot = await getDocs(testBatchesRef);
		const batches = [];
		testBatchesSnapshot.forEach((doc) => {
			batches.push({
				id: doc.id,
				...doc.data()
			});
		});
		return batches;
	} catch (e) {
		console.error("Error getting test batches: ", e);
		throw e;
	}
};
