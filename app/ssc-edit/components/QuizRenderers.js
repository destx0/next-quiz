import Link from "next/link";
import { downloadQuiz } from "../utils/firebaseUtils";
import { useState } from "react";
import QuizMetadataModal from "./QuizMetadataModal";

export const QuizList = ({
  examDetails,
  batchId,
  handleDeleteQuiz,
  handleRemoveFromBatch,
  handleMoveQuiz,
  handleUpdateQuizMetadata,
}) => {
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuizzes, setSelectedQuizzes] = useState(new Set());

  const handleSelectQuiz = (quizId) => {
    const newSelected = new Set(selectedQuizzes);
    if (newSelected.has(quizId)) {
      newSelected.delete(quizId);
    } else {
      newSelected.add(quizId);
    }
    setSelectedQuizzes(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedQuizzes.size === examDetails.length) {
      setSelectedQuizzes(new Set());
    } else {
      setSelectedQuizzes(new Set(examDetails.map((exam) => exam.primaryQuizId)));
    }
  };

  const handleDownloadSelected = async () => {
    for (const quizId of selectedQuizzes) {
      await downloadQuiz(quizId);
    }
    setSelectedQuizzes(new Set());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quizzes</h2>
        {examDetails.length > 0 && (
          <div className="flex gap-2 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedQuizzes.size === examDetails.length}
                onChange={handleSelectAll}
                className="form-checkbox h-5 w-5"
              />
              Select All
            </label>
            {selectedQuizzes.size > 0 && (
              <button
                onClick={handleDownloadSelected}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Selected ({selectedQuizzes.size})
              </button>
            )}
          </div>
        )}
      </div>
      <ul className="space-y-4">
        {examDetails.map((exam, index) => (
          <li key={exam.primaryQuizId} className="border p-4 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedQuizzes.has(exam.primaryQuizId)}
                  onChange={() => handleSelectQuiz(exam.primaryQuizId)}
                  className="form-checkbox h-5 w-5"
                />
                <div className="flex flex-col">
                  <button
                    onClick={() => handleMoveQuiz(index, "up")}
                    disabled={index === 0}
                    className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMoveQuiz(index, "down")}
                    disabled={index === examDetails.length - 1}
                    className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  >
                    ▼
                  </button>
                </div>
                <h3 className="font-semibold">
                  {exam.title || `Quiz ID: ${exam.primaryQuizId}`}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/ssc-edit/${exam.primaryQuizId}`} passHref>
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteQuiz(exam.primaryQuizId)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleRemoveFromBatch(exam.primaryQuizId)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                  Remove
                </button>
                <button
                  onClick={() => downloadQuiz(exam.primaryQuizId)}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download
                </button>
                <button
                  onClick={() => setEditingQuiz(exam)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit Metadata
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {editingQuiz && (
        <QuizMetadataModal
          quiz={editingQuiz}
          onClose={() => setEditingQuiz(null)}
          onSave={(updatedQuiz) => {
            handleUpdateQuizMetadata(updatedQuiz);
            setEditingQuiz(null);
          }}
        />
      )}
    </div>
  );
};

export const AllQuizList = ({
  allQuizzes,
  testBatches,
  handleDeleteQuiz,
  handleAddToBatch,
  handleRemoveFromBatch,
  handleUpdateQuizMetadata,
}) => {
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuizzes, setSelectedQuizzes] = useState(new Set());

  const handleSelectQuiz = (quizId) => {
    const newSelected = new Set(selectedQuizzes);
    if (newSelected.has(quizId)) {
      newSelected.delete(quizId);
    } else {
      newSelected.add(quizId);
    }
    setSelectedQuizzes(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedQuizzes.size === allQuizzes.length) {
      setSelectedQuizzes(new Set());
    } else {
      setSelectedQuizzes(new Set(allQuizzes.map((quiz) => quiz.id)));
    }
  };

  const handleDownloadSelected = async () => {
    for (const quizId of selectedQuizzes) {
      await downloadQuiz(quizId);
    }
    setSelectedQuizzes(new Set());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Quizzes</h2>
        {allQuizzes.length > 0 && (
          <div className="flex gap-2 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedQuizzes.size === allQuizzes.length}
                onChange={handleSelectAll}
                className="form-checkbox h-5 w-5"
              />
              Select All
            </label>
            {selectedQuizzes.size > 0 && (
              <button
                onClick={handleDownloadSelected}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Selected ({selectedQuizzes.size})
              </button>
            )}
          </div>
        )}
      </div>
      <ul className="space-y-4">
        {allQuizzes.map((quiz) => {
          const batchAssignments = testBatches.map(batch => ({
            batch,
            isInBatch: batch.quizzes.some(q => q.id === quiz.id)
          }));

          return (
            <li key={quiz.id} className="border p-4 rounded-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedQuizzes.has(quiz.id)}
                    onChange={() => handleSelectQuiz(quiz.id)}
                    className="form-checkbox h-5 w-5"
                  />
                  <h3 className="font-semibold">
                    {quiz.title || `Quiz ID: ${quiz.id}`}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/ssc-edit/${quiz.id}`} passHref>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                  {batchAssignments.map(({batch, isInBatch}) => (
                    <button
                      key={batch.id}
                      onClick={() =>
                        isInBatch
                          ? handleRemoveFromBatch(quiz.id, batch.id)
                          : handleAddToBatch(quiz.id, batch.id)
                      }
                      className={`${
                        isInBatch ? "bg-blue-300" : "bg-blue-500"
                      } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
                    >
                      {isInBatch ? `Remove from ${batch.title}` : `Add to ${batch.title}`}
                    </button>
                  ))}
                  <button
                    onClick={() => downloadQuiz(quiz.id)}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setEditingQuiz(quiz)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit Metadata
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {editingQuiz && (
        <QuizMetadataModal
          quiz={editingQuiz}
          onClose={() => setEditingQuiz(null)}
          onSave={(updatedQuiz) => {
            handleUpdateQuizMetadata(updatedQuiz);
            setEditingQuiz(null);
          }}
        />
      )}
    </div>
  );
};
