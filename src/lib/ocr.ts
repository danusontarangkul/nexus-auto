import { extractTextFromImage } from 'expo-text-extractor';

/**
 * Returns all recognized text as a single uppercase string.
 * (Uppercase helps VIN matching; for receipts you'll keep case if needed.)
 */
export async function recognizeTextFromImage(uri: string): Promise<string> {
  const lines = await extractTextFromImage(uri); // string[]
  const text = Array.isArray(lines) ? lines.join(' ') : String(lines ?? '');
  return text.toUpperCase();
}
