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
	score: null,
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
	calculateScore: () => {
		const state = get();
		let score = 0;
		let totalQuestions = 0;

		state.quiz.sections.forEach((section, sectionIndex) => {
			section.questions.forEach((question, questionIndex) => {
				const userAnswer =
					state.userAnswers[`${sectionIndex}-${questionIndex}`];
				const correctAnswer = state.quiz.questions.find(
					(q) => q.id === question.id
				).correctAnswer;

				totalQuestions++;
				if (userAnswer !== undefined) {
					if (userAnswer === correctAnswer) {
						score += state.quiz.positiveScore || 1;
					} else {
						score -= state.quiz.negativeScore || 0;
					}
				}
			});
		});

		set({ score, totalQuestions });
	},
}));
