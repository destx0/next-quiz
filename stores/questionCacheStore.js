import create from "zustand";
import { getQuestionById } from "@/lib/firestore"; // Adjust the import path as needed

const useQuestionCacheStore = create((set, get) => ({
	cache: {},

	addToCache: (questionId, questionData) =>
		set((state) => ({
			cache: { ...state.cache, [questionId]: questionData },
		})),

	getQuestion: async (questionId) => {
		const state = get();
		if (state.cache[questionId]) {
			return state.cache[questionId];
		}
		try {
			const questionData = await getQuestionById(questionId);
			state.addToCache(questionId, questionData);
			return questionData;
		} catch (error) {
			console.error(`Error fetching question ${questionId}:`, error);
			return null;
		}
	},

	prefetchQuestions: async (questionIds) => {
		const state = get();
		const fetchPromises = questionIds
			.filter((id) => !state.cache[id])
			.map((id) => state.getQuestion(id));
		await Promise.all(fetchPromises);
	},
}));

export default useQuestionCacheStore;
