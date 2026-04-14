import fs from "fs";
import { createXrayTest } from "./xrayClient";

export async function pushAllTests(storyKey: string) {
  const filePath = "downloads/updated-testcases.json";

  if (!fs.existsSync(filePath)) {
    throw new Error("❌ updated-testcases.json not found");
  }

  const tests = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  console.log(`🚀 Pushing ${tests.length} test cases to Jira...\n`);

  for (const test of tests) {
    try {
      console.log(`➡️ Creating: ${test.title}`);
      const key = await createXrayTest(test, storyKey);
      console.log(`✅ Created: ${key}\n`);
    } catch (err: any) {
      console.error(`❌ Failed: ${test.title}`);
      console.error(err.response?.data || err.message);
    }
  }

  console.log("🎉 All test cases processed");
}