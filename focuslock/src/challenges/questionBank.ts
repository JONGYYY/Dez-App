export type Question = {
  id: string;
  type: 'math' | 'reading' | 'logic';
  difficulty: number; // 1..5
  prompt: string;
  choices: string[];
  answerIndex: number;
};

export const QuestionBank: Question[] = [
  {
    id: 'm-1',
    type: 'math',
    difficulty: 1,
    prompt: 'What is 18 + 27?',
    choices: ['35', '45', '46', '55'],
    answerIndex: 1,
  },
  {
    id: 'm-2',
    type: 'math',
    difficulty: 1,
    prompt: 'What is 9 × 7?',
    choices: ['54', '56', '63', '72'],
    answerIndex: 2,
  },
  {
    id: 'm-3',
    type: 'math',
    difficulty: 2,
    prompt: 'Solve: 3x + 5 = 26',
    choices: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
    answerIndex: 1,
  },
  {
    id: 'm-4',
    type: 'math',
    difficulty: 2,
    prompt: 'If a shirt is $40 and is discounted by 25%, what is the sale price?',
    choices: ['$10', '$20', '$30', '$35'],
    answerIndex: 2,
  },
  {
    id: 'm-5',
    type: 'math',
    difficulty: 3,
    prompt: 'Solve: 2(x − 4) = 3x + 1',
    choices: ['x = −9', 'x = −7', 'x = 7', 'x = 9'],
    answerIndex: 1,
  },
  {
    id: 'm-6',
    type: 'math',
    difficulty: 4,
    prompt: 'If f(x) = 2x² − 3x + 1, what is f(3)?',
    choices: ['4', '10', '12', '16'],
    answerIndex: 1,
  },
  {
    id: 'l-1',
    type: 'logic',
    difficulty: 1,
    prompt: 'If all blips are blops, and some blops are blats, which must be true?',
    choices: [
      'Some blips are blats',
      'All blops are blips',
      'Some blats are blops',
      'No blats are blops',
    ],
    answerIndex: 2,
  },
  {
    id: 'l-2',
    type: 'logic',
    difficulty: 2,
    prompt:
      'A test has 10 questions. You get 2 points for each correct answer and −1 for each wrong answer. If you score 11 points, how many did you get correct?',
    choices: ['4', '5', '6', '7'],
    answerIndex: 2,
  },
  {
    id: 'l-3',
    type: 'logic',
    difficulty: 3,
    prompt:
      'Three friends (A, B, C) sit in a row. A is not next to C. B is not on an end. Who is in the middle?',
    choices: ['A', 'B', 'C', 'Cannot be determined'],
    answerIndex: 1,
  },
  {
    id: 'r-1',
    type: 'reading',
    difficulty: 1,
    prompt:
      'Passage: "A routine can feel restrictive, but it often frees attention for creative work." The author suggests routines primarily…',
    choices: [
      'prevent creativity',
      'free mental bandwidth',
      'cause boredom',
      'replace hard work',
    ],
    answerIndex: 1,
  },
  {
    id: 'r-2',
    type: 'reading',
    difficulty: 2,
    prompt:
      'Passage: "When incentives reward speed over accuracy, errors become predictable." The passage implies that errors are…',
    choices: [
      'always random',
      'caused by incentives',
      'unavoidable',
      'mostly harmless',
    ],
    answerIndex: 1,
  },
  {
    id: 'r-3',
    type: 'reading',
    difficulty: 3,
    prompt:
      'Passage: "Distraction is not a lack of willpower alone; it is often a mismatch between environment and intention." The author would most likely agree that…',
    choices: [
      'willpower is irrelevant',
      'changing environment can help focus',
      'intention is unnecessary',
      'distraction is a personal failure',
    ],
    answerIndex: 1,
  },
  {
    id: 'm-7',
    type: 'math',
    difficulty: 3,
    prompt: 'If 4a − 7 = 9, what is a?',
    choices: ['1', '2', '3', '4'],
    answerIndex: 2,
  },
  {
    id: 'm-8',
    type: 'math',
    difficulty: 4,
    prompt: 'What is the slope of the line passing through (2, 5) and (6, 13)?',
    choices: ['1', '2', '3', '4'],
    answerIndex: 1,
  },
  {
    id: 'l-4',
    type: 'logic',
    difficulty: 4,
    prompt:
      'If today is not Monday, and tomorrow is not Tuesday, what day could today be?',
    choices: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    answerIndex: 0,
  },
  {
    id: 'r-4',
    type: 'reading',
    difficulty: 4,
    prompt:
      'Passage: "A strategy that works in calm conditions may fail under stress, revealing not weakness but incomplete testing." The author’s tone is best described as…',
    choices: ['sarcastic', 'cautionary', 'celebratory', 'dismissive'],
    answerIndex: 1,
  },
];


