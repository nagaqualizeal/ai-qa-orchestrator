import axios from "axios";
import fs from "fs";
import path from "path";
import { ENV } from "../../config/env";
import { jiraConfig } from "../../config/jiraConfig";

export async function runJiraWriteAgent(storyId: string) {
  try {
    console.log(`\n🚀 Pushing test cases to Jira for ${storyId}`);

    // 📁 Get latest JSON file
    const testCaseFolder = path.join(
      process.cwd(),
      "downloads",
      storyId,
      "testcases"
    );

    const files = fs
      .readdirSync(testCaseFolder)
      .filter((f) => f.endsWith(".json"))
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(testCaseFolder, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      throw new Error("No test case files found");
    }

    const latestFile = files[0].name;
    const filePath = path.join(testCaseFolder, latestFile);

    console.log(`📂 Using file: ${latestFile}`);

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const testCases = jsonData.testCases;

    // 🔐 Auth
    const auth = Buffer.from(
      `${ENV.JIRA_EMAIL.trim()}:${ENV.JIRA_API_TOKEN.trim()}`
    ).toString("base64");

    const headers = {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    for (const tc of testCases) {
      const description = formatDescription(tc);

      // =============================
      // ✅ CREATE XRAY TEST ISSUE
      // =============================
      const payload = {
        fields: {
          project: { key: jiraConfig.projectKey }, // ✅ MER
          summary: tc.title,
          description: convertToADF(description),
          issuetype: { id: jiraConfig.issueTypeId } // ✅ 10070
        }
      };

      const createUrl = `${ENV.JIRA_BASE_URL}/rest/api/3/issue`;

      const created = await axios.post(createUrl, payload, { headers });

      const testKey = created.data.key;

      console.log(`✅ Created Test: ${testKey}`);

      // =============================
      // 🔗 LINK TEST TO STORY
      // =============================
      const linkPayload = {
        type: { name: jiraConfig.linkType }, // "Relates"
        inwardIssue: { key: testKey },
        outwardIssue: { key: storyId }
      };

      await axios.post(
        `${ENV.JIRA_BASE_URL}/rest/api/3/issueLink`,
        linkPayload,
        { headers }
      );

      console.log(`🔗 Linked ${testKey} → ${storyId}`);
    }

    console.log("🎉 All test cases pushed to Jira (Xray)");

  } catch (error: any) {
    console.error(
      "❌ Jira Write Error:",
      error.response?.data || error.message
    );
  }
}
function convertToADF(text: string) {
  return {
    type: "doc",
    version: 1,
    content: text.split("\n").map((line) => ({
      type: "paragraph",
      content: line
        ? [{ type: "text", text: line }]
        : []
    }))
  };
}

// 🔥 Format steps into readable text
function formatDescription(tc: any): string {
  const steps = tc.steps
    .map(
      (step: any, index: number) =>
        `Step ${index + 1}: ${step.action}\nTest Data: ${JSON.stringify(
          step.testData || {}
        )}`
    )
    .join("\n\n");

  return `
Test Type: ${tc.type}
Priority: ${tc.priority}

Steps:
${steps}

Expected Result:
${tc.expectedResult}
`;
}