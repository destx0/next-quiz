import create from "zustand";

const useQuizStore = create((set, get) => ({
	quizData: null,
	isSubmitted: false,
	showAnswers: false,
	remainingTime: null,
	previousSubmission: null,

	setQuizData: (data) => {
		console.log("Setting quiz data:", data);
		set((state) => ({
			quizData: {
				...data,
				currentSectionIndex: 0,
				currentQuestionIndex: 0,
				sections: data.sections.map((section) => ({
					...section,
					questions: section.questions.map((question) => ({
						...question,
						isVisited: false,
						isMarked: false,
						selectedOption: null,
						timeSpent: 0,
						isActive: false,
					})),
				})),
			},
			isSubmitted: false,
			showAnswers: false,
			remainingTime: data.duration * 60,
		}));
		console.log("Quiz data set:", get().quizData);
	},

	setSubmitted: (value) => {
		console.log("Setting isSubmitted:", value);
		set({ isSubmitted: value });
		console.log("isSubmitted set to:", get().isSubmitted);
	},

	setPreviousSubmission: (submission) => {
		console.log("Setting previous submission:", submission);
		set((state) => {
			const updatedQuizData = {
				...state.quizData,
				sections: state.quizData.sections.map((section) => ({
					...section,
					questions: section.questions.map(
						(question, questionIndex) => {
							const submissionSection =
								submission.submission.find(
									(s) => s.sectionName === section.name
								);
							const submissionQuestion = submissionSection
								? submissionSection.questions[questionIndex]
								: null;
							return {
								...question,
								selectedOption: submissionQuestion
									? submissionQuestion.selectedOption
									: null,
								isCorrect: submissionQuestion
									? String(
											submissionQuestion.selectedOption
										) === String(question.correctAnswer)
									: false,
							};
						}
					),
				})),
			};
			console.log(
				"Updated quiz data with previous submission:",
				updatedQuizData
			);
			return {
				quizData: updatedQuizData,
				previousSubmission: submission,
				isSubmitted: true,
				showAnswers: true,
			};
		});
		console.log("Previous submission set, new state:", get());
	},

	setCurrentIndices: (sectionIndex, questionIndex) => {
		console.log(
			`Setting current indices: section ${sectionIndex}, question ${questionIndex}`
		);
		set((state) => ({
			quizData: {
				...state.quizData,
				currentSectionIndex: sectionIndex,
				currentQuestionIndex: questionIndex,
			},
		}));
	},

	updateQuestionState: (sectionIndex, questionIndex, newState) => {
		console.log(
			`Updating question state: section ${sectionIndex}, question ${questionIndex}`,
			newState
		);
		set((state) => ({
			quizData: {
				...state.quizData,
				sections: state.quizData.sections.map((section, sIndex) =>
					sIndex === sectionIndex
						? {
								...section,
								questions: section.questions.map(
									(question, qIndex) =>
										qIndex === questionIndex
											? { ...question, ...newState }
											: question
								),
							}
						: section
				),
			},
		}));
	},

	markCurrentQuestion: () => {
		const { currentSectionIndex, currentQuestionIndex, sections } =
			get().quizData;
		console.log(
			`Marking current question: section ${currentSectionIndex}, question ${currentQuestionIndex}`
		);
		set((state) => ({
			quizData: {
				...state.quizData,
				sections: state.quizData.sections.map((section, sIndex) =>
					sIndex === currentSectionIndex
						? {
								...section,
								questions: section.questions.map(
									(question, qIndex) =>
										qIndex === currentQuestionIndex
											? {
													...question,
													isMarked:
														!question.isMarked,
												}
											: question
								),
							}
						: section
				),
			},
		}));
	},

	setSelectedOption: (optionIndex) => {
		const { currentSectionIndex, currentQuestionIndex } = get().quizData;
		console.log(
			`Setting selected option: section ${currentSectionIndex}, question ${currentQuestionIndex}, option ${optionIndex}`
		);
		set((state) => ({
			quizData: {
				...state.quizData,
				sections: state.quizData.sections.map((section, sIndex) =>
					sIndex === currentSectionIndex
						? {
								...section,
								questions: section.questions.map(
									(question, qIndex) =>
										qIndex === currentQuestionIndex
											? {
													...question,
													selectedOption: optionIndex,
													isCorrect:
														String(optionIndex) ===
														String(
															question.correctAnswer
														),
												}
											: question
								),
							}
						: section
				),
			},
		}));
	},

	visitCurrentQuestion: () => {
		const { currentSectionIndex, currentQuestionIndex } = get().quizData;
		console.log(
			`Visiting current question: section ${currentSectionIndex}, question ${currentQuestionIndex}`
		);
		set((state) => ({
			quizData: {
				...state.quizData,
				sections: state.quizData.sections.map((section, sIndex) =>
					sIndex === currentSectionIndex
						? {
								...section,
								questions: section.questions.map(
									(question, qIndex) =>
										qIndex === currentQuestionIndex
											? { ...question, isVisited: true }
											: question
								),
							}
						: section
				),
			},
		}));
	},

	nextQuestion: () => {
		const { currentSectionIndex, currentQuestionIndex, sections } =
			get().quizData;
		console.log(
			`Moving to next question from: section ${currentSectionIndex}, question ${currentQuestionIndex}`
		);
		const currentSection = sections[currentSectionIndex];
		if (currentQuestionIndex < currentSection.questions.length - 1) {
			set((state) => ({
				quizData: {
					...state.quizData,
					currentQuestionIndex: currentQuestionIndex + 1,
				},
			}));
		} else if (currentSectionIndex < sections.length - 1) {
			set((state) => ({
				quizData: {
					...state.quizData,
					currentSectionIndex: currentSectionIndex + 1,
					currentQuestionIndex: 0,
				},
			}));
		}
	},

	submitQuiz: () => {
		console.log("Submitting quiz");
		set((state) => ({
			isSubmitted: true,
			remainingTime: 0,
		}));
	},

	toggleShowAnswers: () => {
		console.log("Toggling show answers");
		set((state) => ({
			showAnswers: !state.showAnswers,
		}));
	},

	calculateScore: () => {
		const state = get();
		let totalScore = 0;
		state.quizData.sections.forEach((section) => {
			section.questions.forEach((question) => {
				if (
					String(question.selectedOption) ===
					String(question.correctAnswer)
				) {
					totalScore += state.quizData.positiveScore;
				} else if (question.selectedOption !== null) {
					totalScore -= state.quizData.negativeScore;
				}
			});
		});
		console.log("Calculated score:", totalScore);
		return totalScore;
	},

	incrementActiveQuestionTime: () => {
		const { currentSectionIndex, currentQuestionIndex } = get().quizData;
		set((state) => ({
			quizData: {
				...state.quizData,
				sections: state.quizData.sections.map((section, sIndex) =>
					sIndex === currentSectionIndex
						? {
								...section,
								questions: section.questions.map(
									(question, qIndex) =>
										qIndex === currentQuestionIndex
											? {
													...question,
													timeSpent:
														question.timeSpent + 1,
												}
											: question
								),
							}
						: section
				),
			},
		}));
	},

	decrementRemainingTime: () => {
		set((state) => ({
			remainingTime: Math.max(0, state.remainingTime - 1),
		}));
	},
}));

export default useQuizStore;
