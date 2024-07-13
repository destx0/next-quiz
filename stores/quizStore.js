import create from "zustand";

const useQuizStore = create((set, get) => ({
	quizData: null,

	setQuizData: (data) =>
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
					})),
				})),
			},
		})),

	setCurrentIndices: (sectionIndex, questionIndex) =>
		set((state) => ({
			quizData: {
				...state.quizData,
				currentSectionIndex: sectionIndex,
				currentQuestionIndex: questionIndex,
			},
		})),

	updateQuestionState: (sectionIndex, questionIndex, newState) =>
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
		})),

	markCurrentQuestion: () =>
		set((state) => {
			const { currentSectionIndex, currentQuestionIndex } =
				state.quizData;
			return {
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
			};
		}),

	setSelectedOption: (optionIndex) =>
		set((state) => {
			const { currentSectionIndex, currentQuestionIndex } =
				state.quizData;
			return {
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
														selectedOption:
															optionIndex,
													}
												: question
									),
								}
							: section
					),
				},
			};
		}),

	visitCurrentQuestion: () =>
		set((state) => {
			const { currentSectionIndex, currentQuestionIndex } =
				state.quizData;
			return {
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
														isVisited: true,
													}
												: question
									),
								}
							: section
					),
				},
			};
		}),

	nextQuestion: () =>
		set((state) => {
			const { currentSectionIndex, currentQuestionIndex, sections } =
				state.quizData;
			const currentSection = sections[currentSectionIndex];
			if (currentQuestionIndex < currentSection.questions.length - 1) {
				return {
					quizData: {
						...state.quizData,
						currentQuestionIndex: currentQuestionIndex + 1,
					},
				};
			} else if (currentSectionIndex < sections.length - 1) {
				return {
					quizData: {
						...state.quizData,
						currentSectionIndex: currentSectionIndex + 1,
						currentQuestionIndex: 0,
					},
				};
			}
			return state; // No change if we're at the last question
		}),

	previousQuestion: () =>
		set((state) => {
			const { currentSectionIndex, currentQuestionIndex, sections } =
				state.quizData;
			if (currentQuestionIndex > 0) {
				return {
					quizData: {
						...state.quizData,
						currentQuestionIndex: currentQuestionIndex - 1,
					},
				};
			} else if (currentSectionIndex > 0) {
				const previousSection = sections[currentSectionIndex - 1];
				return {
					quizData: {
						...state.quizData,
						currentSectionIndex: currentSectionIndex - 1,
						currentQuestionIndex:
							previousSection.questions.length - 1,
					},
				};
			}
			return state; // No change if we're at the first question
		}),
}));

export default useQuizStore;
