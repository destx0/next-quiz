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
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
				unattempted: section.questions.length - sectionAttempted,
				timeSpent: sectionTimeSpent,
			});
		});

		const totalQuestions = quizData.sections.reduce(
			(acc, section) => acc + section.questions.length,
			0
		);
		const totalUnattempted = totalQuestions - totalAttempted;
		const remainingTime = quizData.duration * 60 - totalTimeSpent;

		return {
			totalCorrect,
			totalWrong,
			totalAttempted,
			totalUnattempted,
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

	const renderPieChart = (data) => {
		return (
			<ResponsiveContainer width="100%" height={300}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
						label={({ name, percent }) =>
							`${name} ${(percent * 100).toFixed(0)}%`
						}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>
		);
	};

	const renderBarChart = (data) => {
		return (
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="correct" fill="#0088FE" />
					<Bar dataKey="wrong" fill="#FF8042" />
					<Bar dataKey="unattempted" fill="#FFBB28" />
				</BarChart>
			</ResponsiveContainer>
		);
	};

	const renderAnalysis = () => {
		const stats = calculateStatistics();
		const overallData = [
			{ name: "Correct", value: stats.totalCorrect },
			{ name: "Wrong", value: stats.totalWrong },
			{ name: "Unattempted", value: stats.totalUnattempted },
		];

		return (
			<div className="space-y-6">
				<h2 className="text-xl font-semibold">Quiz Analysis</h2>

				<Card>
					<CardHeader>
						<CardTitle>Overall Statistics</CardTitle>
						<CardDescription>
							Correct, Wrong, and Unattempted Questions
						</CardDescription>
					</CardHeader>
					<CardContent>
						{renderPieChart(overallData)}
						<div className="mt-4">
							<p>Total Questions: {stats.totalQuestions}</p>
							<p>Attempted: {stats.totalAttempted}</p>
							<p>Correct: {stats.totalCorrect}</p>
							<p>Wrong: {stats.totalWrong}</p>
							<p>Unattempted: {stats.totalUnattempted}</p>
							<p>
								Total Time Taken:{" "}
								{formatTime(stats.totalTimeSpent)}
							</p>
							<p>
								Remaining Time:{" "}
								{formatTime(stats.remainingTime)}
							</p>
							<p>Score: {score}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Section-wise Statistics</CardTitle>
						<CardDescription>
							Correct, Wrong, and Unattempted Questions by Section
						</CardDescription>
					</CardHeader>
					<CardContent>
						{renderBarChart(stats.sectionStats)}
						<div className="mt-4 space-y-4">
							{stats.sectionStats.map((sectionStat, index) => (
								<div
									key={index}
									className="bg-gray-100 p-4 rounded"
								>
									<h4 className="font-medium">
										{sectionStat.name}
									</h4>
									<p>
										Attempted:{" "}
										{sectionStat.correct +
											sectionStat.wrong}
									</p>
									<p>Correct: {sectionStat.correct}</p>
									<p>Wrong: {sectionStat.wrong}</p>
									<p>
										Unattempted: {sectionStat.unattempted}
									</p>
									<p>
										Time Spent:{" "}
										{formatTime(sectionStat.timeSpent)}
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Detailed Question Analysis</CardTitle>
					</CardHeader>
					<CardContent>
						{quizData.sections.map((section, sectionIndex) => (
							<div key={sectionIndex} className="mb-6">
								<h4 className="font-medium mb-2">
									{section.name}
								</h4>
								{section.questions.map(
									(question, questionIndex) => (
										<div
											key={questionIndex}
											className="mb-4 p-4 bg-gray-100 rounded"
										>
											<p className="font-medium">
												Question {questionIndex + 1}
											</p>
											<p className="mt-1">
												{question.text}
											</p>
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
															question
																.correctOption
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
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quiz Data JSON</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="bg-gray-100 p-4 rounded overflow-x-auto">
							{JSON.stringify(quizData, null, 2)}
						</pre>
					</CardContent>
				</Card>
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
