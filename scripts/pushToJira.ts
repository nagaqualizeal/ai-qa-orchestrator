import { runJiraWriteAgent } from "../src/agents/jira/jiraWrite.agent";

const storyId = process.argv[2];

if (!storyId) {
  console.error("❌ Please provide Story ID");
  console.log("👉 Example: npx ts-node scripts/pushToJira.ts MER-50");
  process.exit(1);
}

console.log(`📢 About to push test cases for ${storyId}`);
console.log("⚠️ Make sure you have edited the JSON file before proceeding.");

runJiraWriteAgent(storyId);