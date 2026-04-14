import axios from "axios";
import { callClaude } from "../../llm/claude.provider";

export async function runPRAgent(
  storyId: string,
  branchName: string
) {
  try {
    console.log("🧠 Generating PR description via Claude...");

    const prompt = `
Generate a professional GitHub PR description.

Details:
- Story ID: ${storyId}
- Added:
  - Playwright Page Object
  - Test Data JSON
  - Test Spec

Include:
- Summary
- What was added
- Test coverage

Return plain text only.
`;

    const prBody = await callClaude(prompt);

    const title = `AI: Add automation tests for ${storyId}`;

    const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/pulls`;

    const response = await axios.post(
      url,
      {
        title,
        head: branchName,
        base: process.env.GITHUB_BASE_BRANCH,
        body: prBody
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    console.log("✅ PR Created:", response.data.html_url);

  } catch (error: any) {
    console.error("❌ PR Agent Error:", error.response?.data || error.message);
  }
}