import fs from "fs";
import path from "path";
import { frameworkConfig } from "../../config/framework.config";
import {
  buildPagePrompt,
  buildTestDataPrompt,
  buildSpecPrompt
} from "./automation.prompt";
import { callClaude } from "../../llm/claude.provider";

type TestCase = {
  title: string;
  steps: { action: string; testData?: any }[];
};

export async function runAutomationAgent(storyId: string) {
  try {
    console.log(`🤖 Generating Page + Test Data + Spec for ${storyId}`);

    // =========================
    // 📥 READ TEST CASE JSON
    // =========================
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
        time: fs.statSync(path.join(testCaseFolder, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (!files.length) throw new Error("No test case files found");

    const latestFile = files[0].name;
    const jsonPath = path.join(testCaseFolder, latestFile);

    console.log(`📂 Using: ${latestFile}`);

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const testCases: TestCase[] = jsonData.testCases || [];

    if (!testCases.length) {
      throw new Error("No test cases found");
    }

    // =========================
    // 📁 PATHS
    // =========================
    const basePath = frameworkConfig.basePath;

    const pagesPath = path.join(basePath, frameworkConfig.folders.pages);
    const testDataPath = path.join(basePath, frameworkConfig.folders.testData);
    const testsPath = path.join(basePath, frameworkConfig.folders.tests);

    if (!fs.existsSync(testDataPath)) {
      fs.mkdirSync(testDataPath, { recursive: true });
    }

    // =========================
    // 🧠 GENERATE PAGE
    // =========================
    console.log("🧠 Generating Page...");

    const pagePrompt = buildPagePrompt(testCases);
    const pageResponse = await callClaude(pagePrompt);

    const cleanedPage = pageResponse
      ?.replace(/```typescript/g, "")
      .replace(/```/g, "")
      .trim();

    fs.writeFileSync(
      path.join(pagesPath, "LoginPage.ts"),
      cleanedPage
    );

    console.log("📄 LoginPage.ts created");

    // =========================
    // 🧠 GENERATE TEST DATA
    // =========================
    console.log("🧠 Generating Test Data...");

    const dataPrompt = buildTestDataPrompt(testCases);
    const dataResponse = await callClaude(dataPrompt);

    let parsedData;

    try {
      const cleanedData = dataResponse
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsedData = JSON.parse(cleanedData);
    } catch (err) {
      console.error("❌ Test data parsing failed:");
      console.log(dataResponse);
      throw new Error("Invalid JSON");
    }

    fs.writeFileSync(
      path.join(testDataPath, `${storyId}.json`),
      JSON.stringify(parsedData, null, 2)
    );

    console.log(`📄 ${storyId}.json created`);

    // =========================
    // 🧠 GENERATE SPEC
    // =========================
    console.log("🧠 Generating Spec...");

    const specPrompt = buildSpecPrompt(storyId);
    const specResponse = await callClaude(specPrompt);

    const cleanedSpec = specResponse
      ?.replace(/```typescript/g, "")
      .replace(/```/g, "")
      .trim();

    fs.writeFileSync(
      path.join(testsPath, `${storyId}.spec.ts`),
      cleanedSpec
    );

    console.log(`📄 ${storyId}.spec.ts created`);

    console.log("✅ Automation generation completed");

  } catch (error: any) {
    console.error("❌ Automation Agent Error:", error.message);
  }
}