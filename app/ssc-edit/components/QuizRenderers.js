import Link from "next/link";
import { useState } from "react";
import QuizMetadataModal from "./QuizMetadataModal";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { quizServices } from "../services/quizServices";
import { downloadQuizData } from "../utils/quizActions";

const AVAILABLE_LANGUAGES = [
  { key: "english", label: "English" },
  { key: "hindi", label: "Hindi" },
  { key: "bengali", label: "Bengali" },
];

export const QuizList = ({
  batchTitle,
  examDetails,
  batchId,
  handleDeleteQuiz,
  handleRemoveFromBatch,
  handleMoveQuiz,
  handleUpdateQuizMetadata,
  setTestBatches,
}) => {
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuizzes, setSelectedQuizzes] = useState(new Set());
  const [flattenDownload, setFlattenDownload] = useState(true);

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

  const handleQuizLanguageChange = async (
    quizId,
    currentLanguage,
    newLanguage
  ) => {
    try {
      console.log("Language change requested:", {
        quizId,
        currentLanguage,
        newLanguage,
        batchId,
      });

      const updatedExamDetails = await quizServices.changeQuizLanguage(
        batchId,
        quizId,
        currentLanguage,
        newLanguage
      );

      // Update local state
      setTestBatches((prevBatches) =>
        prevBatches.map((batch) =>
          batch.id === batchId
            ? { ...batch, examDetails: updatedExamDetails }
            : batch
        )
      );

      console.log("Language change completed successfully");
    } catch (error) {
      console.error("Language change failed:", error);
      alert(`Failed to change language: ${error.message}`);
    }
  };

  const handleRemoveLanguageVersion = async (quizId, language) => {
    try {
      if (
        window.confirm(
          `Are you sure you want to remove the ${language} version?`
        )
      ) {
        const updatedExamDetails = await quizServices.removeLanguageVersion(
          batchId,
          quizId,
          language
        );

        // Update local state
        setTestBatches((prevBatches) =>
          prevBatches.map((batch) =>
            batch.id === batchId
              ? { ...batch, examDetails: updatedExamDetails }
              : batch
          )
        );
      }
    } catch (error) {
      console.error("Failed to remove language version:", error);
      alert(error.message);
    }
  };

  const handleDownloadQuiz = async (quizId, language) => {
    try {
      await downloadQuizData(quizId, language, flattenDownload);
    } catch (error) {
      console.error("Failed to download quiz data:", error);
      alert("Failed to download quiz data: " + error.message);
    }
  };

  const handleBulkDownload = async () => {
    try {
      for (const quizId of selectedQuizzes) {
        const quiz = examDetails.find((exam) => exam.primaryQuizId === quizId);
        if (quiz && quiz.quizIds) {
          for (const quizVersion of quiz.quizIds) {
            await downloadQuizData(
              quizVersion.quizId,
              quizVersion.language,
              flattenDownload
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to download quizzes:", error);
      alert("Failed to download some quizzes: " + error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h2 className="text-xl font-semibold">
          {batchTitle || "Unnamed Batch"}
        </h2>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={flattenDownload}
              onChange={(e) => setFlattenDownload(e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            Flatten
          </label>
          {examDetails?.length > 0 && (
            <div className="flex items-center gap-4">
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
                  onClick={handleBulkDownload}
                  className="bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded flex items-center gap-2"
                >
                  <span>↓</span> Download Selected ({selectedQuizzes.size})
                </button>
              )}
            </div>
          )}
        </div>
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
                  <div className="flex justify-between items-center">
                    {exam.quizIds?.length > 1 && (
                      <button
                        onClick={() => {
                          exam.quizIds.forEach((quizEntry) =>
                            handleDownloadQuiz(
                              quizEntry.quizId,
                              quizEntry.language
                            )
                          );
                        }}
                        variant="outline"
                        color="secondary"
                        className="text-sm   py-2 px-4 rounded"
                      >
                        <span>↓</span> Download All
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFromBatch(exam.primaryQuizId)}
                    variant="outline"
                    color="danger"
                    className="text-sm py-2 px-4 rounded"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setEditingQuiz(exam)}
                    variant="outline"
                    color="primary"
                    className=" text-sm py-2 px-4 rounded"
                  >
                    Edit Metadata
                  </button>
                </div>
              </div>

              <div className="flex ml-8 space-y-2">
                <div className="flex flex-wrap gap-4 flex-1">
                  {exam.quizIds?.map((quizEntry, langIndex) => (
                    <div
                      key={langIndex}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="flat" className="capitalize">
                            {quizEntry.language || "Select Language"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Language selection"
                          onAction={(key) => {
                            console.log("Dropdown selection:", {
                              selectedKey: key,
                              currentLanguage: quizEntry.language,
                              quizId: quizEntry.quizId,
                            });
                            handleQuizLanguageChange(
                              quizEntry.quizId,
                              quizEntry.language,
                              key.toString()
                            );
                          }}
                        >
                          {AVAILABLE_LANGUAGES.map((lang) => (
                            <DropdownItem
                              key={lang.key}
                              className={
                                quizEntry.language === lang.key
                                  ? "text-primary"
                                  : ""
                              }
                            >
                              {lang.label}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                      <div className="flex gap-2">
                        <Link href={`/ssc-edit/${quizEntry.quizId}`} passHref>
                          <button className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            handleDownloadQuiz(
                              quizEntry.quizId,
                              quizEntry.language
                            )
                          }
                          className="bg-purple-500 hover:bg-purple-700 text-white text-sm py-1 px-2 rounded flex items-center gap-1"
                        >
                          <span>↓</span> Download
                        </button>
                        {exam.quizIds.length > 1 && (
                          <button
                            onClick={() =>
                              handleRemoveLanguageVersion(
                                quizEntry.quizId,
                                quizEntry.language
                              )
                            }
                            className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
