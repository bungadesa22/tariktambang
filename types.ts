
export enum Page {
  Home,
  Settings,
  Game,
  Results,
}

export enum Operation {
  Addition = '+',
  Subtraction = '−',
  Multiplication = '×',
  Division = '÷',
}

export enum Team {
  Red = 'Red',
  Blue = 'Blue',
}

export interface GameSettings {
  operations: Operation[];
  numberRange: { min: number; max: number };
  duration: number; // in seconds
  questionCount: number;
}

export interface Question {
  text: string;
  answer: number;
}

export interface GameResult {
  id: string;
  redScore: number;
  blueScore: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  duration: number;
  operations: Operation[];
  timestamp: number;
  winner: Team | 'Draw';
}
