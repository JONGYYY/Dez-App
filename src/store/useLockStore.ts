import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Question } from '../challenges/questionBank';
import { fetchSATQuestions } from '../services/questionApi';

/**
 * Lock Store - Manages Soft Lock MCQ state and API integration
 * Handles loading/error states for network-fetched questions
 */

export type LockQuestionState = {
  questions: Question[];
  answers: Record<string, number | null>;
  isLoading: boolean;
  error: string | null;
  tempAccessGranted: boolean; // Temporary access after correct answer
  tempAccessExpiresAt: number | null; // Timestamp when temp access expires
};

type LockStoreState = {
  questionState: LockQuestionState;
  
  // Actions
  fetchQuestions: (difficulty: number, count: number) => Promise<void>;
  setAnswer: (questionId: string, answerIndex: number) => void;
  submitAnswers: () => { success: boolean; correctCount: number; totalCount: number };
  resetQuestionState: () => void;
  grantTempAccess: (durationMs: number) => void;
  checkTempAccess: () => boolean; // Returns true if temp access is still valid
};

const initialState: LockQuestionState = {
  questions: [],
  answers: {},
  isLoading: false,
  error: null,
  tempAccessGranted: false,
  tempAccessExpiresAt: null,
};

export const useLockStore = create<LockStoreState>()(
  persist(
    (set, get) => ({
      questionState: initialState,

      fetchQuestions: async (difficulty: number, count: number) => {
        set((state) => ({
          questionState: {
            ...state.questionState,
            isLoading: true,
            error: null,
          },
        }));

        try {
          const response = await fetchSATQuestions({ difficulty, count });
          
          if (response.success && response.questions.length > 0) {
            set((state) => ({
              questionState: {
                ...state.questionState,
                questions: response.questions,
                answers: {}, // Reset answers when fetching new questions
                isLoading: false,
                error: null,
              },
            }));
          } else {
            // Fallback questions were used, but still treat as success
            set((state) => ({
              questionState: {
                ...state.questionState,
                questions: response.questions,
                answers: {},
                isLoading: false,
                error: response.error || null,
              },
            }));
          }
        } catch (error: any) {
          set((state) => ({
            questionState: {
              ...state.questionState,
              isLoading: false,
              error: error.message || 'Failed to fetch questions',
              questions: [],
            },
          }));
        }
      },

      setAnswer: (questionId: string, answerIndex: number) => {
        set((state) => ({
          questionState: {
            ...state.questionState,
            answers: {
              ...state.questionState.answers,
              [questionId]: answerIndex,
            },
          },
        }));
      },

      submitAnswers: () => {
        const state = get().questionState;
        const { questions, answers } = state;
        
        let correctCount = 0;
        let totalCount = questions.length;
        
        questions.forEach((q) => {
          if (answers[q.id] === q.answerIndex) {
            correctCount++;
          }
        });
        
        const success = correctCount === totalCount && totalCount > 0;
        
        return { success, correctCount, totalCount };
      },

      resetQuestionState: () => {
        set({ questionState: initialState });
      },

      grantTempAccess: (durationMs: number) => {
        const expiresAt = Date.now() + durationMs;
        set((state) => ({
          questionState: {
            ...state.questionState,
            tempAccessGranted: true,
            tempAccessExpiresAt: expiresAt,
          },
        }));
      },

      checkTempAccess: () => {
        const state = get().questionState;
        if (!state.tempAccessGranted || !state.tempAccessExpiresAt) {
          return false;
        }
        
        const isValid = Date.now() < state.tempAccessExpiresAt;
        
        if (!isValid) {
          // Clear expired temp access
          set((state) => ({
            questionState: {
              ...state.questionState,
              tempAccessGranted: false,
              tempAccessExpiresAt: null,
            },
          }));
        }
        
        return isValid;
      },
    }),
    {
      name: 'focuslock_lock_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Don't persist loading/error states
        questionState: {
          questions: state.questionState.questions,
          answers: state.questionState.answers,
          isLoading: false,
          error: null,
          tempAccessGranted: state.questionState.tempAccessGranted,
          tempAccessExpiresAt: state.questionState.tempAccessExpiresAt,
        },
      }),
    }
  )
);





