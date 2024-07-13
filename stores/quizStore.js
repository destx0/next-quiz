// @/stores/quizStore.js
"use client";

import { create } from "zustand";

export const useQuizStore = create((set, get) => ({
	quiz: null,
	currentSectionIndex: 0,
	currentQuestionIndex: 0,
	userAnswers: {},
	visitedQuestions: {},
	markedQuestions: {},
	showExplanations: false,
	setQuiz: (quiz) => set({ quiz }),
	setCurrentSectionIndex: (index) => set({ currentSectionIndex: index }),
	setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
	setUserAnswer: (sectionIndex, questionIndex, answer) => {
		set((state) => ({
			userAnswers: {
				...state.userAnswers,
				[`${sectionIndex}-${questionIndex}`]: answer,
			},
			visitedQuestions: {
				...state.visitedQuestions,
				[`${sectionIndex}-${questionIndex}`]: true,
			},
		}));
	},
	toggleMarkedQuestion: (sectionIndex, questionIndex) => {
		set((state) => ({
			markedQuestions: {
				...state.markedQuestions,
				[`${sectionIndex}-${questionIndex}`]:
					!state.markedQuestions[`${sectionIndex}-${questionIndex}`],
			},
		}));
	},
	getCurrentSectionQuestions: () => {
		const state = get();
		return state.quiz?.sections[state.currentSectionIndex]?.questions || [];
	},
	setShowExplanations: (show) => set({ showExplanations: show }),
}));
