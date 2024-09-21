"use client";

import React, { useState, useEffect } from "react";
import {
	collection,
	getDocs,
	doc,
	deleteDoc,
	getDoc,
	updateDoc,
	arrayUnion,
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
									return {
										id: quizId,
										...quizDocSnap.data(),
									};
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

			const quizzesData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
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
				await deleteDoc(doc(db, "quizzes", quizId));
				if (batchId) {
					const batchRef = doc(db, "testBatches", batchId);
					await updateDoc(batchRef, {
						quizzes: arrayRemove(quizId),
					});
				}
				console.log(
					`Quiz ${quizId} deleted from Firestore${batchId ? ` and removed from batch ${batchId}` : ""}`
				);

				// Update local state
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
				setAllQuizzes((prevQuizzes) =>
					prevQuizzes.filter((quiz) => quiz.id !== quizId)
				);
			} catch (error) {
				console.error("Error deleting quiz:", error);
			}
		}
	};

	const handleAddToBatch = async (quizId, batchId) => {
		try {
			const batchRef = doc(db, "testBatches", batchId);
			await updateDoc(batchRef, {
				quizzes: arrayUnion(quizId),
			});
			console.log(`Quiz ${quizId} added to batch ${batchId}`);

			// Update local state
			setTestBatches((prevBatches) =>
				prevBatches.map((batch) =>
					batch.id === batchId
						? {
								...batch,
								quizzes: [
									...batch.quizzes,
									allQuizzes.find((q) => q.id === quizId),
								],
							}
						: batch
				)
			);
		} catch (error) {
			console.error("Error adding quiz to batch:", error);
		}
	};

	const handleRemoveFromBatch = async (quizId, batchId) => {
		try {
			const batchRef = doc(db, "testBatches", batchId);
			await updateDoc(batchRef, {
				quizzes: arrayRemove(quizId),
			});
			console.log(`Quiz ${quizId} removed from batch ${batchId}`);

			// Update local state
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
			console.error("Error removing quiz from batch:", error);
		}
	};

	const renderQuizzes = (quizzes, batchId) => (
		<ul className="space-y-4">
			{quizzes.map((quiz) => (
				<li key={quiz.id} className="border p-4 rounded-lg">
					<div className="flex items-center justify-between flex-wrap gap-4">
						<h3 className="font-semibold">
							{quiz.title || `Quiz ID: ${quiz.id}`}
						</h3>
						<div className="flex flex-wrap gap-2">
							<Link href={`/ssc-edit/${quiz.id}`} passHref>
								<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
									Edit
								</button>
							</Link>
							<button
								onClick={() =>
									handleDeleteQuiz(batchId, quiz.id)
								}
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							>
								Delete
							</button>
							<button
								onClick={() =>
									handleRemoveFromBatch(quiz.id, batchId)
								}
								className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
							>
								Remove
							</button>
						</div>
					</div>
				</li>
			))}
		</ul>
	);

	const renderAllQuizzes = () => (
		<ul className="space-y-4">
			{allQuizzes.map((quiz) => {
				const inTier1 = tier1Batch?.quizzes.some(
					(q) => q.id === quiz.id
				);
				const inPYQ = pyqBatch?.quizzes.some((q) => q.id === quiz.id);

				return (
					<li key={quiz.id} className="border p-4 rounded-lg">
						<div className="flex items-center justify-between flex-wrap gap-4">
							<h3 className="font-semibold">
								{quiz.title || `Quiz ID: ${quiz.id}`}
							</h3>
							<div className="flex flex-wrap gap-2">
								<Link href={`/ssc-edit/${quiz.id}`} passHref>
									<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
										Edit
									</button>
								</Link>
								<button
									onClick={() =>
										handleDeleteQuiz(null, quiz.id)
									}
									className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
								>
									Delete
								</button>
								<button
									onClick={() =>
										inTier1
											? handleRemoveFromBatch(
													quiz.id,
													tier1Batch.id
												)
											: handleAddToBatch(
													quiz.id,
													tier1Batch.id
												)
									}
									className={`${inTier1 ? "bg-blue-300" : "bg-blue-500"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
								>
									{inTier1
										? "Remove from Tier 1"
										: "Add to Tier 1"}
								</button>
								<button
									onClick={() =>
										inPYQ
											? handleRemoveFromBatch(
													quiz.id,
													pyqBatch.id
												)
											: handleAddToBatch(
													quiz.id,
													pyqBatch.id
												)
									}
									className={`${inPYQ ? "bg-green-300" : "bg-green-500"} hover:bg-green-700 text-white font-bold py-2 px-4 rounded`}
								>
									{inPYQ ? "Remove from PYQ" : "Add to PYQ"}
								</button>
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);

	if (loading) return <div>Loading...</div>;
	if (!user) return <div>Please sign in to view tests.</div>;

	const tier1Batch = testBatches.find(
		(batch) => batch.id === "PxOtC4EjRhk1DH1B6j62"
	);
	const pyqBatch = testBatches.find(
		(batch) => batch.id === "NHI6vv2PzgQ899Sz4Rll"
	);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">SSC Tests</h1>
			<Tabs>
				<Tab key="tier1" title="Tier 1">
					<h2 className="text-xl font-semibold my-4">
						{tier1Batch?.title || "Tier 1"}
					</h2>
					{tier1Batch &&
						renderQuizzes(tier1Batch.quizzes, tier1Batch.id)}
				</Tab>
				<Tab key="pyq" title="Previous Year Questions">
					<h2 className="text-xl font-semibold my-4">
						{pyqBatch?.title || "Previous Year Questions"}
					</h2>
					{pyqBatch && renderQuizzes(pyqBatch.quizzes, pyqBatch.id)}
				</Tab>
				<Tab key="all" title="All Quizzes">
					<h2 className="text-xl font-semibold my-4">All Quizzes</h2>
					{renderAllQuizzes()}
				</Tab>
			</Tabs>
		</div>
	);
}
