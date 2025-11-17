import { internalAction } from './_generated/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';
import { parseMaintenanceItems, parseOpenAIResponse } from './helpers/openAi';
import { callOpenAI } from './functions/openAi';

export const scanReceipt = internalAction({
  args: { receiptId: v.id('receipts') },
  handler: async (ctx, { receiptId }) => {
    const receipt = await ctx.runQuery(
      internal.receipts.getReceiptByIdInternal,
      {
        receiptId,
      },
    );
    if (!receipt || receipt.status !== 'ready' || !receipt.url) {
      return;
    }

    const content = await callOpenAI({
      messages: [
        { role: 'user', content: 'Scan the receipt and return the text' },
      ],
      model: 'gpt-4o',
      maxTokens: 2000,
      temperature: 0,
    });

    const parsedJson = parseOpenAIResponse(content);

    await ctx.runMutation(internal.receipts.updateReceiptInternal, {
      receiptId,
      updates: {
        parsedData: parsedJson,
        status: 'parsed',
      },
    });

    // if ('raw' in parsedJson === false && parsedJson.date && parsedJson.total && receipt.serviceRecordId) {
    //   await ctx.scheduler.runAfter(
    //     0,
    //     internal.serviceRecords.updateServiceRecordInternal,
    //     {
    //       serviceRecordId: receipt.serviceRecordId,
    //       updates: {
    //         C
    //         parsedData: parsedJson,
    //       },
    //     },
    //   );
    // }
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

    // One line — clean, safe, reusable
    const content = await callOpenAI({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
      maxTokens: 2000,
      temperature: 0,
    });

    const items = parseMaintenanceItems(content);

    await ctx.runMutation(
      internal.maintenanceTemplates.insertMaintenanceTemplate,
      {
        make,
        model,
        yearStart: year,
        yearEnd: year,
        defaultItems: items.map((item) => ({
          name: item.name,
          category: item.category,
          intervalMiles: item.intervalMiles ?? undefined,
          intervalMonths: item.intervalMonths ?? undefined,
        })),
        source: 'ai-generated',
      },
    );

    return items;
  },
});
