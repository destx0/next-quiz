import { useState } from "react";
import {
	Input,
	Button,
	Textarea,
	Checkbox,
	Card,
	CardBody,
	CardHeader,
} from "@nextui-org/react";
import { addQuiz, addQuestion } from "@/lib/uploadService";
import { XCircle } from "lucide-react";

export default function QuizForm() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [thumbnailLink, setThumbnailLink] = useState("");
	const [duration, setDuration] = useState("");
	const [positiveScore, setPositiveScore] = useState("");
	const [negativeScore, setNegativeScore] = useState("");
	const [sections, setSections] = useState([{ name: "", questions: [] }]);

	const addSection = () => {
		setSections([...sections, { name: "", questions: [] }]);
	};

	const removeSection = (sectionIndex) => {
		const newSections = sections.filter(
			(_, index) => index !== sectionIndex
		);
		setSections(newSections);
	};

	const addQuestionToSection = (sectionIndex) => {
		const newSections = [...sections];
		newSections[sectionIndex].questions.push({ type: "id", id: "" });
		setSections(newSections);
	};

	const removeQuestionFromSection = (sectionIndex, questionIndex) => {
		const newSections = [...sections];
		newSections[sectionIndex].questions = newSections[
			sectionIndex
		].questions.filter((_, index) => index !== questionIndex);
		setSections(newSections);
	};

	const handleQuestionChange = (
		sectionIndex,
		questionIndex,
		field,
		value
	) => {
		const newSections = [...sections];
		newSections[sectionIndex].questions[questionIndex][field] = value;
		setSections(newSections);
	};

	const handleSectionNameChange = (sectionIndex, name) => {
		const newSections = [...sections];
		newSections[sectionIndex].name = name;
		setSections(newSections);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const quizData = {
				title,
				description,
				thumbnailLink,
				duration: duration ? parseInt(duration) : null,
				positiveScore: positiveScore ? parseFloat(positiveScore) : null,
				negativeScore: negativeScore ? parseFloat(negativeScore) : null,
				sections: await Promise.all(
					sections.map(async (section) => ({
						name: section.name,
						questions: await Promise.all(
							section.questions.map(async (question) => {
								if (question.type === "id") {
									return { id: question.id };
								} else {
									const id = await addQuestion({
										question: question.question,
										options: question.options,
										correctAnswer: parseInt(
											question.correctAnswer
										),
										explanation: question.explanation,
									});
									return { id };
								}
							})
						),
					}))
				),
			};

			const quizId = await addQuiz(quizData);
			alert(`Quiz added successfully. ID: ${quizId}`);
			// Reset form
			setTitle("");
			setDescription("");
			setThumbnailLink("");
			setDuration("");
			setPositiveScore("");
			setNegativeScore("");
			setSections([{ name: "", questions: [] }]);
		} catch (error) {
			alert("Error adding quiz: " + error.message);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Card>
				<CardBody>
					<div className="space-y-4">
						<Input
							label="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
						<Textarea
							label="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<Input
							label="Thumbnail Link"
							value={thumbnailLink}
							onChange={(e) => setThumbnailLink(e.target.value)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Input
								label="Duration (minutes)"
								type="number"
								value={duration}
								onChange={(e) => setDuration(e.target.value)}
							/>
							<Input
								label="Positive Score"
								type="number"
								value={positiveScore}
								onChange={(e) =>
									setPositiveScore(e.target.value)
								}
							/>
							<Input
								label="Negative Score"
								type="number"
								value={negativeScore}
								onChange={(e) =>
									setNegativeScore(e.target.value)
								}
							/>
						</div>
					</div>
				</CardBody>
			</Card>

			{sections.map((section, sectionIndex) => (
				<Card key={sectionIndex} className="mt-4">
					<CardHeader className="flex justify-between items-center">
						<Input
							label={`Section ${sectionIndex + 1} Name`}
							value={section.name}
							onChange={(e) =>
								handleSectionNameChange(
									sectionIndex,
									e.target.value
								)
							}
							className="flex-grow"
						/>
						<Button
							color="danger"
							variant="light"
							isIconOnly
							onClick={() => removeSection(sectionIndex)}
						>
							<XCircle />
						</Button>
					</CardHeader>
					<CardBody>
						{section.questions.map((question, questionIndex) => (
							<Card key={questionIndex} className="mt-2">
								<CardBody>
									<div className="flex justify-between items-center mb-2">
										<Checkbox
											isSelected={
												question.type === "full"
											}
											onChange={(isSelected) =>
												handleQuestionChange(
													sectionIndex,
													questionIndex,
													"type",
													isSelected ? "full" : "id"
												)
											}
										>
											Full Question
										</Checkbox>
										<Button
											color="danger"
											variant="light"
											isIconOnly
											onClick={() =>
												removeQuestionFromSection(
													sectionIndex,
													questionIndex
												)
											}
										>
											<XCircle size={20} />
										</Button>
									</div>
									{question.type === "id" ? (
										<Input
											label="Question ID"
											value={question.id}
											onChange={(e) =>
												handleQuestionChange(
													sectionIndex,
													questionIndex,
													"id",
													e.target.value
												)
											}
											required
										/>
									) : (
										<div className="space-y-2">
											<Input
												label="Question"
												value={question.question}
												onChange={(e) =>
													handleQuestionChange(
														sectionIndex,
														questionIndex,
														"question",
														e.target.value
													)
												}
												required
											/>
											{[0, 1, 2, 3].map((optionIndex) => (
												<Input
													key={optionIndex}
													label={`Option ${optionIndex + 1}`}
													value={
														question.options?.[
															optionIndex
														] || ""
													}
													onChange={(e) => {
														const newOptions = [
															...(question.options ||
																[]),
														];
														newOptions[
															optionIndex
														] = e.target.value;
														handleQuestionChange(
															sectionIndex,
															questionIndex,
															"options",
															newOptions
														);
													}}
													required
												/>
											))}
											<Input
												label="Correct Answer Index"
												type="number"
												min="0"
												max="3"
												value={question.correctAnswer}
												onChange={(e) =>
													handleQuestionChange(
														sectionIndex,
														questionIndex,
														"correctAnswer",
														e.target.value
													)
												}
												required
											/>
											<Textarea
												label="Explanation"
												value={question.explanation}
												onChange={(e) =>
													handleQuestionChange(
														sectionIndex,
														questionIndex,
														"explanation",
														e.target.value
													)
												}
											/>
										</div>
									)}
								</CardBody>
							</Card>
						))}
						<Button
							onClick={() => addQuestionToSection(sectionIndex)}
							className="mt-4"
						>
							Add Question
						</Button>
					</CardBody>
				</Card>
			))}
			<div className="flex justify-between">
				<Button onClick={addSection} color="secondary">
					Add Section
				</Button>
				<Button type="submit" color="primary">
					Create Quiz
				</Button>
			</div>
		</form>
	);
}
