export function buildTestDesignPrompt(data: any, config: any) {
  return `
You are a Senior QA Engineer.

Based on the following analysis, generate optimized and high-quality test cases.

========================
📌 INPUT ANALYSIS
========================
Flows:
${JSON.stringify(data.derivedFlows, null, 2)}

Edge Cases:
${JSON.stringify(data.edgeCases, null, 2)}

Risks:
${JSON.stringify(data.risks, null, 2)}

Missing Information:
${JSON.stringify(data.missingInformation, null, 2)}

========================
📌 REQUIREMENTS
========================
- Generate MAX ${config.total} test cases
- Include only these types: ${config.types.join(", ")}

- MUST include at least:
  - 1 positive test case
  - 1 negative test case

- Include edge/boundary scenarios if applicable

- Let AI intelligently decide distribution of remaining test cases
- Avoid duplicate or redundant test cases
- Keep test cases concise, clear, and high value
- Prioritize critical and high-risk scenarios

========================
📌 TEST STEP STRUCTURE (VERY IMPORTANT)
========================
- Each test case MUST contain structured steps
- Each step MUST include:
  - "action": description of the step
  - "testData": object (can be empty {} if not required)

- DO NOT write steps as plain strings
- DO NOT skip testData field

========================
📌 TEST DATA RULES
========================
- DO NOT hardcode real credentials or URLs
- Use logical placeholders like:
  - validUser
  - invalidUser
  - emptyValue
  - specialCharacters
  - boundaryValue

Example:
{
  "action": "Enter username",
  "testData": { "username": "validUser" }
}

========================
📌 OUTPUT RULES
========================
- Return ONLY valid JSON
- No explanations, no extra text
- Ensure JSON is properly formatted
- confidenceScore must be between 0 and 1

========================
📌 OUTPUT FORMAT
========================

{
  "testCases": [
    {
      "testCaseId": "",
      "type": "positive | negative | edge | boundary",
      "title": "",
      "steps": [
        {
          "action": "",
          "testData": {}
        }
      ],
      "expectedResult": "",
      "priority": "High | Medium | Low"
    }
  ],
  "coverage": {
    "positiveCovered": true,
    "negativeCovered": true,
    "edgeCovered": true,
    "boundaryCovered": true
  },
  "confidenceScore": 0.0
}
`;
}