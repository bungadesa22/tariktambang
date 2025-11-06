
import { GameSettings, Operation } from './types';

export const DEFAULT_SETTINGS: GameSettings = {
  operations: [Operation.Addition],
  numberRange: { min: 1, max: 10 },
  duration: 60, // 1 minute
  questionCount: 20,
};

export const MAX_HISTORY_ITEMS = 999;
export const ROPE_MOVEMENT_PERCENT = 5;
export const STREAK_BONUS_PERCENT = 5;
export const STREAK_THRESHOLD = 3;
export const QUESTION_TIMER_SECONDS = 10;
