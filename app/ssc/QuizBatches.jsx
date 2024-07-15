import React, { useState, useEffect, useMemo } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getQuiz } from "@/lib/firestore";
import useAuthStore from "@/lib/zustand";
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

const QuizCard = ({ quiz, batchId, index }) => {
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
					animation: "pulse 3s infinite alternate",
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
					</div>
				</div>
				<div className="flex justify-end">
					<Link href={`/ssc/${quiz.id}?quiz=true`} passHref>
						<Button
							size="sm"
							variant="shadow"
							color="primary"
							className="transition-all duration-300 ease-in-out transform group-hover:scale-110 bg-gradient-to-br from-blue-600 to-blue-900 text-white font-semibold px-4 py-2 rounded-full hover:from-blue-700 hover:to-purple-600"
						>
							Start Test
						</Button>
					</Link>
				</div>
			</CardBody>
		</Card>
	);
};

const BatchContainer = ({ batch }) => (
	<Card className="mb-8 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
		<CardBody className="p-6">
			<h3 className="text-2xl font-bold mb-4 transition-all duration-300 ease-in-out hover:text-primary">
				{batch.title}
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{batch.quizzes.map((quiz, index) => (
					<QuizCard
						key={quiz.id}
						quiz={quiz}
						batchId={batch.id}
						index={index}
					/>
				))}
			</div>
		</CardBody>
	</Card>
);

const QuizBatches = () => {
	const [testBatches, setTestBatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useAuthStore();

	useEffect(() => {
		const fetchTestBatches = async () => {
			if (!user) {
				setLoading(false);
				return;
			}

			try {
				const querySnapshot = await getDocs(
					collection(db, "testBatches")
				);
				const batchesData = await Promise.all(
					querySnapshot.docs.map(async (doc) => {
						const batchData = doc.data();
						if (
							!batchData.quizzes ||
							!Array.isArray(batchData.quizzes)
						) {
							console.warn(
								`Batch ${doc.id} has no quizzes or quizzes is not an array`
							);
							return { id: doc.id, ...batchData, quizzes: [] };
						}
						const quizzesWithDetails = await Promise.all(
							batchData.quizzes.map(async (quizId) => {
								try {
									const quizData = await getQuiz(quizId);
									return { id: quizId, ...quizData };
								} catch (error) {
									console.error(
										`Error fetching quiz ${quizId}:`,
										error
									);
									return {
										id: quizId,
										error: "Failed to load quiz",
									};
								}
							})
						);
						return {
							id: doc.id,
							...batchData,
							quizzes: quizzesWithDetails,
						};
					})
				);
				setTestBatches(batchesData);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching test batches:", error);
				setError(
					"Failed to load quiz batches. Please try again later."
				);
				setLoading(false);
			}
		};

		fetchTestBatches();
	}, [user]);

	if (loading)
		return (
			<div className="text-center py-8 text-xl">
				Loading quiz batches...
			</div>
		);
	if (error)
		return (
			<div className="text-center py-8 text-xl text-red-500">{error}</div>
		);
	if (!user)
		return (
			<div className="text-center py-8 text-xl">
				Please log in to view quiz batches.
			</div>
		);

	return (
		<div className="space-y-8 p-6 min-h-screen">
			<h2 className="text-3xl font-bold mb-6 transition-all duration-300 ease-in-out hover:text-primary">
				Available Quiz Batches
			</h2>
			{testBatches.length === 0 ? (
				<p className="text-center text-xl">
					No quiz batches available at the moment.
				</p>
			) : (
				testBatches.map((batch) => (
					<BatchContainer key={batch.id} batch={batch} />
				))
			)}
		</div>
	);
};

export default QuizBatches;
