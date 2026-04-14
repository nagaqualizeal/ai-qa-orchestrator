export interface AutomationRequest {
  testCaseIds: string[];
  framework: 'SELENIUM' | 'CYPRESS' | 'PLAYWRIGHT' | 'TESTNG' | 'JEST';
  language: 'JAVASCRIPT' | 'PYTHON' | 'JAVA' | 'CSHARP';
  additionalFrameworks?: string[];
  includePageObjects?: boolean;
  includePOM?: boolean;
}

export interface AutomationScript {
  testCaseId: string;
  scriptCode: string;
  pageObjects?: Record<string, string>;
  testData?: Record<string, unknown>;
  setup?: string;
  teardown?: string;
}

export interface AutomationResponse {
  success: boolean;
  scripts?: AutomationScript[];
  error?: string;
}
