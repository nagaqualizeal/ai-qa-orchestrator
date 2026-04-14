export interface TestDesignContractSchema {
  featureName: string;
  testCases: Array<{
    id: string;
    title: string;
    description: string;
    preconditions: string[];
    steps: string[];
    expectedResults: string[];
    testType: 'functional' | 'regression' | 'smoke' | 'integration';
    priority: 'p0' | 'p1' | 'p2' | 'p3';
  }>;
  estimatedCoverage: number;
  riskAreas: string[];
}
