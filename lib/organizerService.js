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

export const getOrganizerStructure = async () => {
  try {
    const organizerRef = collection(db, "organizer");
    const snapshot = await getDocs(organizerRef);

    const data = {};
    snapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });

    return data;
  } catch (error) {
    console.error("Error fetching organizer structure:", error);
    throw error;
  }
};

const createTestBatch = async (examName, type) => {
  try {
    const testBatchRef = collection(db, "testBatches");
    const batchData = {
      title: `${examName} - ${type}`,
      description: `${type} tests for ${examName}`,
      examDetails: [],
      createdAt: new Date(),
      type: type.toLowerCase().replace(/\s+/g, "_"),
    };

    const docRef = await addDoc(testBatchRef, batchData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating test batch:", error);
    throw error;
  }
};

export const addNewExamCategory = async (categoryName) => {
  try {
    const displayName = categoryName.replace(/_/g, " ").toUpperCase();

    // Create test batches for PYQs and Full Mock
    const pyqsBatchId = await createTestBatch(displayName, "PYQs");
    const fullMockBatchId = await createTestBatch(displayName, "Full Mock");

    const docRef = doc(db, "organizer", categoryName);
    const structure = {
      name: displayName,
      pyqs: `/testBatches/${pyqsBatchId}`,
      full_mock: `/testBatches/${fullMockBatchId}`,
      topic_wise: {},
    };

    await setDoc(docRef, structure);
    return structure;
  } catch (error) {
    console.error("Error adding new exam category:", error);
    throw error;
  }
};

export const addTopicToCategory = async (categoryName, topicName) => {
  try {
    const docRef = doc(db, "organizer", categoryName);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Category does not exist");
    }

    // Create a test batch for the new topic
    const displayName = categoryName.replace(/_/g, " ").toUpperCase();
    const topicDisplayName = topicName.replace(/_/g, " ").toUpperCase();
    const topicBatchId = await createTestBatch(
      displayName,
      `Topic - ${topicDisplayName}`
    );

    const currentData = docSnap.data();
    const updatedData = {
      ...currentData,
      topic_wise: {
        ...currentData.topic_wise,
        [topicName]: `/testBatches/${topicBatchId}`,
      },
    };

    await updateDoc(docRef, updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error adding topic to category:", error);
    throw error;
  }
};

export const updateBatchId = async (categoryName, section, batchId) => {
  try {
    const docRef = doc(db, "organizer", categoryName);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Category does not exist");
    }

    const updatedData = {
      [section]: `/testBatches/${batchId}`,
    };

    await updateDoc(docRef, updatedData);
    return { ...docSnap.data(), ...updatedData };
  } catch (error) {
    console.error("Error updating batch ID:", error);
    throw error;
  }
};

export const updateTopicBatchId = async (categoryName, topicName, batchId) => {
  try {
    const docRef = doc(db, "organizer", categoryName);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Category does not exist");
    }

    const currentData = docSnap.data();
    const updatedData = {
      topic_wise: {
        ...currentData.topic_wise,
        [topicName]: `/testBatches/${batchId}`,
      },
    };

    await updateDoc(docRef, updatedData);
    return { ...currentData, ...updatedData };
  } catch (error) {
    console.error("Error updating topic batch ID:", error);
    throw error;
  }
};

export const renameItem = async (itemType, categoryName, oldName, newName) => {
  try {
    const docRef = doc(db, "organizer", categoryName);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Category does not exist");
    }

    const currentData = docSnap.data();
    const updatedData = { ...currentData };

    if (itemType === "topic") {
      // Rename topic
      const topicValue = currentData.topic_wise[oldName];
      delete updatedData.topic_wise[oldName];
      updatedData.topic_wise[newName] = topicValue;
    } else if (itemType === "category") {
      // Rename category field
      const value = currentData[oldName];
      delete updatedData[oldName];
      updatedData[newName] = value;
    }

    await updateDoc(docRef, updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error renaming item:", error);
    throw error;
  }
};
