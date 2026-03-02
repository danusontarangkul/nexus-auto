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
    // Hardcoded sample data for testing purposes
    return [
      {
        _id: 'sample_template_id' as any,
        _creationTime: Date.now(),
        make: make,
        model: model,
        yearStart: year,
        yearEnd: year + 5,
        source: 'seeded',
        defaultItems: [
          {
            name: 'Synthetic Oil Change',
            category: 'Engine',
            intervalMiles: 7500,
            intervalMonths: 6,
            severity: 'normal',
            estimatedCostUsd: 80,
            notes: 'Replace oil filter and drain plug washer.',
          },
          {
            name: 'Tire Rotation & Brake Inspection',
            category: 'Tires',
            intervalMiles: 5000,
            intervalMonths: 6,
            severity: 'normal',
            estimatedCostUsd: 30,
            notes: 'Check tread depth and brake pad thickness.',
          },
          {
            name: 'Engine Air Filter',
            category: 'Filters',
            intervalMiles: 15000,
            intervalMonths: 12,
            severity: 'normal',
            estimatedCostUsd: 45,
          },
        ],
      },
    ];
  },
});

// To do: Implement this query
// export const getMaintenanceTemplatesByMakeModelYear = internalQuery({
//   args: {
//     make: v.string(),
//     model: v.string(),
//     year: v.number(),
//   },
//   handler: async (ctx, { make, model, year }) => {
//     return await ctx.db
//       .query('maintenanceTemplates')
//       .withIndex('by_make_model_year', (q) =>
//         q.eq('make', make).eq('model', model).eq('yearStart', year),
//       )
//       .collect();
//   },
// });
