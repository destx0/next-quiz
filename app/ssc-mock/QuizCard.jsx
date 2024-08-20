import React, { useMemo } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import Link from "next/link";

const getRandomColor = () => {
	const hue = Math.floor(Math.random() * 360);
	return `hsl(${hue}, 90%, 85%)`;
};

const getRandomRotationClass = () => {
	const rotations = [
		"rotate-[-17deg]",
		"rotate-[17deg]",
		"rotate-[37deg]",
		"rotate-[-37deg]",
	];
	return rotations[Math.floor(Math.random() * rotations.length)];
};

const QuizCard = ({ quiz, index }) => {
	const backgroundColor = useMemo(() => getRandomColor(), []);
	const rotationClass = useMemo(() => getRandomRotationClass(), []);

	if (quiz.error) {
		return (
			<Card className="h-full bg-red-100">
				<CardBody>
					<p className="text-red-500">{quiz.error}</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="h-full overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
			<div
				className="absolute inset-0 bg-opacity-80 transition-all duration-300 ease-in-out group-hover:bg-opacity-100"
				style={{
					backgroundColor,
					backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 50%)
          `,
					backgroundBlendMode: "overlay, normal, normal",
				}}
			></div>
			<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
				<span
					className={`text-[10rem] font-bold text-white opacity-30 transform -translate-y-8 translate-x-16 ${rotationClass}`}
				>
					{index + 1}
				</span>
			</div>
			<CardBody className="p-4 flex flex-col justify-between relative z-10">
				<div>
					<h4 className="text-lg font-semibold mb-2 truncate text-gray-800 group-hover:text-gray-900">
						{quiz.title || "Untitled Quiz"}
					</h4>
					<p className="text-sm mb-2 truncate text-gray-600 group-hover:text-gray-700">
						{quiz.description}
					</p>
					<div className="text-xs text-gray-700 group-hover:text-gray-800">
						<p>Duration: {quiz.duration} min</p>
						{quiz.isCompleted && (
							<div className="mt-2 bg-white bg-opacity-50 p-2 rounded-md shadow-inner">
								<p className="font-semibold text-sm">
									Your Score:{" "}
									<span className="text-green-600 text-base">
										{quiz.score}
									</span>
								</p>
							</div>
						)}
					</div>
				</div>
				<div className="flex justify-end mt-4 space-x-2">
					{quiz.isCompleted && (
						<Link
							href={`/ssc-mock/${quiz.id}?quiz=true&showPreviousSubmission=true`}
							passHref
						>
							<Button
								size="sm"
								variant="shadow"
								color="secondary"
								className="transition-all duration-300 ease-in-out transform group-hover:scale-110 text-white font-semibold px-4 py-2 rounded-full bg-gradient-to-br from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500"
							>
								Show Submission
							</Button>
						</Link>
					)}
					<Link href={`/ssc-mock/${quiz.id}?quiz=true`} passHref>
						<Button
							size="sm"
							variant="shadow"
							color={quiz.isCompleted ? "secondary" : "primary"}
							className={`transition-all duration-300 ease-in-out transform group-hover:scale-110 text-white font-semibold px-4 py-2 rounded-full ${
								quiz.isCompleted
									? "bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
									: "bg-gradient-to-br from-blue-600 to-blue-900 hover:from-blue-700 hover:to-purple-600"
							}`}
						>
							{quiz.isCompleted ? "Retake Test" : "Start Test"}
						</Button>
					</Link>
				</div>
			</CardBody>
		</Card>
	);
};

export default QuizCard;
