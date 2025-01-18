import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";

const fetchDoc = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error(`Document ${collectionName}/${docId} does not exist`);
  }
  return { docRef, docData: docSnap.data() };
};

const createTestBatch = async (examName, type) => {
  const batchData = {
    title: `${examName} - ${type}`,
    description: `${type} tests for ${examName}`,
    examDetails: [],
    createdAt: new Date(),
    type: type.toLowerCase().replace(/\s+/g, "_"),
  };
  const batchRef = await addDoc(collection(db, "testBatches"), batchData);
  return batchRef.id;
};

export const getOrganizerStructure = async () => {
  const organizerRef = collection(db, "organizer");
  const snapshot = await getDocs(organizerRef);
  const data = {};

  snapshot.forEach((docSnap) => {
    data[docSnap.id] = docSnap.data();
  });

  return data;
};

export const addNewExamCategory = async (categoryName) => {
  const displayName = categoryName.replace(/_/g, " ").toUpperCase();

  const [pyqsBatchId, fullMockBatchId] = await Promise.all([
    createTestBatch(displayName, "PYQs"),
    createTestBatch(displayName, "Full Mock"),
  ]);

  const docRef = doc(db, "organizer", categoryName);
  const structure = {
    name: displayName,
    pyqs: pyqsBatchId,
    full_mock: fullMockBatchId,
    topic_wise: {},
  };

  await setDoc(docRef, structure);
  return structure;
};

export const addTopicToCategory = async (categoryName, topicName) => {
  const { docRef, docData } = await fetchDoc("organizer", categoryName);
  const displayName = categoryName.replace(/_/g, " ").toUpperCase();
  const topicDisplayName = topicName.replace(/_/g, " ").toUpperCase();

  const topicBatchId = await createTestBatch(
    displayName,
    `Topic - ${topicDisplayName}`
  );

  const updatedData = {
    ...docData,
    topic_wise: {
      ...docData.topic_wise,
      [topicName]: topicBatchId,
    },
  };

  await updateDoc(docRef, updatedData);
  return updatedData;
};

// Simple function to upload JSON to temporary collection
export const uploadQuizzesToBatch = async (
  batchId,
  files,
  language = "english",
  onProgress = (current, total) => {}
) => {
  try {
    const results = {
      successful: [],
      failed: [],
    };

    // Get the testBatch document reference directly using batchId
    const batchRef = doc(db, "testBatches", batchId);
    const batchDoc = await getDoc(batchRef);

    if (!batchDoc.exists()) {
      throw new Error("Test batch not found");
    }

    const batchData = batchDoc.data();
    const examDetails = batchData.examDetails || [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Report progress
      onProgress(i + 1, files.length);

      try {
        // Parse JSON file
        const quizData = JSON.parse(await file.text());

        // Process sections and questions first
        if (quizData.sections) {
          for (const section of quizData.sections) {
            if (section.questions) {
              const processedQuestions = await Promise.all(
                section.questions.map(async (question) => {
                  // Add language to question data
                  const questionData = {
                    ...question,
                    language: language || "english",
                  };

                  // Add question to tmpQuestions collection
                  const questionRef = question.code
                    ? doc(db, "tmpQuestions", question.code)
                    : await addDoc(
                        collection(db, "tmpQuestions"),
                        questionData
                      );

                  if (question.code) {
                    await setDoc(questionRef, questionData);
                  }

                  return {
                    id: question.code || questionRef.id,
                    ...questionData,
                  };
                })
              );

              section.questions = processedQuestions;
            }
          }
        }

        // Add to temporary collection with language and processed sections
        const tmpQuizRef = await addDoc(collection(db, "tmpQuizzes"), {
          ...quizData,
          batchId, // Store batchId instead of batchPath
          language,
          uploadedAt: new Date(),
          fileName: file.name,
        });

        // Check if a quiz with the same title exists
        const existingQuizIndex = examDetails.findIndex(
          (quiz) => quiz.title === (quizData.title || "Untitled")
        );

        // Create quiz metadata (excluding sections)
        const quizMetadata = {
          title: quizData.title || "Untitled",
          description: quizData.description || "",
          duration: quizData.duration || 0,
          positiveScore: quizData.positiveScore || 0,
          negativeScore: quizData.negativeScore || 0,
          thumbnailLink: quizData.thumbnailLink || "",
          primaryQuizId: tmpQuizRef.id,
          quizIds: [
            {
              language,
              quizId: tmpQuizRef.id,
            },
          ],
        };

        if (existingQuizIndex !== -1) {
          // Quiz with same title exists
          const existingQuiz = examDetails[existingQuizIndex];

          // Keep the primary quiz ID from the first upload
          quizMetadata.primaryQuizId = existingQuiz.primaryQuizId;

          // Check if this language already exists in quizIds
          const existingLanguageIndex = existingQuiz.quizIds.findIndex(
            (item) => item.language === language
          );

          if (existingLanguageIndex !== -1) {
            // Update the existing language entry
            quizMetadata.quizIds = existingQuiz.quizIds.map((item) =>
              item.language === language
                ? { language, quizId: tmpQuizRef.id }
                : item
            );
          } else {
            // Add new language entry
            quizMetadata.quizIds = [
              ...existingQuiz.quizIds,
              { language, quizId: tmpQuizRef.id },
            ];
          }

          // Replace the existing quiz with updated metadata
          examDetails[existingQuizIndex] = quizMetadata;
        } else {
          // New quiz, add to examDetails
          examDetails.push(quizMetadata);
        }

        results.successful.push({
          filename: file.name,
          quizId: tmpQuizRef.id,
          title: quizData.title || "Untitled",
          language,
        });
      } catch (error) {
        results.failed.push({
          filename: file.name,
          error: error.message,
        });
      }
    }

    // Update the testBatch document with new examDetails
    await updateDoc(batchRef, { examDetails });

    // Report final progress
    onProgress(files.length, files.length);

    return results;
  } catch (error) {
    console.error("Error uploading quizzes:", error);
    throw error;
  }
};
