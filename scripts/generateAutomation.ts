import { runAutomationAgent } from "../src/agents/automation/automation.agent";

const storyId = process.argv[2];

if (!storyId) {
  console.error("❌ Please provide Story ID");
  console.log("👉 Example: npx ts-node scripts/generateAutomation.ts MER-50");
  process.exit(1);
}

console.log(`🤖 Generating automation for ${storyId}`);

runAutomationAgent(storyId);