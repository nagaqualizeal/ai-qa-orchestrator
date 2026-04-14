import { runJiraAnalysis } from "../agents/jiraAnalysis/jiraAnalysis.agent";
import { runTestDesign } from "../agents/testDesign/testDesign.agent";
import { runReportingAgent } from "../agents/reporting/reporting.agent";

import { validateConfidence } from "../utils/confidence";
import { retry } from "../utils/retry";
import { logger } from "../utils/logger";

export class Orchestrator {
  async execute(storyId: string) {
    logger.info(`🚀 Starting Test Case Generation for ${storyId}`);

    try {
      // ================================
      // STEP 1: Jira Analysis
      // ================================
      const jiraData = await retry(() => runJiraAnalysis(storyId), 2);

      validateConfidence(jiraData.confidenceScore, "Jira Analysis");

      await runReportingAgent(jiraData, "analysis");

      // ================================
      // STEP 2: Test Design
      // ================================
      const testCases = await retry(() => runTestDesign(jiraData), 2);

      if (testCases.confidenceScore < 0.6) {
        logger.info(
          `⚠️ Low confidence: ${testCases.confidenceScore}. Please review.`
        );
      }

      await runReportingAgent(
        {
          storyId,
          testCases: testCases.testCases,
          coverage: testCases.coverage,
          generatedAt: new Date().toISOString()
        },
        "testcases"
      );

      logger.info("✅ Test cases generated");

      return {
        success: true,
        storyId
      };

    } catch (error: any) {
      logger.error(`❌ Failed: ${error.message}`);

      return {
        success: false,
        error: error.message
      };
    }
  }
}