"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuizWithQuestions } from "@/lib/getQuiz";
import QuestionCard from "./QuestionCard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditQuizPage() {
	const params = useParams();
	const [quizData, setQuizData] = useState(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchQuizData = async () => {
			const quizId = params.quizId;
			if (!quizId) {
				setError("Quiz ID is missing");
				return;
			}
			try {
				const data = await getQuizWithQuestions(quizId);
				setQuizData(data);
			} catch (error) {
				setError("Failed to fetch quiz data: " + error.message);
			}
		};

		fetchQuizData();
	}, [params.quizId]);

	const handleSaveQuestion = async (updatedQuestion) => {
		if (!quizData || !params.quizId) return;

		try {
			// Update the question in Firestore
			const quizRef = doc(db, "quizzes", params.quizId);
			const updatedSections = quizData.sections.map((section) => ({
				...section,
				questions: section.questions.map((q) =>
					q.id === updatedQuestion.id ? updatedQuestion : q
				),
			}));

			await updateDoc(quizRef, { sections: updatedSections });

			// Update local state
			setQuizData((prevData) => ({
				...prevData,
				sections: updatedSections,
			}));

			console.log("Question updated successfully");
		} catch (error) {
			console.error("Error updating question:", error);
			setError("Failed to update question: " + error.message);
		}
	};

	if (error) return <div>Error: {error}</div>;
	if (!quizData) return <div>Loading...</div>;

	const currentQuestionData = quizData.sections[0].questions[currentQuestion];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">
				Edit Quiz: {quizData.title}
			</h1>
			<QuestionCard
				question={currentQuestionData}
				onSave={handleSaveQuestion}
			/>
			<div className="mt-4">
				{quizData.sections[0].questions.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentQuestion(index)}
						className={`mr-2 px-3 py-1 ${
							currentQuestion === index
								? "bg-blue-500 text-white"
								: "bg-gray-200"
						}`}
					>
						{index + 1}
					</button>
				))}
			</div>
		</div>
	);
}
