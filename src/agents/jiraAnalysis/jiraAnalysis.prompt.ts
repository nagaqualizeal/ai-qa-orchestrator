export function buildJiraAnalysisPrompt(jiraData: any) {
  return `
You are a Senior QA Engineer.

Analyze the following Jira user story and generate structured QA insights.

Jira Data:
Title: ${jiraData.title}
Description: ${jiraData.description}

Instructions:
1. Identify key functional flows
2. Generate edge cases
3. Identify risks
4. Highlight missing requirements
5. Keep response concise and relevant

IMPORTANT RULES:
- Return ONLY valid JSON (no extra text)
- confidenceScore must be a number between 0 and 1 (e.g., 0.75)
- Do NOT exceed 1.0
- Do NOT include explanations outside JSON

Return JSON in this format:

{
  "derivedFlows": [
    {
      "flowName": "",
      "steps": []
    }
  ],
  "edgeCases": [],
  "risks": [],
  "missingInformation": [],
  "confidenceScore": 0.0
}
`;
}