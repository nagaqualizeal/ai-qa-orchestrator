export interface TestDesignRequest {
  feature: string;
  requirements?: string[];
  riskAreas?: string[];
  includePerformance?: boolean;
  includeSecurityTests?: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: string[];
  expectedResult: string;
  type: 'POSITIVE' | 'NEGATIVE' | 'EDGE' | 'BOUNDARY';
}

export interface TestDesignResponse {
  success: boolean;
  testCases?: TestCase[];
  coverage?: number;
  error?: string;
}
