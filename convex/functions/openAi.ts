import { ActionCtx } from "../_generated/server";

export async function callOpenAIVision(
  ctx: ActionCtx,
  imageUrl: string,
  prompt: string = "Extract all data from this car service receipt as JSON. Include: date, total amount, service center name, items performed, mileage, VIN if present."
): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI returned empty content");
    }

    return content;
  } catch (error) {
    console.error("callOpenAIVision failed:", error);
    throw error; // re-throw so caller can handle
  }
}
