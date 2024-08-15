"use client";

import { db, auth } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const initializeUserData = async (userId) => {
	const userRef = doc(db, "users", userId);
	const userData = {
		ongoing: {},
		// Add other user-related fields as needed
	};

	await setDoc(userRef, userData);
};

export const addOngoingQuiz = async (quizId, submissionId) => {
	const user = auth.currentUser;
	if (!user) throw new Error("User not authenticated");

	const userRef = doc(db, "users", user.uid);

	await updateDoc(userRef, {
		[`ongoing.${quizId}`]: submissionId,
	});
};

export const removeOngoingQuiz = async (quizId) => {
	const user = auth.currentUser;
	if (!user) throw new Error("User not authenticated");

	const userRef = doc(db, "users", user.uid);

	await updateDoc(userRef, {
		[`ongoing.${quizId}`]: null,
	});
};

export const getOngoingQuizzes = async () => {
	const user = auth.currentUser;
	if (!user) throw new Error("User not authenticated");

	const userRef = doc(db, "users", user.uid);
	const userDoc = await getDoc(userRef);

	if (!userDoc.exists()) {
		await initializeUserData(user.uid);
		return {};
	}

	const userData = userDoc.data();
	return userData.ongoing || {};
};

export const continueOngoingQuiz = async (quizId) => {
	const ongoingQuizzes = await getOngoingQuizzes();
	return ongoingQuizzes[quizId] || null;
};
