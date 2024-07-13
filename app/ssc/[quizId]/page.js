// app/ssc/[quizId]/page.js
import { getQuiz, getQuestions } from "@/lib/firestore";
import QuizContent from "./QuizContent";

export default async function QuizPage({ params }) {
	try {
		const quizData = await getQuiz(params.quizId);
		const questions = await getQuestions(quizData.sections);
		const quiz = { ...quizData, questions };

		return <QuizContent initialQuiz={quiz} />;
	} catch (error) {
		console.error("Error fetching quiz:", error);
		return (
			<div className="text-red-500">
				Failed to load quiz. Please try again.
			</div>
		);
	}
}
