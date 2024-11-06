import { useState } from "react";
import { Input, Button, Radio, RadioGroup, Textarea } from "@nextui-org/react";
import { addQuestion } from "@/lib/uploadService";

export default function ManualQuestionForm() {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", "", "", ""]);
	const [correctAnswer, setCorrectAnswer] = useState("0");
	const [explanation, setExplanation] = useState("");
	const [code, setCode] = useState("");

	const handleOptionChange = (index, value) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const questionData = {
			question,
			options,
			correctAnswer: parseInt(correctAnswer),
			explanation,
			code: code || undefined,
		};
		try {
			const id = await addQuestion(questionData);
			alert(`Question added successfully. ID: ${id}`);
			// Reset form
			setQuestion("");
			setOptions(["", "", "", ""]);
			setCorrectAnswer("0");
			setExplanation("");
			setCode("");
		} catch (error) {
			alert("Error adding question");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<Input
				label="Question Code (Optional)"
				value={code}
				onChange={(e) => setCode(e.target.value)}
				placeholder="Enter a unique code for this question"
			/>
			<Input
				label="Question"
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
				required
			/>
			{options.map((option, index) => (
				<Input
					key={index}
					label={`Option ${index + 1}`}
					value={option}
					onChange={(e) => handleOptionChange(index, e.target.value)}
					required
				/>
			))}
			<RadioGroup
				label="Correct Answer"
				value={correctAnswer}
				onValueChange={setCorrectAnswer}
			>
				{options.map((_, index) => (
					<Radio key={index} value={index.toString()}>
						Option {index + 1}
					</Radio>
				))}
			</RadioGroup>
			<Textarea
				label="Explanation"
				value={explanation}
				onChange={(e) => setExplanation(e.target.value)}
			/>
			<Button type="submit" color="primary">
				Add Question
			</Button>
		</form>
	);
}
