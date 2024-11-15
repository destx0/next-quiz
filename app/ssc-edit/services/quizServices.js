import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const quizServices = {
  async changeQuizLanguage(batchId, quizId, currentLanguage, newLanguage) {
    try {
      console.log("changeQuizLanguage service called:", {
        batchId,
        quizId,
        currentLanguage,
        newLanguage,
      });

      // 1. Update in test batch
      const batchRef = doc(db, "testBatches", batchId);
      const batchSnapshot = await getDoc(batchRef);

      if (!batchSnapshot.exists()) {
        throw new Error("Batch not found");
      }

      const batchData = batchSnapshot.data();
      console.log("Found batch data:", batchData);

      // Find and update the specific quiz language
      const updatedExamDetails = batchData.examDetails.map((exam) => {
        // Check if this exam contains our quiz
        const hasQuiz = exam.quizIds.some((q) => q.quizId === quizId);

        if (hasQuiz) {
          console.log("Found matching exam:", exam);
          return {
            ...exam,
            quizIds: exam.quizIds.map((q) =>
              q.quizId === quizId ? { ...q, language: newLanguage } : q
            ),
          };
        }
        return exam;
      });

      console.log("Updated exam details:", updatedExamDetails);

      // 2. Update both documents in Firebase
      await Promise.all([
        // Update test batch
        updateDoc(batchRef, {
          examDetails: updatedExamDetails,
        }),
        // Update quiz document
        updateDoc(doc(db, "fullQuizzes", quizId), {
          language: newLanguage,
        }),
      ]);

      console.log("Successfully updated both documents");
      return updatedExamDetails;
    } catch (error) {
      console.error("Error in changeQuizLanguage:", error);
      throw error;
    }
  },

  async getQuizDetails(quizId) {
    try {
      const quizDoc = await getDoc(doc(db, "fullQuizzes", quizId));
      if (!quizDoc.exists()) {
        throw new Error("Quiz not found");
      }
      return quizDoc.data();
    } catch (error) {
      console.error("Error getting quiz details:", error);
      throw error;
    }
  },

  async removeLanguageVersion(batchId, quizId, language) {
    try {
      console.log("Removing language version:", { batchId, quizId, language });

      const batchRef = doc(db, "testBatches", batchId);
      const batchSnapshot = await getDoc(batchRef);

      if (!batchSnapshot.exists()) {
        throw new Error("Batch not found");
      }

      const batchData = batchSnapshot.data();

      // Find and update the specific quiz
      const updatedExamDetails = batchData.examDetails.map((exam) => {
        // Only modify if this exam contains our quiz
        if (exam.quizIds.some((q) => q.quizId === quizId)) {
          // Don't remove if it's the last language version
          if (exam.quizIds.length <= 1) {
            throw new Error("Cannot remove the last language version");
          }

          return {
            ...exam,
            quizIds: exam.quizIds.filter(
              (q) => !(q.quizId === quizId && q.language === language)
            ),
          };
        }
        return exam;
      });

      // Update Firebase
      await updateDoc(batchRef, {
        examDetails: updatedExamDetails,
      });

      console.log("Successfully removed language version");
      return updatedExamDetails;
    } catch (error) {
      console.error("Error removing language version:", error);
      throw error;
    }
  },
};
