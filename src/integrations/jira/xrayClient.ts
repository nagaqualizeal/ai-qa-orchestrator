import axios from "axios";

const BASE_URL = process.env.JIRA_BASE_URL!;
const EMAIL = process.env.JIRA_EMAIL!;
const API_TOKEN = process.env.JIRA_API_TOKEN!;

const auth = Buffer.from(`${EMAIL}:${API_TOKEN}`).toString("base64");

function getHeaders() {
  return {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json"
  };
}

export async function createXrayTest(test: any, storyKey: string) {
  const payload = {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY },
      summary: test.title,
      description: formatDescription(test),
      issuetype: { name: "Test" },
      priority: { name: test.priority || "Medium" }
    }
  };

  const response = await axios.post(
    `${BASE_URL}/rest/api/3/issue`,
    payload,
    { headers: getHeaders() }
  );

  const testKey = response.data.key;

  await linkToStory(testKey, storyKey);

  return testKey;
}

async function linkToStory(testKey: string, storyKey: string) {
  await axios.post(
    `${BASE_URL}/rest/api/3/issueLink`,
    {
      type: { name: "Tests" },
      inwardIssue: { key: testKey },
      outwardIssue: { key: storyKey }
    },
    { headers: getHeaders() }
  );
}

function formatDescription(test: any): string {
  const steps = test.steps
    .map((step: string, i: number) => `${i + 1}. ${step}`)
    .join("\n");

  return `
Steps:
${steps}

Expected Result:
${test.expectedResult}

Test Data:
${JSON.stringify(test.testData || {}, null, 2)}
`;
}