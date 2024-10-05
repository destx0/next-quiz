"use client";

import React, { useState, useCallback } from "react";
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
import dynamic from 'next/dynamic';
import { addQuestion, addQuiz, updateTestBatch } from "@/lib/firestore";

const ReactDropzone = dynamic(
	() => import('react-dropzone').then((mod) => mod.default),
	{ ssr: false }
);

export default function BulkUploadForm() {
	const [jsonData, setJsonData] = useState("");
	const [uploadType, setUploadType] = useState("quizzes");
	const [inputMethod, setInputMethod] = useState("file");
	const [jsonFiles, setJsonFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedIds, setUploadedIds] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);

	const onDrop = useCallback(acceptedFiles => {
		setJsonFiles(acceptedFiles);
	}, []);

	const addQuizToTestBatch = async (quizId) => {
		const testBatchId = "PxOtC4EjRhk1DH1B6j62"; // Hardcoded test batch ID
		try {
			await updateTestBatch(testBatchId, quizId);
			console.log(`Quiz ${quizId} added to test batch ${testBatchId}`);
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
				allData = await Promise.all(jsonFiles.map(async (file) => {
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
							const id = await addQuiz(quiz);
							await addQuizToTestBatch(id);
							processedItems++;
							setUploadProgress(Math.round((processedItems / totalItems) * 100));
							return id;
						})
					);
					setUploadedIds(prev => [...prev, ...quizIds]);
					console.log(`Quizzes added successfully and added to test batch. IDs: ${quizIds.join(", ")}`);
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
		setJsonFile(e.target.files[0]);
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
				<Radio value="file">Upload JSON File(s)</Radio>
				<Radio value="paste">Paste JSON</Radio>
			</RadioGroup>

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
				<ReactDropzone
					onDrop={onDrop}
					accept={{ 'application/json': ['.json'] }}
					multiple={true}
				>
					{({getRootProps, getInputProps, isDragActive}) => (
						<div 
							{...getRootProps()} 
							className="p-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center"
							style={{ minHeight: "200px" }}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p className="text-xl">Drop the JSON files here ...</p>
							) : (
								<>
									<p className="text-xl mb-2">Drag 'n' drop some JSON files here</p>
									<p className="text-sm text-gray-500">or click to select files</p>
								</>
							)}
							{jsonFiles.length > 0 && (
								<div className="mt-4">
									<p>Selected files:</p>
									<ul>
										{jsonFiles.map((file, index) => (
											<li key={index}>{file.name}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}
				</ReactDropzone>
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