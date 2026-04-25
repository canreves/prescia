import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';
import type { TestResult } from '../types';

const SYSTEM_INSTRUCTION = `You are a medical test result interpreter for a general audience.
Analyze the provided medical test or prescription image and return structured results.
Always respond with ONLY a raw JSON array — no markdown fences, no prose, just the JSON array.
If the image is not a medical document, return an empty array: []`;

const USER_PROMPT = `Analyze this medical test or prescription image.

Return ONLY a JSON array. Each item must have exactly these fields:
{
  "id": "unique string (e.g. '1', '2')",
  "emoji": "a relevant medical emoji (e.g. 🩸 💚 🫀 💊)",
  "name": "full test or medication name",
  "value": "the measured result with its unit (e.g. '105 mg/dL')",
  "normalRange": "the normal range with unit (e.g. '70 – 100 mg/dL')",
  "status": "one of: 'normal' | 'high' | 'low'",
  "explanation": "1-2 sentences in simple, friendly language anyone can understand — no medical jargon"
}

If the image is not a medical test or prescription, return: []`;

export async function analyzeTest(imageUri: string): Promise<TestResult[]> {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '');

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64,
      },
    },
    { text: USER_PROMPT },
  ]);

  const raw = result.response.text().trim();

  // Strip any accidental markdown fences the model might add
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const parsed: TestResult[] = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error('API did not return an array');
  }

  return parsed;
}
