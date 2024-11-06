import { db, auth } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
} from "firebase/firestore";

export const initializeUserData = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userData = {
    completedTests: [],
    scores: {},
    submissions: {},
  };

  await setDoc(userRef, userData);
};

export const updateUserQuizData = async (quizId, score, userSubmission) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await initializeUserData(user.uid);
  }

  // Create a new submission document
  const submissionRef = await addDoc(collection(db, "submissions"), {
    userId: user.uid,
    quizId: quizId,
    score: score,
    submission: userSubmission,
    timestamp: new Date(),
  });

  // Update user document with the new submission reference
  await updateDoc(userRef, {
    completedTests: arrayUnion(quizId),
    [`scores.${quizId}`]: score,
    [`submissions.${quizId}`]: submissionRef.id,
  });

  return submissionRef.id;
};

export const getUserSubmission = async (userId, quizId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const submissionId = userData.submissions[quizId];

  if (!submissionId) {
    throw new Error("Submission not found");
  }

  const submissionRef = doc(db, "submissions", submissionId);
  const submissionDoc = await getDoc(submissionRef);

  if (!submissionDoc.exists()) {
    throw new Error("Submission document not found");
  }

  return submissionDoc.data();
};
