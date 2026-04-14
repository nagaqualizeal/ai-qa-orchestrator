import { fetchJiraStory } from "../../integrations/jira/jira.client";
import { callClaude } from "../../llm/claude.provider";
import { buildJiraAnalysisPrompt } from "./jiraAnalysis.prompt";

export async function runJiraAnalysis(storyId: string) {
  console.log(`📥 Fetching Jira Story: ${storyId}`);

  const jiraRaw = await fetchJiraStory(storyId);
  const fields = jiraRaw.fields;

  const baseData = {
    storyId,
    title: fields.summary,
    description:
      fields.description?.content?.[0]?.content?.[0]?.text || "",
  };

  console.log("🧠 Sending data to Claude...");

  const prompt = buildJiraAnalysisPrompt(baseData);

  const aiResponse = await callClaude(prompt);

  console.log("🧠 Claude Raw Response:", aiResponse);

  const parsed = extractJSON(aiResponse);

  return {
    ...baseData,
    ...parsed
  };
}

// ✅ SAFE JSON EXTRACTOR
function extractJSON(text: string) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");

    return JSON.parse(match[0]);
  } catch (error) {
    console.error("❌ JSON Parse Failed. Raw AI Response:", text);

    // fallback to avoid crash
    return {
      derivedFlows: [],
      edgeCases: [],
      risks: [],
      missingInformation: [],
      confidenceScore: 0.5
    };
  }
}