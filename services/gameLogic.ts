
import { GameSettings, Question, Operation } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(settings: GameSettings): Question {
  const { operations, numberRange } = settings;
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1 = getRandomInt(numberRange.min, numberRange.max);
  let num2 = getRandomInt(numberRange.min, numberRange.max);
  let text = '';
  let answer = 0;

  switch (operation) {
    case Operation.Addition:
      text = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
      break;
    case Operation.Subtraction:
      if (num1 < num2) {
        [num1, num2] = [num2, num1]; // Ensure positive result
      }
      text = `${num1} − ${num2} = ?`;
      answer = num1 - num2;
      break;
    case Operation.Multiplication:
      // Reduce range for multiplication to avoid very large numbers
      num1 = getRandomInt(numberRange.min, Math.min(numberRange.max, 12));
      num2 = getRandomInt(numberRange.min, Math.min(numberRange.max, 12));
      text = `${num1} × ${num2} = ?`;
      answer = num1 * num2;
      break;
    case Operation.Division:
      // Ensure result is a whole number
      const product = getRandomInt(numberRange.min, Math.min(numberRange.max, 10)) * getRandomInt(1, 10);
      num2 = getRandomInt(2, Math.min(numberRange.max, 10));
      while (product % num2 !== 0) {
        num2 = getRandomInt(2, Math.min(numberRange.max, 10));
      }
      num1 = product;
      text = `${num1} ÷ ${num2} = ?`;
      answer = num1 / num2;
      break;
  }

  return { text, answer };
}
