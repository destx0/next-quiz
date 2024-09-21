import {
	collection,
	getDocs,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchTestBatches = async (setTestBatches, setLoading) => {
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

export const fetchAllQuizzes = async (setAllQuizzes) => {
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

export const updateBatchOrder = async (batchId, newOrder) => {
	try {
		const batchRef = doc(db, "testBatches", batchId);
		await updateDoc(batchRef, { quizzes: newOrder });
		console.log(`Batch ${batchId} order updated in Firebase`);
	} catch (error) {
		console.error("Error updating batch order:", error);
	}
};