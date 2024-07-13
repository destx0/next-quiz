import { getQuiz, getQuestions } from "@/lib/firestore";

export default async function QuizPage({ params }) {
	try {
		const quizData = await getQuiz(params.quizId);
		const questions = await getQuestions(quizData.sections);
		const quiz = { ...quizData, questions };

		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">Quiz Data:</h1>
				<pre className="bg-gray-100 p-4 rounded-md overflow-auto">
					{JSON.stringify(quiz, null, 2)}
				</pre>
			</div>
		);
	} catch (error) {
		console.error("Error fetching quiz:", error);
		return (
			<div className="text-red-500 p-4">
				Failed to load quiz. Please try again.
			</div>
		);
	}
}
