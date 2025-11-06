
import { GameResult } from '../types';

const HISTORY_KEY = 'mathTugOfWarHistory';

export const getHistory = (): GameResult[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const saveHistory = (history: GameResult[]) => {
  try {
    const historyJson = JSON.stringify(history);
    localStorage.setItem(HISTORY_KEY, historyJson);
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};
