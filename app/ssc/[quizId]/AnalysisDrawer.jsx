// AnalysisDrawer.js
import React from "react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@nextui-org/react";

const AnalysisDrawer = ({ isOpen, onOpenChange, quizData, score }) => {
	const calculateStatistics = () => {
		let totalCorrect = 0;
		let totalWrong = 0;
		let totalAttempted = 0;
		let totalTimeSpent = 0;
		const sectionStats = [];

		quizData.sections.forEach((section) => {
			let sectionCorrect = 0;
			let sectionWrong = 0;
			let sectionAttempted = 0;
			let sectionTimeSpent = 0;

			section.questions.forEach((question) => {
				if (question.selectedOption !== null) {
					totalAttempted++;
					sectionAttempted++;
					if (question.isCorrect) {
						totalCorrect++;
						sectionCorrect++;
					} else {
						totalWrong++;
						sectionWrong++;
					}
				}
				totalTimeSpent += question.timeSpent || 0;
				sectionTimeSpent += question.timeSpent || 0;
			});

			sectionStats.push({
				name: section.name,
				correct: sectionCorrect,
				wrong: sectionWrong,
				attempted: sectionAttempted,
				timeSpent: sectionTimeSpent,
			});
		});

		const totalQuestions = quizData.sections.reduce(
			(acc, section) => acc + section.questions.length,
			0
		);
		const remainingTime = quizData.duration * 60 - totalTimeSpent;

		return {
			totalCorrect,
			totalWrong,
			totalAttempted,
			totalQuestions,
			totalTimeSpent,
			remainingTime,
			sectionStats,
		};
	};

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	const renderAnalysis = () => {
		const stats = calculateStatistics();

		return (
			<div className="space-y-6">
				<h2 className="text-xl font-semibold">Quiz Analysis</h2>

				<div className="bg-gray-100 p-4 rounded">
					<h3 className="text-lg font-medium mb-2">
						Overall Statistics
					</h3>
					<p>Total Questions: {stats.totalQuestions}</p>
					<p>Attempted: {stats.totalAttempted}</p>
					<p>Correct: {stats.totalCorrect}</p>
					<p>Wrong: {stats.totalWrong}</p>
					<p>Total Time Taken: {formatTime(stats.totalTimeSpent)}</p>
					<p>Remaining Time: {formatTime(stats.remainingTime)}</p>
					<p>Score: {score}</p>
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-medium">
						Section-wise Statistics
					</h3>
					{stats.sectionStats.map((sectionStat, index) => (
						<div key={index} className="bg-gray-100 p-4 rounded">
							<h4 className="font-medium">{sectionStat.name}</h4>
							<p>Attempted: {sectionStat.attempted}</p>
							<p>Correct: {sectionStat.correct}</p>
							<p>Wrong: {sectionStat.wrong}</p>
							<p>
								Time Spent: {formatTime(sectionStat.timeSpent)}
							</p>
						</div>
					))}
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-medium">
						Detailed Question Analysis
					</h3>
					{quizData.sections.map((section, sectionIndex) => (
						<div key={sectionIndex} className="mb-6">
							<h4 className="font-medium mb-2">{section.name}</h4>
							{section.questions.map(
								(question, questionIndex) => (
									<div
										key={questionIndex}
										className="mb-4 p-4 bg-gray-100 rounded"
									>
										<p className="font-medium">
											Question {questionIndex + 1}
										</p>
										<p className="mt-1">{question.text}</p>
										<p className="mt-2">
											Your answer:{" "}
											<span
												className={
													question.isCorrect
														? "text-green-600"
														: "text-red-600"
												}
											>
												{question.selectedOption !==
												null
													? question.options[
															question
																.selectedOption
														]
													: "Not answered"}
											</span>
										</p>
										{!question.isCorrect && (
											<p className="mt-1 text-green-600">
												Correct answer:{" "}
												{
													question.options[
														question.correctOption
													]
												}
											</p>
										)}
										<p className="mt-1">
											Time spent:{" "}
											{formatTime(
												question.timeSpent || 0
											)}
										</p>
									</div>
								)
							)}
						</div>
					))}
				</div>

				<div className="mt-6">
					<h3 className="text-lg font-medium mb-2">Quiz Data JSON</h3>
					<pre className="bg-gray-100 p-4 rounded overflow-x-auto">
						{JSON.stringify(quizData, null, 2)}
					</pre>
				</div>
			</div>
		);
	};

	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerTrigger asChild>
				<Button color="primary" variant="shadow" size="sm">
					Show Analysis
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Quiz Analysis</DrawerTitle>
					<DrawerDescription>
						Review your performance and detailed statistics.
					</DrawerDescription>
				</DrawerHeader>
				<div className="p-4 overflow-y-auto max-h-[70vh]">
					{renderAnalysis()}
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default AnalysisDrawer;
