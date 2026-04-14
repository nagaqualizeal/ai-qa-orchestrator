import { runGitAgent } from "../src/agents/git/git.agent";

const storyId = process.argv[2];

if (!storyId) {
  console.error("❌ Please provide storyId");
  process.exit(1);
}

(async () => {
  try {
    console.log(`🚀 Pushing branch for ${storyId}`);

    const branchName = await runGitAgent(storyId);

    console.log(`✅ Code pushed to branch: ${branchName}`);

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  }
})();