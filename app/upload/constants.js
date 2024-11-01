export const HELPER_TEXT = {
  questions: `Expected format for questions:
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": 2,
    "explanation": "Paris is the capital of France."
  }
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
  }
]`,
}; 