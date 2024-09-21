import {
	doc,
	deleteDoc,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const handleDeleteQuiz = async (batchId, quizId, setTestBatches, setAllQuizzes) => {
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

export const handleAddToBatch = async (quizId, batchId, setTestBatches, allQuizzes) => {
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

export const handleRemoveFromBatch = async (quizId, batchId, setTestBatches) => {
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