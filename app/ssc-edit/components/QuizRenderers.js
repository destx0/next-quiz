import Link from "next/link";

export const renderQuizzes = (quizzes, batchId, handleDeleteQuiz, handleRemoveFromBatch) => (
    <ul className="space-y-4">
        {quizzes.map((quiz) => (
            <li key={quiz.id} className="border p-4 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h3 className="font-semibold">
                        {quiz.title || `Quiz ID: ${quiz.id}`}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <Link href={`/ssc-edit/${quiz.id}`} passHref>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Edit
                            </button>
                        </Link>
                        <button
                            onClick={() => handleDeleteQuiz(batchId, quiz.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => handleRemoveFromBatch(quiz.id, batchId)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </li>
        ))}
    </ul>
);

export const renderAllQuizzes = (allQuizzes, tier1Batch, pyqBatch, handleDeleteQuiz, handleAddToBatch, handleRemoveFromBatch) => (
    <ul className="space-y-4">
        {allQuizzes.map((quiz) => {
            const inTier1 = tier1Batch?.quizzes.some((q) => q.id === quiz.id);
            const inPYQ = pyqBatch?.quizzes.some((q) => q.id === quiz.id);

            return (
                <li key={quiz.id} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <h3 className="font-semibold">
                            {quiz.title || `Quiz ID: ${quiz.id}`}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Link href={`/ssc-edit/${quiz.id}`} passHref>
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    Edit
                                </button>
                            </Link>
                            <button
                                onClick={() => handleDeleteQuiz(null, quiz.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() =>
                                    inTier1
                                        ? handleRemoveFromBatch(quiz.id, tier1Batch.id)
                                        : handleAddToBatch(quiz.id, tier1Batch.id)
                                }
                                className={`${inTier1 ? "bg-blue-300" : "bg-blue-500"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
                            >
                                {inTier1 ? "Remove from Tier 1" : "Add to Tier 1"}
                            </button>
                            <button
                                onClick={() =>
                                    inPYQ
                                        ? handleRemoveFromBatch(quiz.id, pyqBatch.id)
                                        : handleAddToBatch(quiz.id, pyqBatch.id)
                                }
                                className={`${inPYQ ? "bg-green-300" : "bg-green-500"} hover:bg-green-700 text-white font-bold py-2 px-4 rounded`}
                            >
                                {inPYQ ? "Remove from PYQ" : "Add to PYQ"}
                            </button>
                        </div>
                    </div>
                </li>
            );
        })}
    </ul>
);