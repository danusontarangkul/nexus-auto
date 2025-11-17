import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { parseMaintenanceItems, parseOpenAIResponse } from "./helpers/openAi";
import { callOpenAIVision } from "./functions/openAi";
import { getOpenAIKey } from "./utils/validateKey";

export const scanReceipt = internalAction({
  args: { receiptId: v.id("receipts") },
  handler: async (ctx, { receiptId }) => {
    const receipt = await ctx.runQuery(internal.receipts.getReceiptById, {
      receiptId,
    });
    if (!receipt || receipt.status !== "ready" || !receipt.url) {
      return;
    }

    const content = await callOpenAIVision(ctx, receipt.url);

    const parsedJson = parseOpenAIResponse(content);

    await ctx.runMutation(internal.receipts.updateReceiptWithAI, {
      receiptId,
      parsedData: parsedJson,
      status: "completed",
    });

    if ("raw" in parsedJson === false && parsedJson.date && parsedJson.total) {
      await ctx.scheduler.runAfter(
        0,
        internal.serviceRecords.createFromReceipt,
        {
          receiptId,
          aiData: parsedJson,
        }
      );
    }
  },
});

export const generateMaintenanceTemplate = internalAction({
  args: {
    make: v.string(),
    model: v.string(),
    year: v.number(),
  },
  handler: async (ctx, { make, model, year }) => {
    const prompt = `Generate a complete factory maintenance schedule for a ${year} ${make} ${model} as valid JSON only.
Include every recommended service with these exact fields:
- name: string
- category: string
- intervalMiles: number | null
- intervalMonths: number | null

Return ONLY the JSON array, no markdown, no text.`;

    let content: string;
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getOpenAIKey()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 2000,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI ${response.status}: ${text}`);
      }

      const json = await response.json();
      content = json.choices?.[0]?.message?.content?.trim();

      if (!content) throw new Error("Empty response from OpenAI");
    } catch (error) {
      console.error("OpenAI template generation failed:", error);
      throw error; // Let caller handle — we want insertVehicle to know it failed
    }

    const items = parseMaintenanceItems(content);

    await ctx.runMutation(internal.maintenanceTemplates.createAIGenerated, {
      make,
      model,
      yearStart: year,
      yearEnd: year,
      defaultItems: items,
    });

    return items;
  },
});
