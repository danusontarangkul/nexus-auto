import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { getRevenueCatSecret } from "./utils/validateKey";

export const fulfill = internalAction({
  args: {
    payload: v.string(),
    headers: v.object({
      authorization: v.string(),
    }),
  },
  handler: async (ctx, { payload, headers }) => {
    const secret = getRevenueCatSecret();

    const auth = headers.authorization;
    if (auth !== `Bearer ${secret}`) {
      throw new Error("Invalid webhook secret");
    }

    const event = JSON.parse(payload);

    return {
      type: event.event?.type || event.type,
      data: event.event || event,
    };
  },
});
