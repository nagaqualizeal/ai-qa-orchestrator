import { runGitAgent } from "../src/agents/git/git.agent";
import { runPRAgent } from "../src/agents/git/pr.agent";

const storyId = process.argv[2];

if (!storyId) {
  console.error("❌ Please provide storyId");
  process.exit(1);
}

(async () => {
  try {
    console.log(`🚀 Pushing and creating PR for ${storyId}`);

    const branchName = await runGitAgent(storyId);

    await runPRAgent(storyId, branchName);

    console.log("🎉 PR created successfully");

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  }
})();