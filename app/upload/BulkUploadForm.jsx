"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Textarea,
  Card,
  CardBody,
  Spinner,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import {
  addQuestion,
  addQuiz,
  updateTestBatch,
  addFullQuiz,
  createNewBatch,
} from "@/lib/uploadService";
import { getAllTestBatches } from "@/lib/firestore";
import { HELPER_TEXT } from "./constants";
import NewBatchModal from "./components/NewBatchModal";
import UploadSidebar from "./components/UploadSidebar";

export default function BulkUploadForm() {
  const [jsonData, setJsonData] = useState("");
  const [uploadType, setUploadType] = useState("quizzes");
  const [inputMethod, setInputMethod] = useState("file");
  const [jsonFiles, setJsonFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedIds, setUploadedIds] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState("none");
  const [uploadVersion, setUploadVersion] = useState("v2");
  const [testBatches, setTestBatches] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newBatchTitle, setNewBatchTitle] = useState("");
  const [newBatchDescription, setNewBatchDescription] = useState("");
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  useEffect(() => {
    const fetchTestBatches = async () => {
      try {
        const batches = await getAllTestBatches();
        setTestBatches(batches);
      } catch (error) {
        console.error("Error fetching test batches:", error);
      }
    };

    fetchTestBatches();
  }, []);

  const addQuizToTestBatch = async (quizId, quizData) => {
    if (selectedBatch === "none") return;
    try {
      await updateTestBatch(selectedBatch, quizId, {
        ...quizData,
        language: selectedLanguage,
      });
      console.log(`Quiz ${quizId} added to test batch ${selectedBatch}`);
    } catch (error) {
      console.error("Error adding quiz to test batch:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadedIds([]);
    setUploadProgress(0);
    try {
      let allData = [];
      if (inputMethod === "paste") {
        allData = [JSON.parse(jsonData)];
      } else {
        allData = await Promise.all(
          Array.from(jsonFiles).map(async (file) => {
            const fileContent = await file.text();
            return JSON.parse(fileContent);
          })
        );
      }

      const totalItems = allData.reduce(
        (acc, data) => acc + (Array.isArray(data) ? data.length : 1),
        0
      );
      let processedItems = 0;

      for (let data of allData) {
        if (uploadType === "questions") {
          const questions = Array.isArray(data) ? data : [data];
          const questionsWithLanguage = questions.map((q) => ({
            ...q,
            language: q.language || selectedLanguage,
          }));
          const ids = await Promise.all(
            questionsWithLanguage.map(async (question) => {
              const id = await addQuestion(question);
              processedItems++;
              setUploadProgress(
                Math.round((processedItems / totalItems) * 100)
              );
              return id;
            })
          );
          setUploadedIds((prev) => [...prev, ...ids]);
          console.log(`Questions added successfully. IDs: ${ids.join(", ")}`);
        } else if (uploadType === "quizzes") {
          const quizzes = Array.isArray(data) ? data : [data];
          const quizzesWithLanguage = quizzes.map((quiz) => ({
            ...quiz,
            language: quiz.language || selectedLanguage,
          }));
          const quizIds = await Promise.all(
            quizzesWithLanguage.map(async (quiz) => {
              let id;
              if (uploadVersion === "v2") {
                id = await addFullQuiz(quiz);
              } else {
                id = await addQuiz(quiz);
              }

              if (selectedBatch !== "none") {
                await addQuizToTestBatch(id, quiz);
              }
              processedItems++;
              setUploadProgress(
                Math.round((processedItems / totalItems) * 100)
              );
              return id;
            })
          );
          setUploadedIds((prev) => [...prev, ...quizIds]);
          console.log(`Quizzes added successfully. IDs: ${quizIds.join(", ")}`);
        }
      }
      alert("Upload completed successfully!");
      setJsonData("");
      setJsonFiles([]);
    } catch (error) {
      alert("Error adding data: " + error.message);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleUploadTypeChange = (value) => {
    setUploadType(value);
  };

  const handleInputMethodChange = (value) => {
    setInputMethod(value);
  };

  const handleFileChange = (e) => {
    setJsonFiles(e.target.files);
  };

  const handleBatchChange = (value) => {
    setSelectedBatch(value);
  };

  const handleVersionChange = (value) => {
    setUploadVersion(value);
  };

  const handleCreateBatch = async () => {
    if (!newBatchTitle.trim()) {
      alert("Please enter a batch title");
      return;
    }

    setIsCreatingBatch(true);
    try {
      const batchData = {
        title: newBatchTitle.trim(),
        description: newBatchDescription.trim(),
      };

      const newBatchId = await createNewBatch(batchData);

      // Refresh the batches list
      const updatedBatches = await getAllTestBatches();
      setTestBatches(updatedBatches);

      // Select the newly created batch
      setSelectedBatch(newBatchId);

      // Close the modal and reset form
      onClose();
      setNewBatchTitle("");
      setNewBatchDescription("");

      alert("Batch created successfully!");
    } catch (error) {
      alert("Error creating batch: " + error.message);
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-6 mx-auto max-w-7xl">
      {/* Sidebar */}
      <div className="w-1/3 sticky top-4 h-fit">
        <UploadSidebar
          uploadType={uploadType}
          onUploadTypeChange={handleUploadTypeChange}
          inputMethod={inputMethod}
          onInputMethodChange={handleInputMethodChange}
          uploadVersion={uploadVersion}
          onVersionChange={handleVersionChange}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          selectedBatch={selectedBatch}
          onBatchChange={handleBatchChange}
          testBatches={testBatches}
          onCreateNewBatch={onOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <Card>
          <CardBody>
            {inputMethod === "paste" ? (
              <Textarea
                label={`JSON Data for ${uploadType}`}
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder={`Paste your ${uploadType} JSON data here`}
                minRows={10}
                required
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept=".json"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <p className="text-xl mb-2">Click to select JSON files</p>
                  <p className="text-sm text-gray-500">
                    or drag and drop files here
                  </p>
                </label>
                {jsonFiles.length > 0 && (
                  <div className="mt-4">
                    <p>Selected files:</p>
                    <ul>
                      {Array.from(jsonFiles).map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="flex justify-center">
          <Button type="submit" color="primary" size="lg" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : `Upload ${uploadType}`}
          </Button>
        </div>

        {isLoading && (
          <div className="text-center">
            <Progress
              aria-label="Uploading..."
              size="md"
              value={uploadProgress}
              color="primary"
              showValueLabel={true}
              className="max-w-md mx-auto"
            />
            <p className="mt-2">Processing uploads...</p>
          </div>
        )}

        {uploadedIds.length > 0 && (
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">
                Uploaded {uploadType} IDs:
              </h3>
              <ul className="list-disc pl-5">
                {uploadedIds.map((id, index) => (
                  <li key={index}>{id}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-2">Expected Format</h3>
            <pre className="text-sm overflow-auto bg-gray-100 p-4 rounded">
              {HELPER_TEXT[uploadType]}
            </pre>
          </CardBody>
        </Card>

        <NewBatchModal
          isOpen={isOpen}
          onClose={onClose}
          title={newBatchTitle}
          onTitleChange={(e) => setNewBatchTitle(e.target.value)}
          description={newBatchDescription}
          onDescriptionChange={(e) => setNewBatchDescription(e.target.value)}
          onSubmit={handleCreateBatch}
          isLoading={isCreatingBatch}
        />
      </div>
    </form>
  );
}
