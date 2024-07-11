import { useState } from "react";
import {
	Button,
	Textarea,
	Radio,
	RadioGroup,
	Card,
	CardBody,
} from "@nextui-org/react";
import { addQuestion, addQuiz } from "@/lib/firestore";
export default function BulkUploadForm() {
	const [jsonData, setJsonData] = useState("");
	const [uploadType, setUploadType] = useState("questions");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = JSON.parse(jsonData);

			if (uploadType === "questions") {
				const questions = Array.isArray(data) ? data : [data];
				const ids = await Promise.all(questions.map(addQuestion));
				alert(`Questions added successfully. IDs: ${ids.join(", ")}`);
			} else if (uploadType === "quiz") {
				const quizId = await addQuiz(data);
				alert(`Quiz added successfully. ID: ${quizId}`);
			}

			setJsonData("");
		} catch (error) {
			alert("Error adding data: " + error.message);
		}
	};

	const handleUploadTypeChange = (value) => {
		setUploadType(value);
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
		quiz: `Expected format for quiz:
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
}`,
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<RadioGroup
				label="Upload Type"
				value={uploadType}
				onValueChange={handleUploadTypeChange}
				orientation="horizontal"
			>
				<Radio value="questions">Questions</Radio>
				<Radio value="quiz">Quiz</Radio>
			</RadioGroup>
			<Card>
				<CardBody>
					<pre className="text-sm overflow-auto">
						{helperText[uploadType]}
					</pre>
				</CardBody>
			</Card>
			<Textarea
				label="JSON Data"
				value={jsonData}
				onChange={(e) => setJsonData(e.target.value)}
				placeholder="Paste your JSON data here"
				minRows={10}
				required
			/>
			<Button type="submit" color="primary">
				Upload {uploadType === "questions" ? "Questions" : "Quiz"}
			</Button>
		</form>
	);
}
