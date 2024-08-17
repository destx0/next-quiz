"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Link from "next/link";

export default function SSCTestsPage() {
	const [testBatches, setTestBatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				fetchTestBatches();
			} else {
				setLoading(false);
			}
		});

		return () => unsubscribe();
	}, []);

	const fetchTestBatches = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, "testBatches"));
			const batchesData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				quizzes: doc.data().quizzes || [],
			}));
			setTestBatches(batchesData);
		} catch (error) {
			console.error("Error fetching test batches:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (!user) return <div>Please sign in to view tests.</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">SSC Tests</h1>
			{testBatches.map((batch) => (
				<div key={batch.id} className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{batch.title}
					</h2>
					{batch.quizzes.map((quizId) => (
						<div
							key={quizId}
							className="mb-2 flex items-center justify-between"
						>
							<span>Quiz ID: {quizId}</span>
							<Link
								href={`/ssc-mock/${quizId}?quiz=true`}
								passHref
							>
								<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
									Start Test
								</button>
							</Link>
						</div>
					))}
				</div>
			))}
		</div>
	);
}
