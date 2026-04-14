import { callClaude } from "../../llm/claude.provider";
import { buildTestDesignPrompt } from "./testDesign.prompt";

export async function runTestDesign(jiraAnalysis: any) {
  console.log(`🧪 Generating AI test cases for ${jiraAnalysis.storyId}`);

  // ✅ CONFIG HERE (for now)
  const testConfig = {
    total: 6,
    types: ["positive", "negative", "edge", "boundary"]
  };

  const prompt = buildTestDesignPrompt(jiraAnalysis, testConfig);

  const aiResponse = await callClaude(prompt);

  console.log("🧠 Test Design Raw Response:", aiResponse);

  const parsed = extractJSON(aiResponse);

  return {
    storyId: jiraAnalysis.storyId,
    ...parsed
  };
}

function extractJSON(text: string) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");

    return JSON.parse(match[0]);
  } catch (error) {
    console.error("❌ Test Design JSON Parse Failed:", text);

    return {
      testCases: [],
      confidenceScore: 0.5
    };
  }
}