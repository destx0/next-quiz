"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { Tabs, Tab } from "@nextui-org/react";
import { fetchTestBatches, fetchAllQuizzes } from "./utils/firebaseUtils";
import { handleDeleteQuiz, handleAddToBatch, handleRemoveFromBatch } from "./utils/quizActions";
import { renderQuizzes, renderAllQuizzes } from "./components/QuizRenderers";

export default function SSCTestsPage() {
	const [testBatches, setTestBatches] = useState([]);
	const [allQuizzes, setAllQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				fetchTestBatches(setTestBatches, setLoading);
				fetchAllQuizzes(setAllQuizzes);
			} else {
				setLoading(false);
			}
		});

		return () => unsubscribe();
	}, []);

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
						renderQuizzes(
							tier1Batch.quizzes,
							tier1Batch.id,
							(batchId, quizId) => handleDeleteQuiz(batchId, quizId, setTestBatches, setAllQuizzes),
							(quizId, batchId) => handleRemoveFromBatch(quizId, batchId, setTestBatches)
						)}
				</Tab>
				<Tab key="pyq" title="Previous Year Questions">
					<h2 className="text-xl font-semibold my-4">
						{pyqBatch?.title || "Previous Year Questions"}
					</h2>
					{pyqBatch &&
						renderQuizzes(
							pyqBatch.quizzes,
							pyqBatch.id,
							(batchId, quizId) => handleDeleteQuiz(batchId, quizId, setTestBatches, setAllQuizzes),
							(quizId, batchId) => handleRemoveFromBatch(quizId, batchId, setTestBatches)
						)}
				</Tab>
				<Tab key="all" title="All Quizzes">
					<h2 className="text-xl font-semibold my-4">All Quizzes</h2>
					{renderAllQuizzes(
						allQuizzes,
						tier1Batch,
						pyqBatch,
						(batchId, quizId) => handleDeleteQuiz(batchId, quizId, setTestBatches, setAllQuizzes),
						(quizId, batchId) => handleAddToBatch(quizId, batchId, setTestBatches, allQuizzes),
						(quizId, batchId) => handleRemoveFromBatch(quizId, batchId, setTestBatches)
					)}
				</Tab>
			</Tabs>
		</div>
	);
}
