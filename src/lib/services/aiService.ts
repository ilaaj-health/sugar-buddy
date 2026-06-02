import { INTERPRETATION_SYSTEM_PROMPT, COPILOT_SYSTEM_PROMPT, buildUserContext } from '@/lib/config/ai-prompts';
import { type ReadingType, type Classification, getClassificationLabel, getTargetRangeLabel } from './glucoseService';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage { role: 'system' | 'user' | 'assistant'; content: string; }

async function callOpenRouter(messages: OpenRouterMessage[], maxTokens: number): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-haiku';
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sugar-buddy.vercel.app',
      'X-Title': 'Sugar Buddy',
    },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.4 }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(`OpenRouter error: ${data.error.message}`);
  return data.choices?.[0]?.message?.content || '';
}

export async function generateInterpretation(params: {
  value: number; type: ReadingType; classification: Classification;
  user: { name?: string | null; age?: number | null; diabetesType?: string | null; onInsulin?: boolean; };
}): Promise<string> {
  const { value, type, classification, user } = params;
  const classLabel = getClassificationLabel(classification);
  const targetRange = getTargetRangeLabel(type);

  const userMessage = `Reading: ${value} mg/dl\nType: ${type}\nClassification: ${classification} (${classLabel.romanUrdu} / ${classLabel.english})\nTarget Range: ${targetRange.romanUrdu}\n\nUser: ${user.name || 'User'}, Age: ${user.age || 'unknown'}, Diabetes: ${user.diabetesType || 'unknown'}, Insulin: ${user.onInsulin ? 'Yes' : 'No'}`;

  try {
    return (await callOpenRouter([
      { role: 'system', content: INTERPRETATION_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ], 500)) || 'Tashreeh dastiyaab nahi hai.';
  } catch (error) {
    console.error('AI interpretation error:', error);
    return 'Maazrat, tashreeh faraahim karne mein masla hua.';
  }
}

export async function getCopilotResponse(params: {
  message: string;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  user: { name?: string | null; email?: string | null; age?: number | null; diabetesType?: string | null; onInsulin?: boolean; createdAt?: Date | string | null; };
  totalReadings?: number;
  recentReadings: Array<{ value: number; type: string; classification: string; takenAt: Date | string; }>;
}): Promise<string> {
  const { message, chatHistory, user, recentReadings, totalReadings } = params;
  const contextBlock = buildUserContext(user, recentReadings, totalReadings);
  const systemPrompt = COPILOT_SYSTEM_PROMPT + '\n\n' + contextBlock;

  const messages: OpenRouterMessage[] = [{ role: 'system', content: systemPrompt }];
  for (const msg of chatHistory.slice(-20)) {
    messages.push({ role: msg.role, content: msg.content });
  }
  messages.push({ role: 'user', content: message });

  try {
    return (await callOpenRouter(messages, 800)) || 'Maazrat, jawab faraahim karne mein masla hua.';
  } catch (error) {
    console.error('AI copilot error:', error);
    return 'Maazrat, abhi jawab dene mein masla ho raha hai. Baraah karam dobara koshish karein.';
  }
}
