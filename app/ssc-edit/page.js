"use client";

import React, { useState, useEffect } from "react";
import {
	collection,
	getDocs,
	doc,
	deleteDoc,
	getDoc,
	updateDoc,
	arrayRemove,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Link from "next/link";
import { Tabs, Tab } from "@nextui-org/react";

export default function SSCTestsPage() {
	const [testBatches, setTestBatches] = useState([]);
	const [allQuizzes, setAllQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				fetchTestBatches();
				fetchAllQuizzes();
			} else {
				setLoading(false);
			}
		});

		return () => unsubscribe();
	}, []);

	const fetchTestBatches = async () => {
		try {
			console.log("Fetching test batches...");
			const batchIds = ["PxOtC4EjRhk1DH1B6j62", "NHI6vv2PzgQ899Sz4Rll"];
			const batchesData = await Promise.all(
				batchIds.map(async (batchId) => {
					const batchDocRef = doc(db, "testBatches", batchId);
					const batchDocSnap = await getDoc(batchDocRef);
					
					if (batchDocSnap.exists()) {
						const batchData = batchDocSnap.data();
						console.log("Batch data:", batchData);

						const quizzesWithDetails = await Promise.all(
							(batchData.quizzes || []).map(async (quizId) => {
								console.log("Fetching quiz:", quizId);
								const quizDocRef = doc(db, "quizzes", quizId);
								const quizDocSnap = await getDoc(quizDocRef);
								if (quizDocSnap.exists()) {
									console.log("Quiz data fetched:", quizId);
									return { id: quizId, ...quizDocSnap.data() };
								} else {
									console.log("Quiz not found:", quizId);
									return {
										id: quizId,
										title: `Quiz ${quizId} (Not Found)`,
										error: "Quiz not found",
									};
								}
							})
						);

						return {
							id: batchDocSnap.id,
							...batchData,
							quizzes: quizzesWithDetails,
						};
					} else {
						console.log("Batch not found:", batchId);
						return null;
					}
				})
			);

			console.log("Processed batch data:", batchesData);
			setTestBatches(batchesData.filter(Boolean));
		} catch (error) {
			console.error("Error fetching test batches:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchAllQuizzes = async () => {
		try {
			console.log("Fetching all quizzes...");
			const querySnapshot = await getDocs(collection(db, "quizzes"));
			console.log("All quizzes fetched:", querySnapshot.size);

			const quizzesData = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));

			console.log("Processed quizzes data:", quizzesData);
			setAllQuizzes(quizzesData);
		} catch (error) {
			console.error("Error fetching all quizzes:", error);
		}
	};

	const handleDeleteQuiz = async (batchId, quizId) => {
		if (window.confirm("Are you sure you want to delete this quiz?")) {
			try {
				// Delete the quiz document
				await deleteDoc(doc(db, "quizzes", quizId));

				// Remove the quiz from the batch
				const batchRef = doc(db, "testBatches", batchId);
				await updateDoc(batchRef, {
					quizzes: arrayRemove(quizId),
				});

				console.log(
					`Quiz ${quizId} deleted from Firestore and removed from batch ${batchId}`
				);

				// Update the local state
				setTestBatches((prevBatches) =>
					prevBatches.map((batch) =>
						batch.id === batchId
							? {
									...batch,
									quizzes: batch.quizzes.filter(
										(quiz) => quiz.id !== quizId
									),
								}
							: batch
					)
				);
			} catch (error) {
				console.error("Error deleting quiz:", error);
			}
		}
	};

	const renderBatchQuizzes = (batch) => (
		<div key={batch.id} className="mb-6">
			<h2 className="text-xl font-semibold mb-2">{batch.title}</h2>
			<p className="text-sm text-gray-600 mb-2">{batch.description}</p>
			{batch.quizzes.map((quiz) => (
				<div key={quiz.id} className="mb-2 flex items-center justify-between">
					<span>{quiz.title || `Quiz ID: ${quiz.id}`}</span>
					<div>
						<Link href={`/ssc-edit/${quiz.id}`} passHref>
							<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
								Edit
							</button>
						</Link>
						<button
							onClick={() => handleDeleteQuiz(batch.id, quiz.id)}
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	);

	if (loading) return <div>Loading...</div>;
	if (!user) return <div>Please sign in to view tests.</div>;

	const tier1Batch = testBatches.find(batch => batch.id === "PxOtC4EjRhk1DH1B6j62");
	const pyqBatch = testBatches.find(batch => batch.id === "NHI6vv2PzgQ899Sz4Rll");

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">SSC Tests</h1>
			<Tabs>
				<Tab key="tier1" title="Tier 1">
					{tier1Batch && renderBatchQuizzes(tier1Batch)}
				</Tab>
				<Tab key="pyq" title="Previous Year Questions">
					{pyqBatch && renderBatchQuizzes(pyqBatch)}
				</Tab>
				<Tab key="all" title="All Quizzes">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{allQuizzes.map((quiz) => (
							<div key={quiz.id} className="border p-4 rounded-lg">
								<h3 className="font-semibold mb-2">{quiz.title || `Quiz ID: ${quiz.id}`}</h3>
								<div className="flex justify-between items-center">
									<Link href={`/ssc-edit/${quiz.id}`} passHref>
										<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
											Edit
										</button>
									</Link>
									<button
										onClick={() => handleDeleteQuiz(null, quiz.id)}
										className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				</Tab>
			</Tabs>
		</div>
	);
}
