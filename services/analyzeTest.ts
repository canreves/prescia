import Anthropic from '@anthropic-ai/sdk';
import * as FileSystem from 'expo-file-system';
import type { TestResult } from '../types';

const SYSTEM_PROMPT = `You are a medical test result interpreter for a general audience.
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
  // Read image as base64
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const client = new Anthropic({
    apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64,
            },
          },
          {
            type: 'text',
            text: USER_PROMPT,
          },
        ],
      },
    ],
  });

  const raw = response.content[0];
  if (raw.type !== 'text') {
    throw new Error('Unexpected response type from API');
  }

  // Strip any accidental markdown fences Claude might add
  const cleaned = raw.text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const parsed: TestResult[] = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error('API did not return an array');
  }

  return parsed;
}
