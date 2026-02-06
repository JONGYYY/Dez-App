import { Question } from '../challenges/questionBank';
import { QuestionBank } from '../challenges/questionBank';

/**
 * API Service for fetching SAT-level questions
 * Falls back to local question bank if API is unavailable
 */

// API URL - configure via app.json extra.questionApiUrl or env variable
// For production, set EXPO_PUBLIC_QUESTION_API_URL or update app.json
const getApiUrl = () => {
  // Check environment variable first
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_QUESTION_API_URL) {
    return process.env.EXPO_PUBLIC_QUESTION_API_URL;
  }
  // Fallback to default (will fail gracefully and use local questions)
  return 'https://api.example.com/sat-questions';
};

const API_BASE_URL = getApiUrl();

export type QuestionApiResponse = {
  questions: Question[];
  success: boolean;
  error?: string;
};

/**
 * Fetch SAT-level questions from external API
 * @param difficulty Difficulty level (1-5)
 * @param count Number of questions to fetch
 * @returns Promise with questions or error
 */
export async function fetchSATQuestions(params: {
  difficulty: number;
  count: number;
}): Promise<QuestionApiResponse> {
  const { difficulty, count } = params;
  
  try {
    // In production, replace with actual SAT question API
    // For MVP, we'll use a mock API that simulates network delay
    const response = await fetch(`${API_BASE_URL}?difficulty=${difficulty}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for MVP
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (data.questions && Array.isArray(data.questions)) {
      return {
        questions: data.questions as Question[],
        success: true,
      };
    }
    
    throw new Error('Invalid API response format');
  } catch (error: any) {
    // Network error or API unavailable - fallback to local questions
    console.warn('Question API unavailable, using local fallback:', error.message);
    
    // Return fallback using local question bank
    return {
      questions: getLocalQuestions({ difficulty, count }),
      success: false,
      error: error.message || 'API unavailable',
    };
  }
}

/**
 * Get questions from local question bank as fallback
 */
function getLocalQuestions(params: { difficulty: number; count: number }): Question[] {
  const { difficulty, count } = params;
  const d = Math.min(5, Math.max(1, Math.round(difficulty)));
  const pool = QuestionBank.filter((q) => q.difficulty <= d);
  
  // Shuffle and return requested count
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Mock API function for development/testing
 * Simulates API behavior with network delay
 */
export async function fetchSATQuestionsMock(params: {
  difficulty: number;
  count: number;
}): Promise<QuestionApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // For now, return local questions (simulate API)
  // In production, replace with actual API call
  const questions = getLocalQuestions(params);
  
  return {
    questions,
    success: true,
  };
}

