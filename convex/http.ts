import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { handleExpiration } from "./webhooks/revenueCat";
import { internal } from "./_generated/api";
import {
  handleInitialPurchase,
  handleRenewedSubscription,
} from "./webhooks/revenueCat";

const http = httpRouter();

http.route({
  path: "/revenueCat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const authHeader = request.headers.get("authorization") ?? "";

    try {
      const result = await ctx.runAction(internal.revenueCat.fulfill, {
        payload: payloadString,
        headers: { authorization: authHeader },
      });

      switch (result.type) {
        case "INITIAL_PURCHASE":
          await handleInitialPurchase(ctx, result.data);
          break;
        case "RENEWED_SUBSCRIPTION":
          await handleRenewedSubscription(ctx, result.data);
          break;
        case "EXPIRATION":
          await handleExpiration(ctx, result.data);
          break;
      }

      return new Response("Webhook processed", { status: 200 });
    } catch (error) {
      console.error("RevenueCat webhook error:", error);
      return new Response("Unauthorized or bad payload", { status: 400 });
    }
  }),
});

export default http;
