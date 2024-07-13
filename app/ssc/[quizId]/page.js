"use client";
import { getQuizWithQuestions } from "@/lib/firestore";
import useQuizStore from "@/stores/quizStore"; // Adjust the import path as needed
import { useEffect } from "react";

export default function QuizPage({ params }) {
	const {
		quizData,
		setQuizData,
		setCurrentIndices,
		updateQuestionState,
		markCurrentQuestion,
		setSelectedOption,
		visitCurrentQuestion,
		nextQuestion,
		previousQuestion,
	} = useQuizStore();

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const data = await getQuizWithQuestions(params.quizId);
				setQuizData(data);
				visitCurrentQuestion(); // Mark the first question as visited
			} catch (error) {
				console.error("Error fetching quiz:", error);
			}
		};

		fetchQuizData();
	}, [params.quizId, setQuizData, visitCurrentQuestion]);

	const handleNextQuestion = () => {
		nextQuestion();
		visitCurrentQuestion();
	};

	const handlePreviousQuestion = () => {
		previousQuestion();
		visitCurrentQuestion();
	};

	const handleJumpToSection = (sectionIndex) => {
		setCurrentIndices(sectionIndex, 0);
		visitCurrentQuestion();
	};

	if (!quizData) return <div>Loading...</div>;

	const { currentSectionIndex, currentQuestionIndex, sections } = quizData;
	const currentSection = sections[currentSectionIndex];
	const currentQuestion = currentSection.questions[currentQuestionIndex];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
			<div className="mb-4">
				<select
					value={currentSectionIndex}
					onChange={(e) =>
						handleJumpToSection(Number(e.target.value))
					}
					className="mr-2 p-2 border rounded"
				>
					{sections.map((section, index) => (
						<option key={index} value={index}>
							{section.name}
						</option>
					))}
				</select>
				<span>
					Question {currentQuestionIndex + 1} of{" "}
					{currentSection.questions.length}
				</span>
			</div>
			<div className="mb-4">
				<h2 className="text-xl font-semibold mb-2">
					{currentQuestion.text}
				</h2>
				{currentQuestion.options.map((option, index) => (
					<div key={index} className="mb-2">
						<input
							type="radio"
							id={`option-${index}`}
							name="question-option"
							checked={currentQuestion.selectedOption === index}
							onChange={() => setSelectedOption(index)}
						/>
						<label htmlFor={`option-${index}`} className="ml-2">
							{option}
						</label>
					</div>
				))}
			</div>
			<div className="flex space-x-2">
				<button
					onClick={handlePreviousQuestion}
					className="px-4 py-2 bg-blue-500 text-white rounded"
				>
					Previous
				</button>
				<button
					onClick={handleNextQuestion}
					className="px-4 py-2 bg-blue-500 text-white rounded"
				>
					Next
				</button>
				<button
					onClick={markCurrentQuestion}
					className="px-4 py-2 bg-yellow-500 text-white rounded"
				>
					{currentQuestion.isMarked ? "Unmark" : "Mark"} Question
				</button>
			</div>
			<pre className="bg-gray-100 p-4 rounded-md overflow-auto mt-4">
				{JSON.stringify(quizData, null, 2)}
			</pre>
		</div>
	);
}
