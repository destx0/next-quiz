import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Import db from firebase.js
import { getQuiz } from "@/lib/firestore"; // Import getQuiz from firestore.js
import useAuthStore from "@/lib/zustand";
import BatchContainer from "./BatchContainer";

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
							return {
								id: doc.id,
								...batchData,
								quizzes: [],
							};
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

	const handleStartTest = (batchId, quizId) => {
		console.log(`Starting test for batch ${batchId}, quiz ${quizId}`);
		// Implement the logic to start the test
	};

	if (loading) {
		return <div>Loading quiz batches...</div>;
	}

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	if (!user) {
		return <div>Please log in to view quiz batches.</div>;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold mb-4">Available Quiz Batches</h2>
			{testBatches.length === 0 ? (
				<p>No quiz batches available at the moment.</p>
			) : (
				testBatches.map((batch) => (
					<BatchContainer
						key={batch.id}
						batch={batch}
						onStartTest={handleStartTest}
					/>
				))
			)}
		</div>
	);
};

export default QuizBatches;
