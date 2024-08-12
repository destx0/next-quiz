import { db, auth } from "./firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export const createSubmission = async (quizId) => {
	const user = auth.currentUser;
	if (!user) throw new Error("User not authenticated");

	const submissionId = `${user.uid}_${quizId}_${Date.now()}`;
	const submissionRef = doc(db, "submissions", submissionId);

	const submissionData = {
		quizId: quizId,
		userId: user.uid,
		startTime: serverTimestamp(),
		isFinished: false,
		sections: [],
	};

	await setDoc(submissionRef, submissionData);
	return submissionId;
};

export const updateSubmission = async (
	submissionId,
	sectionIndex,
	problemIndex,
	data
) => {
	const submissionRef = doc(db, "submissions", submissionId);
	const updatePath = `sections.${sectionIndex}.problems.${problemIndex}`;

	await updateDoc(submissionRef, {
		[updatePath]: data,
	});
};

export const finishSubmission = async (submissionId) => {
	const submissionRef = doc(db, "submissions", submissionId);
	await updateDoc(submissionRef, {
		isFinished: true,
		endTime: serverTimestamp(),
	});
};
