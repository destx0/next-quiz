import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const getQuizWithQuestions = async (quizId) => {
	console.log(`[getQuizWithQuestions] Starting with quizId: ${quizId}`);
	try {
		if (!quizId) {
			throw new Error("Quiz ID is undefined");
		}
		const quizDoc = await getDoc(doc(db, "quizzes", quizId));
		console.log(
			`[getQuizWithQuestions] Quiz document exists: ${quizDoc.exists()}`
		);
		if (!quizDoc.exists()) {
			throw new Error(`Quiz with ID ${quizId} does not exist`);
		}
		let quizData = { id: quizDoc.id, ...quizDoc.data() };
		console.log(`[getQuizWithQuestions] Initial quizData:`, quizData);

		if (!quizData.sections || !Array.isArray(quizData.sections)) {
			throw new Error(
				"Quiz data is invalid: sections are missing or not an array"
			);
		}

		// Fetch full question data for each question in each section
		for (let section of quizData.sections) {
			if (!section.questions || !Array.isArray(section.questions)) {
				throw new Error(
					`Section "${section.name}" has invalid questions data`
				);
			}
			const fullQuestions = await Promise.all(
				section.questions.map(async (question) => {
					if (!question.id) {
						throw new Error(
							`Question in section "${section.name}" is missing an ID`
						);
					}
					return await getQuestionById(question.id);
				})
			);
			section.questions = fullQuestions;
		}

		console.log(`[getQuizWithQuestions] Final quizData:`, quizData);
		return quizData;
	} catch (e) {
		console.error("[getQuizWithQuestions] Error:", e);
		throw e;
	}
};

export const getQuestionById = async (questionId) => {
	console.log(`[getQuestionById] Starting with questionId: ${questionId}`);
	try {
		if (typeof questionId !== "string") {
			throw new Error(`Invalid question ID: ${questionId}`);
		}
		const questionDoc = await getDoc(doc(db, "questions", questionId));
		console.log(
			`[getQuestionById] Question document exists: ${questionDoc.exists()}`
		);
		if (!questionDoc.exists()) {
			throw new Error(`Question with ID ${questionId} not found`);
		}
		const questionData = { id: questionDoc.id, ...questionDoc.data() };
		console.log(`[getQuestionById] QuestionData:`, questionData);
		return questionData;
	} catch (e) {
		console.error("[getQuestionById] Error:", e);
		throw e;
	}
};
