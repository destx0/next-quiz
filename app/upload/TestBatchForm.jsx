import { useState } from "react";
import {
	Input,
	Button,
	Textarea,
	Card,
	CardBody,
	Switch,
} from "@nextui-org/react";
import { addTestBatch } from "@/lib/firestore";

export default function TestBatchForm() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isTopicWise, setIsTopicWise] = useState(false);
	const [topics, setTopics] = useState([{ name: "", quizzes: [""] }]);

	const addTopic = () => {
		setTopics([...topics, { name: "", quizzes: [""] }]);
	};

	const removeTopic = (topicIndex) => {
		const newTopics = topics.filter((_, index) => index !== topicIndex);
		setTopics(newTopics);
	};

	const addQuizField = (topicIndex) => {
		const newTopics = [...topics];
		newTopics[topicIndex].quizzes.push("");
		setTopics(newTopics);
	};

	const handleTopicNameChange = (topicIndex, name) => {
		const newTopics = [...topics];
		newTopics[topicIndex].name = name;
		setTopics(newTopics);
	};

	const handleQuizChange = (topicIndex, quizIndex, value) => {
		const newTopics = [...topics];
		newTopics[topicIndex].quizzes[quizIndex] = value;
		setTopics(newTopics);
	};

	const removeQuizField = (topicIndex, quizIndex) => {
		const newTopics = [...topics];
		newTopics[topicIndex].quizzes = newTopics[topicIndex].quizzes.filter(
			(_, index) => index !== quizIndex
		);
		setTopics(newTopics);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let testBatchData;
			if (isTopicWise) {
				testBatchData = {
					title,
					description,
					isTopicWise,
					topics: topics.map((topic) => ({
						name: topic.name,
						quizzes: topic.quizzes.filter(
							(quizId) => quizId.trim() !== ""
						),
					})),
				};
			} else {
				testBatchData = {
					title,
					description,
					isTopicWise,
					topics: [
						{
							name: "Default",
							quizzes: topics[0].quizzes.filter(
								(quizId) => quizId.trim() !== ""
							),
						},
					],
				};
			}

			const testBatchId = await addTestBatch(testBatchData);
			alert(`Test Batch added successfully. ID: ${testBatchId}`);
			// Reset form
			setTitle("");
			setDescription("");
			setIsTopicWise(false);
			setTopics([{ name: "", quizzes: [""] }]);
		} catch (error) {
			alert("Error adding test batch: " + error.message);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Card>
				<CardBody className="space-y-4">
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
					<div className="flex items-center space-x-2">
						<Switch
							checked={isTopicWise}
							onChange={(e) => setIsTopicWise(e.target.checked)}
						/>
						<span>Topic-wise organization</span>
					</div>
				</CardBody>
			</Card>

			{topics.map((topic, topicIndex) => (
				<Card key={topicIndex} className="mt-4">
					<CardBody className="space-y-4">
						{isTopicWise && (
							<div className="flex items-center space-x-2">
								<Input
									label={`Topic ${topicIndex + 1} Name`}
									value={topic.name}
									onChange={(e) =>
										handleTopicNameChange(
											topicIndex,
											e.target.value
										)
									}
									className="flex-grow"
									required
								/>
								<Button
									color="danger"
									variant="light"
									onPress={() => removeTopic(topicIndex)}
								>
									Remove Topic
								</Button>
							</div>
						)}
						{topic.quizzes.map((quiz, quizIndex) => (
							<div
								key={quizIndex}
								className="flex items-center space-x-2"
							>
								<Input
									label={`Quiz ${quizIndex + 1} ID`}
									value={quiz}
									onChange={(e) =>
										handleQuizChange(
											topicIndex,
											quizIndex,
											e.target.value
										)
									}
									className="flex-grow"
									required
								/>
								<Button
									color="danger"
									variant="light"
									onPress={() =>
										removeQuizField(topicIndex, quizIndex)
									}
								>
									Remove
								</Button>
							</div>
						))}
						<Button
							color="secondary"
							variant="flat"
							onPress={() => addQuizField(topicIndex)}
						>
							Add Quiz
						</Button>
					</CardBody>
				</Card>
			))}

			{isTopicWise && (
				<Button color="secondary" onPress={addTopic}>
					Add Topic
				</Button>
			)}

			<Button type="submit" color="primary">
				Create Test Batch
			</Button>
		</form>
	);
}
