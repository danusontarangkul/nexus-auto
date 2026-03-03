export type ReceiptAIResult =
  | {
      date?: string;
      total?: number;
      serviceCenter?: string;
      items?: Array<{ name: string; cost?: number }>;
      mileage?: number;
      vin?: string;
      [key: string]: unknown;
    }
  | { raw: string };

export function parseOpenAIResponse(content: string): ReceiptAIResult {
  try {
    const parsed = JSON.parse(content);

    if (parsed === null || typeof parsed !== 'object') {
      throw new Error('Not an object');
    }

    return parsed as ReceiptAIResult;
  } catch {
    return { raw: content.trim() };
  }
}

export type MaintenanceTemplateItem = {
  name: string;
  category: string;
  intervalMiles?: number;
  intervalMonths?: number;
  severity?: 'normal' | 'severe';
  estimatedCostUsd?: number;
  notes?: string;
};
export function parseMaintenanceItems(
  jsonString: string,
): MaintenanceTemplateItem[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('OpenAI returned invalid JSON, could not parse');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('OpenAI returned JSON that is not an array');
  }

  for (const item of parsed) {
    if (
      typeof item !== 'object' ||
      !item ||
      !('name' in item) ||
      !('category' in item)
    ) {
      throw new Error('OpenAI returned item missing required fields');
    }
  }

  return parsed as MaintenanceTemplateItem[];
}
