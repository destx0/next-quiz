"use client";

import React, { useEffect, useState } from "react";
import { getQuizWithQuestions } from "@/lib/getQuiz";
import {
	createSubmission,
	updateSubmission,
	finishSubmission,
} from "@/lib/submission";
import QuestionCard from "./QuestionCard";
import { auth } from "@/lib/firebase";

export default function QuizPage({ params }) {
	const [quizData, setQuizData] = useState(null);
	const [currentSection, setCurrentSection] = useState(0);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [selectedOption, setSelectedOption] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState(null);
	const [submissionId, setSubmissionId] = useState(null);
	const [startTime, setStartTime] = useState(null);
	const [localSubmissionData, setLocalSubmissionData] = useState({});

	useEffect(() => {
		const fetchQuizData = async () => {
			console.log("[QuizPage] Params:", params);
			const quizId = params.quizid;
			console.log("[QuizPage] Fetching quiz data for ID:", quizId);
			if (!quizId) {
				console.error("[QuizPage] Quiz ID is undefined");
				setError("Quiz ID is missing");
				return;
			}
			try {
				const data = await getQuizWithQuestions(quizId);
				console.log("[QuizPage] Quiz data fetched:", data);
				setQuizData(data);

				// Create submission
				const newSubmissionId = await createSubmission(quizId);
				setSubmissionId(newSubmissionId);
				setStartTime(Date.now());

				// Initialize local submission data
				const initialLocalData = {};
				data.sections.forEach((section, sectionIndex) => {
					initialLocalData[sectionIndex] = {};
					section.questions.forEach((_, questionIndex) => {
						initialLocalData[sectionIndex][questionIndex] = {
							attemptedOptionIndex: null,
							marked: false,
							timeTaken: "PT0S",
						};
					});
				});
				setLocalSubmissionData(initialLocalData);
			} catch (error) {
				console.error("[QuizPage] Error fetching quiz:", error);
				setError("Failed to fetch quiz data: " + error.message);
			}
		};

		fetchQuizData();
	}, [params.quizid]);

	const handleSelectOption = (optionIndex) => {
		setSelectedOption(optionIndex);
	};

	const handleSaveAnswer = async () => {
		if (submissionId) {
			const timeTaken = `PT${Math.floor((Date.now() - startTime) / 1000)}S`;
			const updatedData = {
				...localSubmissionData[currentSection][currentQuestion],
				attemptedOptionIndex: selectedOption,
				timeTaken: timeTaken,
			};

			// Update local data
			setLocalSubmissionData((prev) => ({
				...prev,
				[currentSection]: {
					...prev[currentSection],
					[currentQuestion]: updatedData,
				},
			}));

			// Update Firebase
			await updateSubmission(
				submissionId,
				currentSection,
				currentQuestion,
				updatedData
			);
			console.log("Answer saved successfully");
		}
	};

	const handleJumpToQuestion = (sectionIndex, questionIndex) => {
		setCurrentSection(sectionIndex);
		setCurrentQuestion(questionIndex);
		setSelectedOption(
			localSubmissionData[sectionIndex][questionIndex]
				.attemptedOptionIndex
		);
	};

	const handleFinishQuiz = async () => {
		if (submissionId) {
			await finishSubmission(submissionId);
			setIsSubmitted(true);
		}
	};

	if (error) return <div>Error: {error}</div>;
	if (!quizData) return <div>Loading...</div>;

	const currentQuestionData =
		quizData.sections[currentSection].questions[currentQuestion];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
			<div className="mb-4">
				{quizData.sections.map((section, sectionIndex) => (
					<div key={sectionIndex}>
						<h2 className="font-bold mt-2">{section.name}</h2>
						{section.questions.map((_, questionIndex) => (
							<button
								key={questionIndex}
								onClick={() =>
									handleJumpToQuestion(
										sectionIndex,
										questionIndex
									)
								}
								className={`mr-2 px-3 py-1 ${
									currentSection === sectionIndex &&
									currentQuestion === questionIndex
										? "bg-blue-500 text-white"
										: "bg-gray-200"
								}`}
							>
								{questionIndex + 1}
							</button>
						))}
					</div>
				))}
			</div>
			<QuestionCard
				question={currentQuestionData}
				selectedOption={selectedOption}
				onSelectOption={handleSelectOption}
				isSubmitted={isSubmitted}
			/>
			<button
				onClick={handleSaveAnswer}
				className="bg-green-500 text-white px-4 py-2 rounded mt-4 mr-4"
			>
				Save Answer
			</button>
			<button
				onClick={handleFinishQuiz}
				className="bg-red-500 text-white px-4 py-2 rounded mt-4 mr-4"
			>
				Finish Quiz
			</button>
		</div>
	);
}
