import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchTestBatches = async (setTestBatches, setLoading) => {
  try {
    console.log("Fetching test batches...");
    const batchesSnapshot = await getDocs(collection(db, "testBatches"));
    
    const batchesData = batchesSnapshot.docs.map(batchDoc => ({
      id: batchDoc.id,
      ...batchDoc.data()
    }));

    console.log("Processed batch data:", batchesData);
    setTestBatches(batchesData);
  } catch (error) {
    console.error("Error fetching test batches:", error);
  } finally {
    setLoading(false);
  }
};

export const updateBatchOrder = async (batchId, examDetails) => {
  try {
    const batchRef = doc(db, "testBatches", batchId);
    await updateDoc(batchRef, { examDetails });
    console.log(`Batch ${batchId} order updated in Firebase`);
  } catch (error) {
    console.error("Error updating batch order:", error);
  }
};
