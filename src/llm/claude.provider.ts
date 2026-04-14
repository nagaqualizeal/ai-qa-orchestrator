import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

// 🔥 Validate key early (prevents silent failure)
const key = process.env.CLAUDE_API_KEY;

if (!key) {
  throw new Error("❌ CLAUDE_API_KEY is missing in .env");
}

console.log("Claude Key Loaded:", key.substring(0, 10), "...");

const anthropic = new Anthropic({
  apiKey: key,
});

export async function callClaude(prompt: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = response.content
      .filter((block: any) => block.type === "text")
      .map((block: any) => block.text)
      .join("\n");

    if (!textContent) {
      throw new Error("Empty response from Claude");
    }

    return textContent;

  } catch (error: any) {
    console.error("❌ Claude API Error:", error.message);
    throw error;
  }
}