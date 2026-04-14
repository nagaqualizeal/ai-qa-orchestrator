export interface JiraAnalysisRequest {
  issueKeys: string[];
  includeHistory?: boolean;
  filterBySeverity?: string[];
}

export interface JiraAnalysisResponse {
  success: boolean;
  analysis?: {
    summary: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reproducibility: 'LOW' | 'MODERATE' | 'HIGH' | 'IMMEDIATE';
    recommendedTestCases: string[];
  };
  error?: string;
}
