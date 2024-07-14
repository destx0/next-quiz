// AnalysisDrawer.js
import React, { useMemo } from "react";
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
import { Button, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82CA9D",
	"#FFA07A",
];
const AnalysisDrawer = ({ isOpen, onOpenChange, quizData, score }) => {
	const calculateStatistics = () => {
		if (!quizData || !quizData.sections) {
			console.error("Invalid quizData structure");
			return null;
		}

		let totalCorrect = 0;
		let totalWrong = 0;
		let totalAttempted = 0;
		let totalTimeSpent = 0;
		const sectionStats = [];
		const timeData = [];

		quizData.sections.forEach((section) => {
			let sectionCorrect = 0;
			let sectionWrong = 0;
			let sectionAttempted = 0;
			let sectionTimeSpent = 0;

			section.questions.forEach((question) => {
				if (question.selectedOption !== null) {
					totalAttempted++;
					sectionAttempted++;
					if (question.selectedOption === question.correctAnswer) {
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

			timeData.push({
				name: section.name,
				value: sectionTimeSpent,
			});
		});

		const totalQuestions = quizData.sections.reduce(
			(acc, section) => acc + section.questions.length,
			0
		);
		const totalUnattempted = totalQuestions - totalAttempted;
		const remainingTime = Math.max(
			0,
			quizData.duration * 60 - totalTimeSpent
		);

		timeData.push({
			name: "Remaining Time",
			value: remainingTime,
		});

		return {
			totalCorrect,
			totalWrong,
			totalAttempted,
			totalUnattempted,
			totalQuestions,
			totalTimeSpent,
			remainingTime,
			sectionStats,
			timeData,
		};
	};

	const stats = useMemo(() => calculateStatistics(), [quizData]);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	const renderPieChart = (data, title) => {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardBody className="p-4">
					<h3 className="text-lg font-semibold mb-2 text-center">
						{title}
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={data.filter((item) => item.value > 0)}
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
							<Legend
								layout="vertical"
								align="right"
								verticalAlign="middle"
							/>
						</PieChart>
					</ResponsiveContainer>
					<div className="mt-4 text-sm">
						{data.map((item, index) => (
							<p key={index}>{`${item.name}: ${item.value}`}</p>
						))}
					</div>
				</CardBody>
			</Card>
		);
	};

	const renderAnalysis = () => {
		if (!stats) {
			return (
				<p>
					Error: Unable to calculate statistics. Please check the quiz
					data.
				</p>
			);
		}

		const overallData = [
			{ name: "Correct", value: stats.totalCorrect },
			{ name: "Wrong", value: stats.totalWrong },
			{ name: "Unattempted", value: stats.totalUnattempted },
		];

		return (
			<Tabs>
				<Tab key="overall" title="Overall Analysis">
					<div className="mt-4 space-y-6">
						<div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center">
							{renderPieChart(
								overallData,
								"Question Distribution"
							)}
							{renderPieChart(
								stats.timeData,
								"Time Distribution"
							)}
						</div>
						<Card className="w-full max-w-2xl mx-auto">
							<CardBody className="p-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p>
											Total Questions:{" "}
											{stats.totalQuestions}
										</p>
										<p>Attempted: {stats.totalAttempted}</p>
										<p>Correct: {stats.totalCorrect}</p>
										<p>Wrong: {stats.totalWrong}</p>
										<p>
											Unattempted:{" "}
											{stats.totalUnattempted}
										</p>
									</div>
									<div>
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
								</div>
							</CardBody>
						</Card>
					</div>
				</Tab>
				{quizData.sections.map((section, index) => (
					<Tab key={`section-${index}`} title={section.name}>
						<div className="mt-4 space-y-6">
							{renderPieChart(
								[
									{
										name: "Correct",
										value: stats.sectionStats[index]
											.correct,
									},
									{
										name: "Wrong",
										value: stats.sectionStats[index].wrong,
									},
									{
										name: "Unattempted",
										value: stats.sectionStats[index]
											.unattempted,
									},
								],
								"Question Distribution"
							)}
							<Card className="w-full max-w-2xl mx-auto">
								<CardBody className="p-4">
									<div className="flex flex-col md:flex-row justify-between">
										<div className="flex flex-col space-y-2 md:w-1/2">
											<p>
												Total Questions:{" "}
												{section.questions.length}
											</p>
											<p>
												Attempted:{" "}
												{stats.sectionStats[index]
													.correct +
													stats.sectionStats[index]
														.wrong}
											</p>
											<p>
												Correct:{" "}
												{
													stats.sectionStats[index]
														.correct
												}
											</p>
											<p>
												Wrong:{" "}
												{
													stats.sectionStats[index]
														.wrong
												}
											</p>
											<p>
												Unattempted:{" "}
												{
													stats.sectionStats[index]
														.unattempted
												}
											</p>
										</div>
										<div className="flex flex-col space-y-2 md:w-1/2 md:items-end mt-4 md:mt-0">
											<p>
												Time Spent:{" "}
												{formatTime(
													stats.sectionStats[index]
														.timeSpent
												)}
											</p>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					</Tab>
				))}
			</Tabs>
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
