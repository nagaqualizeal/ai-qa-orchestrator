import dotenv from "dotenv";

dotenv.config();

// 🔥 Debug logs (keep for now)
console.log("ENV CHECK:", process.env.JIRA_EMAIL);
console.log(
  "CLAUDE KEY:",
  process.env.CLAUDE_API_KEY ? "Loaded" : "Missing"
);

export const ENV = {
  JIRA_BASE_URL: process.env.JIRA_BASE_URL!,
  JIRA_EMAIL: process.env.JIRA_EMAIL!,
  JIRA_API_TOKEN: process.env.JIRA_API_TOKEN!,
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY!
};