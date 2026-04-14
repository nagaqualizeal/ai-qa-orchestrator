import fs from "fs";
import path from "path";
import open from "open";

export async function runReportingAgent(
  data: any,
  type: "analysis" | "testcases"
): Promise<{ jsonPath?: string; htmlPath?: string; status: string; error?: string }> {
  try {
    const basePath = path.join(process.cwd(), "downloads", data.storyId);
    const typePath = path.join(basePath, type);
    const oldPath = path.join(basePath, "OLD");

    // Ensure folders exist
    [basePath, typePath, oldPath].forEach((p) => {
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });

    // Move old files
    const files = fs.readdirSync(typePath);
    files.forEach((file) => {
      const oldFile = path.join(typePath, file);
      const newFile = path.join(oldPath, file);

      if (fs.lstatSync(oldFile).isFile()) {
        fs.renameSync(oldFile, newFile);
      }
    });

    // Timestamp
    const now = new Date();
    const timestamp = now
      .toISOString()
      .slice(0, 16)
      .replace("T", "_")
      .replace(":", "-");

    const baseFileName = `${data.storyId}_${type}_${timestamp}`;

    // JSON
    const jsonPath = path.join(typePath, `${baseFileName}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    // HTML
    const htmlPath = path.join(typePath, `${baseFileName}.html`);
    fs.writeFileSync(htmlPath, generateHTML(data, type));

    console.log(`📁 ${type.toUpperCase()} JSON: ${jsonPath}`);
    console.log(`📁 ${type.toUpperCase()} HTML: ${htmlPath}`);

    await open(htmlPath);

    return {
      jsonPath,
      htmlPath,
      status: "success"
    };

  } catch (error: any) {
    console.error("❌ Reporting Error:", error.message);

    // ✅ ALWAYS return something
    return {
      status: "failed",
      error: error.message
    };
  }
}

// 🔥 HTML Generator
function generateHTML(data: any, type: string): string {
  if (type === "analysis") {
    return `
    <html>
    <body>
      <h2>Jira Analysis - ${data.storyId}</h2>

      <h3>Flows</h3>
      <pre>${JSON.stringify(data.derivedFlows, null, 2)}</pre>

      <h3>Edge Cases</h3>
      <pre>${JSON.stringify(data.edgeCases, null, 2)}</pre>

      <h3>Risks</h3>
      <pre>${JSON.stringify(data.risks, null, 2)}</pre>

      <h3>Missing Info</h3>
      <pre>${JSON.stringify(data.missingInformation, null, 2)}</pre>
    </body>
    </html>
    `;
  }

  const rows = data.testCases
    .map(
      (tc: any) => `
      <tr>
        <td>${tc.testCaseId}</td>
        <td>${tc.type}</td>
        <td>${tc.title}</td>
        <td>
          ${tc.steps
            .map(
              (s: any) =>
                `<div><b>${s.action}</b><br/><small>${JSON.stringify(
                  s.testData || {}
                )}</small></div>`
            )
            .join("")}
        </td>
        <td>${tc.expectedResult}</td>
        <td>${tc.priority}</td>
      </tr>
    `
    )
    .join("");

  return `
  <html>
  <body>
    <h2>Test Cases - ${data.storyId}</h2>
    <table border="1">
      <tr>
        <th>ID</th><th>Type</th><th>Title</th><th>Steps</th><th>Expected</th><th>Priority</th>
      </tr>
      ${rows}
    </table>
  </body>
  </html>
  `;
}