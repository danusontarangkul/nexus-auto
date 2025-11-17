import { ConvexError } from "convex/values";
import { ActionCtx } from "../_generated/server";

export async function uploadFile(
  ctx: ActionCtx,
  file: Blob
): Promise<{ fileId: string; url: string }> {
  const fileId = await ctx.storage.store(file);
  const url = await ctx.storage.getUrl(fileId);

  if (!url) {
    throw new ConvexError({
      code: "internal_error",
      message: "Failed to generate file URL",
    });
  }

  return { fileId, url };
}
