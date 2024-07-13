// stores/quizStore.js
"use client";

import { create } from "zustand";

export const useQuizStore = create((set) => ({
	quiz: null,
	currentSectionIndex: 0,
	currentQuestionIndex: 0,
	userAnswers: {},
	setQuiz: (quiz) => set({ quiz }),
	setCurrentSectionIndex: (index) => set({ currentSectionIndex: index }),
	setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
	setUserAnswer: (sectionIndex, questionIndex, answer) =>
		set((state) => ({
			userAnswers: {
				...state.userAnswers,
				[`${sectionIndex}-${questionIndex}`]: answer,
			},
		})),
}));
