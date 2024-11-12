import Link from "next/link";
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
      setSelectedQuizzes(
        new Set(examDetails.map((exam) => exam.primaryQuizId))
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quizzes</h2>
        {examDetails?.length > 0 && (
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
          </div>
        )}
      </div>
      <ul className="space-y-4">
        {examDetails?.map((exam, index) => (
          <li key={exam.primaryQuizId} className="border p-4 rounded-lg">
            <div className="flex flex-col gap-4">
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
                    onClick={() => setEditingQuiz(exam)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit Metadata
                  </button>
                </div>
              </div>

              <div className="ml-8 space-y-2">
                <h4 className="font-medium text-gray-700">
                  Available Languages:
                </h4>
                <div className="flex flex-wrap gap-4">
                  {exam.quizIds?.map((quizEntry, langIndex) => (
                    <div
                      key={langIndex}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <span className="font-medium capitalize">
                        {quizEntry.language}:
                      </span>
                      <div className="flex gap-2">
                        <Link href={`/ssc-edit/${quizEntry.quizId}`} passHref>
                          <button className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded">
                            Edit {quizEntry.language}
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      /* TODO: Add new language quiz */
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center gap-1"
                  >
                    <span>+</span> Add Language
                  </button>
                </div>
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
