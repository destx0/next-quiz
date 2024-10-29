"use client";

import React, { useState } from "react";
import {
	Button,
	Textarea,
	Radio,
	RadioGroup,
	Card,
	CardBody,
	Spinner,
	Progress,
} from "@nextui-org/react";
import { addQuestion, addQuiz, updateTestBatch, addFullQuiz } from "@/lib/firestore";

export default function BulkUploadForm() {
	const [jsonData, setJsonData] = useState("");
	const [uploadType, setUploadType] = useState("quizzes");
	const [inputMethod, setInputMethod] = useState("file");
	const [jsonFiles, setJsonFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedIds, setUploadedIds] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [selectedBatch, setSelectedBatch] = useState("none");
	const [uploadVersion, setUploadVersion] = useState("v1");

	const addQuizToTestBatch = async (quizId) => {
		if (selectedBatch === "none") return;
		try {
			await updateTestBatch(selectedBatch, quizId);
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
				allData = await Promise.all(Array.from(jsonFiles).map(async (file) => {
					const fileContent = await file.text();
					return JSON.parse(fileContent);
				}));
			}

			const totalItems = allData.reduce((acc, data) => acc + (Array.isArray(data) ? data.length : 1), 0);
			let processedItems = 0;

			for (let data of allData) {
				if (uploadType === "questions") {
					const questions = Array.isArray(data) ? data : [data];
					const ids = await Promise.all(questions.map(async (question) => {
						const id = await addQuestion(question);
						processedItems++;
						setUploadProgress(Math.round((processedItems / totalItems) * 100));
						return id;
					}));
					setUploadedIds(prev => [...prev, ...ids]);
					console.log(`Questions added successfully. IDs: ${ids.join(", ")}`);
				} else if (uploadType === "quizzes") {
					const quizzes = Array.isArray(data) ? data : [data];
					const quizIds = await Promise.all(
						quizzes.map(async (quiz) => {
							let id;
							if (uploadVersion === "v2") {
								id = await addFullQuiz(quiz);
							} else {
								id = await addQuiz(quiz);
							}
							
							if (selectedBatch !== "none") {
								await addQuizToTestBatch(id);
							}
							processedItems++;
							setUploadProgress(Math.round((processedItems / totalItems) * 100));
							return id;
						})
					);
					setUploadedIds(prev => [...prev, ...quizIds]);
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

	const helperText = {
		questions: `Expected format for questions:
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": 2,
    "explanation": "Paris is the capital of France."
  },
  // ... more questions ...
]`,
		quizzes: `Expected format for quizzes:
[
  {
    "title": "General Knowledge Quiz",
    "description": "Test your knowledge!",
    "thumbnailLink": "https://example.com/thumbnail.jpg",
    "duration": 30,
    "positiveScore": 1,
    "negativeScore": 0.25,
    "sections": [
      {
        "name": "History",
        "questions": [
          { "id": "existingQuestionId" },
          {
            "question": "Who was the first US President?",
            "options": ["Washington", "Adams", "Jefferson", "Madison"],
            "correctAnswer": 0,
            "explanation": "George Washington was the first US President."
          }
        ]
      }
    ]
  },
  // ... more quizzes ...
]`,
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="flex justify-start gap-10  items-center">
				<RadioGroup
					label="Upload Type"
					value={uploadType}
					onValueChange={handleUploadTypeChange}
					orientation="horizontal"
				>
					<Radio value="quizzes">Quizzes</Radio>
					<Radio value="questions">Questions</Radio>
				</RadioGroup>

				<RadioGroup
					label="Input Method"
					value={inputMethod}
					onValueChange={handleInputMethodChange}
					orientation="horizontal"
				>
					<Radio value="file">File</Radio>
					<Radio value="paste">Paste</Radio>
				</RadioGroup>

				{uploadType === "quizzes" && (
					<RadioGroup
						label="Upload Version"
						value={uploadVersion}
						onValueChange={handleVersionChange}
						orientation="horizontal"
					>
						<Radio value="v1">Version 1.0</Radio>
						<Radio value="v2">Version 2.0</Radio>
					</RadioGroup>
				)}
			</div>

			{uploadType === "quizzes" && (
				<RadioGroup
					label="Select Batch"
					value={selectedBatch}
					onValueChange={handleBatchChange}
					orientation="horizontal"
				>
					<Radio value="none">No Batch</Radio>
					<Radio value="PxOtC4EjRhk1DH1B6j62">Tier 1</Radio>
					<Radio value="NHI6vv2PzgQ899Sz4Rll">PYQs</Radio>
				</RadioGroup>
			)}

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
						<p className="text-sm text-gray-500">or drag and drop files here</p>
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

			<Button type="submit" color="primary" disabled={isLoading}>
				{isLoading ? <Spinner size="sm" /> : `Upload ${uploadType}`}
			</Button>

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
						<h3 className="text-lg font-semibold mb-2">Uploaded {uploadType} IDs:</h3>
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
					<pre className="text-sm overflow-auto">
						{helperText[uploadType]}
					</pre>
				</CardBody>
			</Card>
		</form>
	);
}