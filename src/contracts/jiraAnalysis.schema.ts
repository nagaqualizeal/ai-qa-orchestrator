/**
 * Zod schema for Jira Analysis contract
 */
export interface JiraAnalysisSchema {
  issueKeys: string[];
  summary: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reproducibility: 'LOW' | 'MODERATE' | 'HIGH' | 'IMMEDIATE';
  recommendedTestCases: string[];
}

/**
 * Zod schema for Test Design contract
 */
export interface TestDesignSchema {
  feature: string;
  testCases: Array<{
    id: string;
    name: string;
    type: 'POSITIVE' | 'NEGATIVE' | 'EDGE' | 'BOUNDARY';
    steps: string[];
    expectedResult: string;
  }>;
  coverage: number;
}

/**
 * Zod schema for Automation contract
 */
export interface AutomationSchema {
  testCaseIds: string[];
  framework: 'SELENIUM' | 'CYPRESS' | 'PLAYWRIGHT' | 'TESTNG' | 'JEST';
  language: 'JAVASCRIPT' | 'PYTHON' | 'JAVA' | 'CSHARP';
  scripts: Array<{
    testCaseId: string;
    code: string;
  }>;
}

/**
 * Zod schema for Defect contract
 */
export interface DefectSchema {
  testExecutionId: string;
  defects: Array<{
    id: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  }>;
  totalDefects: number;
  recommendation: string;
}
