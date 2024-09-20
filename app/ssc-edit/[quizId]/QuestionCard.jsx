import React, { useState } from "react";
import { Radio, RadioGroup, Textarea, Button } from "@nextui-org/react";
import LatexRenderer from "@/components/LatexRenderer";
import { updateQuestion } from "@/lib/firestore";

export default function QuestionCard({ question, onSave }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedQuestion, setEditedQuestion] = useState(question);
	const [isSaving, setIsSaving] = useState(false);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await updateQuestion(question.id, editedQuestion);
			onSave(editedQuestion);
			setIsEditing(false);
		} catch (error) {
			console.error("Error saving question:", error);
			// You might want to show an error message to the user here
		} finally {
			setIsSaving(false);
		}
	};

	const handleChange = (field, value, optionIndex = null) => {
		if (optionIndex !== null) {
			const newOptions = [...editedQuestion.options];
			newOptions[optionIndex] = value;
			setEditedQuestion({ ...editedQuestion, options: newOptions });
		} else {
			setEditedQuestion({ ...editedQuestion, [field]: value });
		}
	};

	if (!question) {
		return <div>Error: Question data is missing</div>;
	}

	return (
		<div className="w-full h-full flex flex-col p-4">
			<div className="flex justify-between items-center mb-4">
				<span className="text-sm text-gray-500">ID: {question.id}</span>
				<Button 
					color="primary" 
					onClick={isEditing ? handleSave : handleEdit}
					disabled={isSaving}
				>
					{isEditing ? (isSaving ? "Saving..." : "Save") : "Edit"}
				</Button>
			</div>

			<div className="flex-grow overflow-y-auto">
				{isEditing ? (
					<div className="grid grid-cols-2 gap-4">
						<div className="overflow-y-auto pr-4">
							<Textarea
								label="Question"
								value={editedQuestion.question}
								onChange={(e) => handleChange("question", e.target.value)}
								className="mb-4"
							/>
							{editedQuestion.options.map((option, index) => (
								<Textarea
									key={index}
									label={`Option ${index + 1}`}
									value={option}
									onChange={(e) => handleChange("options", e.target.value, index)}
									className="mb-2"
								/>
							))}
							<Textarea
								label="Correct Option Index"
								value={editedQuestion.correctAnswer.toString()}
								onChange={(e) => handleChange("correctAnswer", parseInt(e.target.value))}
								className="mb-4"
							/>
							<Textarea
								label="Explanation"
								value={editedQuestion.explanation}
								onChange={(e) => handleChange("explanation", e.target.value)}
							/>
						</div>
						<div className="overflow-y-auto pr-4">
							<h2 className="text-xl font-semibold mb-4">Preview:</h2>
							<LatexRenderer>{editedQuestion.question}</LatexRenderer>
							<RadioGroup value={editedQuestion.correctAnswer.toString()}>
								{editedQuestion.options.map((option, index) => (
									<Radio key={index} value={index.toString()} className="py-2">
										<LatexRenderer>{option}</LatexRenderer>
									</Radio>
								))}
							</RadioGroup>
							<div className="mt-4 p-4 bg-gray-100 rounded-lg">
								<h3 className="font-semibold">Explanation:</h3>
								<LatexRenderer>{editedQuestion.explanation}</LatexRenderer>
							</div>
						</div>
					</div>
				) : (
					<div className="overflow-y-auto pr-4">
						<h2 className="text-xl font-semibold mb-4">
							<LatexRenderer>{question.question}</LatexRenderer>
						</h2>
						<RadioGroup value={question.correctAnswer.toString()}>
							{question.options.map((option, index) => (
								<Radio key={index} value={index.toString()} className="py-2">
									<LatexRenderer>{option}</LatexRenderer>
								</Radio>
							))}
						</RadioGroup>
						<div className="mt-4 p-4 bg-gray-100 rounded-lg">
							<h3 className="font-semibold">Explanation:</h3>
							<LatexRenderer>{question.explanation}</LatexRenderer>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
