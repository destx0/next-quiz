"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { Tabs, Tab } from "@nextui-org/react";
import { fetchTestBatches, fetchAllQuizzes, updateBatchOrder } from "./utils/firebaseUtils";
import { handleDeleteQuiz, handleAddToBatch, handleRemoveFromBatch, updateQuizMetadata } from "./utils/quizActions";
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

        const newQuizzes = [...batch.quizzes];
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= newQuizzes.length) return;

        [newQuizzes[currentIndex], newQuizzes[newIndex]] = [newQuizzes[newIndex], newQuizzes[currentIndex]];

        const newTestBatches = testBatches.map((b) =>
            b.id === batchId ? { ...b, quizzes: newQuizzes } : b
        );

        setTestBatches(newTestBatches);

        // Update Firebase
        await updateBatchOrder(batchId, newQuizzes.map((q) => q.id));
    };

    const handleUpdateQuizMetadata = async (updatedQuiz) => {
        try {
            await updateQuizMetadata(updatedQuiz.id, updatedQuiz);
            setTestBatches(prevBatches =>
                prevBatches.map(batch => ({
                    ...batch,
                    quizzes: batch.quizzes.map(quiz =>
                        quiz.id === updatedQuiz.id ? updatedQuiz : quiz
                    )
                }))
            );
            setAllQuizzes(prevQuizzes =>
                prevQuizzes.map(quiz =>
                    quiz.id === updatedQuiz.id ? updatedQuiz : quiz
                )
            );
        } catch (error) {
            console.error("Error updating quiz metadata:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please sign in to view tests.</div>;

    const tier1Batch = testBatches.find(
        (batch) => batch.id === "PxOtC4EjRhk1DH1B6j62"
    );
    const pyqBatch = testBatches.find(
        (batch) => batch.id === "NHI6vv2PzgQ899Sz4Rll"
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">SSC Tests</h1>
            <Tabs>
                <Tab key="tier1" title="Tier 1">
                    <h2 className="text-xl font-semibold my-4">
                        {tier1Batch?.title || "Tier 1"}
                    </h2>
                    {tier1Batch && (
                        <QuizList
                            quizzes={tier1Batch.quizzes}
                            batchId={tier1Batch.id}
                            handleDeleteQuiz={(quizId) => handleDeleteQuiz(tier1Batch.id, quizId, setTestBatches, setAllQuizzes)}
                            handleRemoveFromBatch={(quizId) => handleRemoveFromBatch(quizId, tier1Batch.id, setTestBatches)}
                            handleMoveQuiz={(index, direction) => handleMoveQuiz(tier1Batch.id, index, direction)}
                            handleUpdateQuizMetadata={handleUpdateQuizMetadata}
                        />
                    )}
                </Tab>
                <Tab key="pyq" title="Previous Year Questions">
                    <h2 className="text-xl font-semibold my-4">
                        {pyqBatch?.title || "Previous Year Questions"}
                    </h2>
                    {pyqBatch && (
                        <QuizList
                            quizzes={pyqBatch.quizzes}
                            batchId={pyqBatch.id}
                            handleDeleteQuiz={(quizId) => handleDeleteQuiz(pyqBatch.id, quizId, setTestBatches, setAllQuizzes)}
                            handleRemoveFromBatch={(quizId) => handleRemoveFromBatch(quizId, pyqBatch.id, setTestBatches)}
                            handleMoveQuiz={(index, direction) => handleMoveQuiz(pyqBatch.id, index, direction)}
                            handleUpdateQuizMetadata={handleUpdateQuizMetadata}
                        />
                    )}
                </Tab>
                <Tab key="all" title="All Quizzes">
                    <h2 className="text-xl font-semibold my-4">All Quizzes</h2>
                    <AllQuizList
                        allQuizzes={allQuizzes}
                        tier1Batch={tier1Batch}
                        pyqBatch={pyqBatch}
                        handleDeleteQuiz={(quizId) => handleDeleteQuiz(null, quizId, setTestBatches, setAllQuizzes)}
                        handleAddToBatch={(quizId, batchId) => handleAddToBatch(quizId, batchId, setTestBatches, allQuizzes)}
                        handleRemoveFromBatch={(quizId, batchId) => handleRemoveFromBatch(quizId, batchId, setTestBatches)}
                    />
                </Tab>
            </Tabs>
        </div>
    );
}
