import { db, auth } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const initializeUserData = async (userId) => {
	const userRef = doc(db, "users", userId);
	const userData = {
		completedTests: [],
		scores: {},
	};

	await setDoc(userRef, userData);
};

export const updateUserQuizData = async (quizId, score) => {
	const user = auth.currentUser;
	if (!user) throw new Error("User not authenticated");

	const userRef = doc(db, "users", user.uid);
	const userDoc = await getDoc(userRef);

	if (!userDoc.exists()) {
		await initializeUserData(user.uid);
	}

	await updateDoc(userRef, {
		completedTests: arrayUnion(quizId),
		[`scores.${quizId}`]: score,
	});
};
