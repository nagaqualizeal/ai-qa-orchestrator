import fs from "fs";

const APPROVAL_FILE = "downloads/approval.json";

export async function waitForApproval() {
  console.log("⏳ Waiting for approval...");

  while (true) {
    try {
      const data = JSON.parse(fs.readFileSync(APPROVAL_FILE, "utf-8"));

      if (data.status === "approved") {
        console.log("✅ Approved! Proceeding...");
        break;
      }

      if (data.status === "rejected") {
        throw new Error("❌ Test cases rejected. Stopping execution.");
      }

    } catch (err) {
      console.log("⚠️ Waiting for approval file...");
    }

    await new Promise(res => setTimeout(res, 5000));
  }
}