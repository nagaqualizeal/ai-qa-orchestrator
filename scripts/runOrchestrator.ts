import { Orchestrator } from "../src/orchestrator/orchestrator";

const orchestrator = new Orchestrator();

// ✅ Get story ID from CLI
const storyId = process.argv[2];

// ❌ Validate input
if (!storyId) {
  console.error("❌ Please provide a Story ID");
  console.log("👉 Example: npx ts-node scripts/runOrchestrator.ts MER-50");
  process.exit(1);
}

// 🚀 Execute
orchestrator.execute(storyId).then((res) => {
  console.log("Final Result:", res);
}).catch((err) => {
  console.error("❌ Execution Failed:", err.message);
});