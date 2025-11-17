// convex/ai/openai.ts
import { ConvexError } from 'convex/values';
import { getOpenAIKey } from '../utils/validateKey';

type MessageContent =
  | string
  | Array<
      | { type: 'text'; text: string }
      | { type: 'image_url'; image_url: { url: string } }
    >;

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: MessageContent;
};

export type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

export async function callOpenAI({
  messages,
  model = 'gpt-4o',
  maxTokens = 2000,
  temperature = 0,
}: {
  messages: Message[];
  model?: 'gpt-4o' | 'gpt-4-turbo' | 'gpt-4o-mini';
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getOpenAIKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI ${response.status}: ${text}`);
    }

    const data = (await response.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('OpenAI returned no content');
    }

    return content;
  } catch (error) {
    console.error('[OpenAI] call failed:', error);
    throw new ConvexError('Failed to call OpenAI');
  }
}
