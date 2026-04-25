export type ResultStatus = 'normal' | 'high' | 'low';

export interface TestResult {
  id: string;
  emoji: string;
  name: string;
  value: string;
  normalRange: string;
  status: ResultStatus;
  explanation: string;
}
