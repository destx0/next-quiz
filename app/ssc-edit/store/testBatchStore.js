import { create } from "zustand";
import { fetchTestBatches, updateBatchOrder } from "../utils/firebaseUtils";
import { updateQuizMetadata } from "../utils/quizActions";

const useTestBatchStore = create((set, get) => ({
  testBatches: [],
  loading: true,
  user: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  fetchTestBatches: async () => {
    try {
      const setTestBatches = (batches) => set({ testBatches: batches });
      const setLoading = (loading) => set({ loading });
      await fetchTestBatches(setTestBatches, setLoading);
    } catch (error) {
      console.error("Error fetching test batches:", error);
      set({ loading: false });
    }
  },

  updateBatchOrder: async (batchId, newExamDetails) => {
    const { testBatches } = get();
    const newTestBatches = testBatches.map((b) =>
      b.id === batchId ? { ...b, examDetails: newExamDetails } : b
    );
    set({ testBatches: newTestBatches });
    await updateBatchOrder(batchId, newExamDetails);
  },

  updateQuizMetadata: async (updatedQuiz) => {
    try {
      await updateQuizMetadata(updatedQuiz.id, updatedQuiz);
      set((state) => ({
        testBatches: state.testBatches.map((batch) => ({
          ...batch,
          examDetails: batch.examDetails.map((quiz) =>
            quiz.id === updatedQuiz.id ? updatedQuiz : quiz
          ),
        })),
      }));
    } catch (error) {
      console.error("Error updating quiz metadata:", error);
      throw error;
    }
  },
}));

export default useTestBatchStore;
