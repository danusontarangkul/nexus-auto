import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

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

export const getMaintenanceTemplatesByMakeModelYear = internalQuery({
  args: {
    make: v.string(),
    model: v.string(),
    year: v.number(),
  },
  handler: async (ctx, { make, model, year }) => {
    return await ctx.db
      .query('maintenanceTemplates')
      .withIndex('by_make_model_year', (q) =>
        q.eq('make', make).eq('model', model).eq('yearStart', year),
      )
      .collect();
  },
});
