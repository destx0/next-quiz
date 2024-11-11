"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { Tabs, Tab } from "@nextui-org/react";
import {
  fetchTestBatches,
  fetchAllQuizzes,
  updateBatchOrder,
} from "./utils/firebaseUtils";
import {
  handleDeleteQuiz,
  handleAddToBatch,
  handleRemoveFromBatch,
  updateQuizMetadata,
} from "./utils/quizActions";
import { QuizList, AllQuizList } from "./components/QuizRenderers";

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

  const handleMoveQuiz = async (batchId, currentIndex, direction) => {
    const batch = testBatches.find((b) => b.id === batchId);
    if (!batch) return;

    const newExamDetails = [...batch.examDetails];
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= newExamDetails.length) return;

    [newExamDetails[currentIndex], newExamDetails[newIndex]] = [
      newExamDetails[newIndex],
      newExamDetails[currentIndex],
    ];

    const newTestBatches = testBatches.map((b) =>
      b.id === batchId ? { ...b, examDetails: newExamDetails } : b
    );

    setTestBatches(newTestBatches);

    // Update Firebase
    await updateBatchOrder(batchId, newExamDetails);
  };

  const handleUpdateQuizMetadata = async (updatedQuiz) => {
    try {
      await updateQuizMetadata(updatedQuiz.id, updatedQuiz);
      setTestBatches((prevBatches) =>
        prevBatches.map((batch) => ({
          ...batch,
          examDetails: batch.examDetails.map((quiz) =>
            quiz.id === updatedQuiz.id ? updatedQuiz : quiz
          ),
        }))
      );
      setAllQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === updatedQuiz.id ? updatedQuiz : quiz
        )
      );
    } catch (error) {
      console.error("Error updating quiz metadata:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in to view tests.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SSC Tests</h1>
      <Tabs>
        {testBatches.map((batch) => (
          <Tab key={batch.id} title={batch.title || "Unnamed Batch"}>
            <h2 className="text-xl font-semibold my-4">
              {batch.title || "Unnamed Batch"}
            </h2>
            <QuizList
              examDetails={batch.examDetails}
              batchId={batch.id}
              handleDeleteQuiz={(quizId) =>
                handleDeleteQuiz(batch.id, quizId, setTestBatches, setAllQuizzes)
              }
              handleRemoveFromBatch={(quizId) =>
                handleRemoveFromBatch(quizId, batch.id, setTestBatches)
              }
              handleMoveQuiz={(index, direction) =>
                handleMoveQuiz(batch.id, index, direction)
              }
              handleUpdateQuizMetadata={handleUpdateQuizMetadata}
            />
          </Tab>
        ))}
        <Tab key="all" title="All Quizzes">
          <h2 className="text-xl font-semibold my-4">All Quizzes</h2>
          <AllQuizList
            allQuizzes={allQuizzes}
            testBatches={testBatches}
            handleDeleteQuiz={(quizId) =>
              handleDeleteQuiz(null, quizId, setTestBatches, setAllQuizzes)
            }
            handleAddToBatch={(quizId, batchId) =>
              handleAddToBatch(quizId, batchId, setTestBatches, allQuizzes)
            }
            handleRemoveFromBatch={(quizId, batchId) =>
              handleRemoveFromBatch(quizId, batchId, setTestBatches)
            }
            handleUpdateQuizMetadata={handleUpdateQuizMetadata}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
