"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuizWithQuestions } from "@/lib/getQuiz";
import QuestionCard from "./QuestionCard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tabs, Tab } from "@nextui-org/react";

export default function EditQuizPage() {
  const params = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      const quizId = params.quizId;
      if (!quizId) {
        setError("Quiz ID is missing");
        return;
      }
      try {
        const data = await getQuizWithQuestions(quizId);
        setQuizData(data);
        // Set the initial question ID to the first question of the first section
        if (data.sections.length > 0 && data.sections[0].questions.length > 0) {
          setCurrentQuestionId(data.sections[0].questions[0].id);
        }
      } catch (error) {
        setError("Failed to fetch quiz data: " + error.message);
      }
    };

    fetchQuizData();
  }, [params.quizId]);

  const handleSaveQuestion = async (updatedQuestion) => {
    if (!quizData || !params.quizId) return;

    try {
      // Update only in fullQuizzes collection
      const fullQuizRef = doc(db, "fullQuizzes", params.quizId);

      const updatedSections = quizData.sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === updatedQuestion.id ? updatedQuestion : q
        ),
      }));

      // Update only fullQuizzes collection
      await updateDoc(fullQuizRef, { sections: updatedSections });

      // Update local state
      setQuizData((prevData) => ({
        ...prevData,
        sections: updatedSections,
      }));

      console.log("Question updated successfully");
    } catch (error) {
      console.error("Error updating question:", error);
      setError("Failed to update question: " + error.message);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!quizData) return <div>Loading...</div>;

  const currentSection = quizData.sections.find((section) =>
    section.questions.some((q) => q.id === currentQuestionId)
  );
  const currentQuestionData = currentSection?.questions.find(
    (q) => q.id === currentQuestionId
  );

  if (!currentQuestionData) return <div>No question selected</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Quiz: {quizData.title}</h1>
      <Tabs
        aria-label="Quiz sections"
        className="mb-4"
        onSelectionChange={(key) => {
          const firstQuestionInSection = quizData.sections[key].questions[0];
          setCurrentQuestionId(firstQuestionInSection.id);
        }}
      >
        {quizData.sections.map((section, index) => (
          <Tab key={index} title={`Section ${index + 1}`}>
            <div className="flex flex-wrap gap-2 mt-2">
              {section.questions.map((question, qIndex) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionId(question.id)}
                  className={`px-3 py-1 ${
                    currentQuestionId === question.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {qIndex + 1}
                </button>
              ))}
            </div>
          </Tab>
        ))}
      </Tabs>

      {currentQuestionData && (
        <QuestionCard
          question={currentQuestionData}
          onSave={handleSaveQuestion}
        />
      )}
    </div>
  );
}
