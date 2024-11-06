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
  const [quizzes, setQuizzes] = useState([""]);

  const addQuizField = () => {
    setQuizzes([...quizzes, ""]);
  };

  const handleQuizChange = (index, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[index] = value;
    setQuizzes(newQuizzes);
  };

  const removeQuizField = (index) => {
    const newQuizzes = quizzes.filter((_, i) => i !== index);
    setQuizzes(newQuizzes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const testBatchData = {
        title,
        description,
        isTopicWise,
        quizzes: quizzes.filter((quizId) => quizId.trim() !== ""),
      };

      const testBatchId = await addTestBatch(testBatchData);
      alert(`Test Batch added successfully. ID: ${testBatchId}`);
      // Reset form
      setTitle("");
      setDescription("");
      setIsTopicWise(false);
      setQuizzes([""]);
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

      <Card>
        <CardBody className="space-y-4">
          <h3 className="text-lg font-semibold">Quizzes</h3>
          {quizzes.map((quiz, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                label={`Quiz ${index + 1} ID`}
                value={quiz}
                onChange={(e) => handleQuizChange(index, e.target.value)}
                className="flex-grow"
                required
              />
              <Button
                color="danger"
                variant="light"
                onPress={() => removeQuizField(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button color="secondary" variant="flat" onPress={addQuizField}>
            Add Quiz
          </Button>
        </CardBody>
      </Card>

      <Button type="submit" color="primary">
        Create Test Batch
      </Button>
    </form>
  );
}
