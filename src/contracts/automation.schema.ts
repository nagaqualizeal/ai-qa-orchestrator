export interface AutomationContractSchema {
  scriptName: string;
  framework: string;
  language: string;
  testCases: string[];
  code: string;
  pageObjects?: Record<string, string>;
  testData?: Record<string, unknown>;
  setup: string;
  teardown: string;
  dependencies: string[];
}
