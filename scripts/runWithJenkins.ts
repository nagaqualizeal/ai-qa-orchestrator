import dotenv from "dotenv";
dotenv.config();

import { runGitAgent } from "../src/agents/git/git.agent";
import { runJenkinsAgent } from "../src/agents/cicd/jenkins.agent";

const storyId = process.argv[2];

if (!storyId) {
  console.error("❌ Provide storyId");
  process.exit(1);
}

(async () => {
  try {
    const branchName = await runGitAgent(storyId);

    const result = await runJenkinsAgent(storyId, branchName);

    console.log("\n🎉 FINAL RESULT:");
    console.log(result);

  } catch (err: any) {
    console.error(err.message);
  }
})();