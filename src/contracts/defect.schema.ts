export interface DefectContractSchema {
  defectId: string;
  testCaseId: string;
  title: string;
  description: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'NEW' | 'ASSIGNED' | 'RESOLVED' | 'CLOSED';
  stepsToReproduce: string[];
  actualResult: string;
  expectedResult: string;
  environment: string;
  attachments: string[];
}
