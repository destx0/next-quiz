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
    pyqs: `/testBatches/${pyqsBatchId}`,
    full_mock: `/testBatches/${fullMockBatchId}`,
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
      [topicName]: `/testBatches/${topicBatchId}`,
    },
  };

  await updateDoc(docRef, updatedData);
  return updatedData;
};

// Simple function to upload JSON to temporary collection
export const uploadQuizzesToBatch = async (
  batchPath,
  files,
  language = "english"
) => {
  try {
    const results = {
      successful: [],
      failed: [],
    };

    // Get the testBatch document reference
    const [_, __, batchId] = batchPath.split("/");
    const batchRef = doc(db, "testBatches", batchId);
    const batchDoc = await getDoc(batchRef);

    if (!batchDoc.exists()) {
      throw new Error("Test batch not found");
    }

    const batchData = batchDoc.data();
    const examDetails = batchData.examDetails || [];

    for (const file of files) {
      try {
        // Parse JSON file
        const quizData = JSON.parse(await file.text());

        // Add to temporary collection with language
        const tmpQuizRef = await addDoc(collection(db, "tmpQuizzes"), {
          ...quizData,
          batchPath,
          language,
          uploadedAt: new Date(),
          fileName: file.name,
        });

        // Create quiz metadata (excluding sections)
        const quizMetadata = {
          id: tmpQuizRef.id,
          title: quizData.title || "Untitled",
          description: quizData.description || "",
          duration: quizData.duration || 0,
          totalMarks: quizData.totalMarks || 0,
          passingMarks: quizData.passingMarks || 0,
          language,
          uploadedAt: new Date(),
          fileName: file.name,
        };

        // Add metadata to examDetails array
        examDetails.push(quizMetadata);

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

    return results;
  } catch (error) {
    console.error("Error uploading quizzes:", error);
    throw error;
  }
};
