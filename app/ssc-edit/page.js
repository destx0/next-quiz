"use client";

import React, { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { Tabs, Tab } from "@nextui-org/react";
import { handleDeleteQuiz, handleRemoveFromBatch } from "./utils/quizActions";
import { QuizList } from "./components/QuizRenderers";
import useTestBatchStore from "./store/testBatchStore";

export default function SSCTestsPage() {
  const {
    testBatches,
    loading,
    user,
    setUser,
    fetchTestBatches,
    updateBatchOrder,
    updateQuizMetadata,
  } = useTestBatchStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTestBatches();
      }
    });

    return () => unsubscribe();
  }, [setUser, fetchTestBatches]);

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

    await updateBatchOrder(batchId, newExamDetails);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in to view tests.</div>;

  return (
    <div className="p-4">
      <Tabs>
        {testBatches.map((batch) => (
          <Tab key={batch.id} title={batch.title || "Unnamed Batch"}>
            <QuizList
              batchTitle={batch.title}
              examDetails={batch.examDetails}
              batchId={batch.id}
              handleDeleteQuiz={(quizId) =>
                handleDeleteQuiz(
                  batch.id,
                  quizId,
                  useTestBatchStore.getState().setTestBatches
                )
              }
              handleRemoveFromBatch={(quizId) =>
                handleRemoveFromBatch(
                  quizId,
                  batch.id,
                  useTestBatchStore.getState().setTestBatches
                )
              }
              handleMoveQuiz={(index, direction) =>
                handleMoveQuiz(batch.id, index, direction)
              }
              handleUpdateQuizMetadata={updateQuizMetadata}
              setTestBatches={useTestBatchStore.getState().setTestBatches}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
