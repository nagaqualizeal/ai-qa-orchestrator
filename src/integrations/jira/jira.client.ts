import axios from "axios";
import { ENV } from "../../config/env";

export async function fetchJiraStory(issueKey: string) {
  const url = `${ENV.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`;

  const auth = Buffer.from(
    `${ENV.JIRA_EMAIL}:${ENV.JIRA_API_TOKEN}`
  ).toString("base64");

  console.log("🔗 Jira URL:", url);
  console.log("👤 Email:", ENV.JIRA_EMAIL);
  console.log("🔑 Token Present:", ENV.JIRA_API_TOKEN ? "YES" : "NO");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json"
      }
    });

    return response.data;

  } catch (error: any) {
    console.error("❌ Jira API Error:", error.response?.status);
    console.error("❌ Jira API Message:", error.response?.data);

    throw error;
  }
}