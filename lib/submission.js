"use client";

import { db, auth } from "./firebase";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

export const createSubmission = async (quizId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const submissionId = `${user.uid}_${quizId}_${Date.now()}`;
  const submissionRef = doc(db, "submissions", submissionId);

  // Fetch the quiz structure
  const quizDoc = await getDoc(doc(db, "quizzes", quizId));
  if (!quizDoc.exists()) {
    throw new Error(`Quiz with ID ${quizId} does not exist`);
  }
  const quizData = quizDoc.data();

  // Prepare the submission structure
  const submissionData = {
    quizId: quizId,
    userId: user.uid,
    startTime: serverTimestamp(),
    isFinished: false,
    sections: quizData.sections.map((section) => ({
      name: section.name,
      problems: section.questions.map((question) => ({
        questionId: question.id,
        userAnswer: null,
        isCorrect: null,
      })),
    })),
  };

  await setDoc(submissionRef, submissionData);
  return submissionId;
};

export const updateSubmission = async (
  submissionId,
  sectionIndex,
  problemIndex,
  userAnswer
) => {
  const submissionRef = doc(db, "submissions", submissionId);
  const updatePath = `sections.${sectionIndex}.problems.${problemIndex}`;

  await updateDoc(submissionRef, {
    [`${updatePath}.userAnswer`]: userAnswer,
  });
};

export const finishSubmission = async (submissionId) => {
  const submissionRef = doc(db, "submissions", submissionId);

  // Fetch the current submission data
  const submissionDoc = await getDoc(submissionRef);
  if (!submissionDoc.exists()) {
    throw new Error(`Submission with ID ${submissionId} does not exist`);
  }
  const submissionData = submissionDoc.data();

  // Calculate correctness for each answer
  const updatedSections = await Promise.all(
    submissionData.sections.map(async (section) => {
      const updatedProblems = await Promise.all(
        section.problems.map(async (problem) => {
          const questionDoc = await getDoc(
            doc(db, "questions", problem.questionId)
          );
          const questionData = questionDoc.data();
          const isCorrect = problem.userAnswer === questionData.correctAnswer;
          return { ...problem, isCorrect };
        })
      );
      return { ...section, problems: updatedProblems };
    })
  );

  // Update the submission with calculated results and finish time
  await updateDoc(submissionRef, {
    sections: updatedSections,
    isFinished: true,
    endTime: serverTimestamp(),
  });
};

export const getSubmission = async (submissionId) => {
  const submissionDoc = await getDoc(doc(db, "submissions", submissionId));
  if (!submissionDoc.exists()) {
    throw new Error(`Submission with ID ${submissionId} does not exist`);
  }
  return { id: submissionDoc.id, ...submissionDoc.data() };
};
