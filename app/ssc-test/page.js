"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
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
      console.log("Fetching test batches...");
      const querySnapshot = await getDocs(collection(db, "testBatches"));
      console.log("Test batches fetched:", querySnapshot.size);

      const batchesData = await Promise.all(
        querySnapshot.docs.map(async (batchDoc) => {
          const batchData = batchDoc.data();
          console.log("Batch data:", batchData);

          const quizzesWithDetails = await Promise.all(
            (batchData.quizzes || []).map(async (quizId) => {
              console.log("Fetching quiz:", quizId);
              const quizDocRef = doc(db, "quizzes", quizId);
              const quizDocSnap = await getDoc(quizDocRef);
              if (quizDocSnap.exists()) {
                console.log("Quiz data fetched:", quizId);
                return { id: quizId, ...quizDocSnap.data() };
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
            id: batchDoc.id,
            ...batchData,
            quizzes: quizzesWithDetails,
          };
        })
      );

      console.log("Processed batch data:", batchesData);
      setTestBatches(batchesData);
    } catch (error) {
      console.error("Error fetching test batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (batchId, quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        // Delete the quiz document
        await deleteDoc(doc(db, "quizzes", quizId));

        // Remove the quiz from the batch
        const batchRef = doc(db, "testBatches", batchId);
        await updateDoc(batchRef, {
          quizzes: arrayRemove(quizId),
        });

        console.log(
          `Quiz ${quizId} deleted from Firestore and removed from batch ${batchId}`
        );

        // Update the local state
        setTestBatches((prevBatches) =>
          prevBatches.map((batch) =>
            batch.id === batchId
              ? {
                  ...batch,
                  quizzes: batch.quizzes.filter((quiz) => quiz.id !== quizId),
                }
              : batch
          )
        );
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in to view tests.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SSC Tests</h1>
      {testBatches.map((batch) => (
        <div key={batch.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{batch.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{batch.description}</p>
          {batch.quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="mb-2 flex items-center justify-between"
            >
              <span>{quiz.title || `Quiz ID: ${quiz.id}`}</span>
              <div>
                <Link href={`/ssc-test/${quiz.id}`} passHref>
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteQuiz(batch.id, quiz.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
