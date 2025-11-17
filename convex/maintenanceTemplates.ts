import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

export const insertMaintenanceTemplate = internalMutation({
  args: {
    make: v.string(),
    model: v.string(),
    yearStart: v.number(),
    yearEnd: v.number(),
    defaultItems: v.array(
      v.object({
        name: v.string(),
        category: v.string(),
        intervalMiles: v.optional(v.number()),
        intervalMonths: v.optional(v.number()),
      }),
    ),
    source: v.union(v.literal('seeded'), v.literal('ai-generated')),
  },
  handler: async (ctx, { make, model, yearStart, yearEnd, defaultItems }) => {
    return await ctx.db.insert('maintenanceTemplates', {
      make,
      model,
      yearStart,
      yearEnd,
      defaultItems,
      source: 'ai-generated',
    });
  },
});
