import axios from "axios";

export async function runJenkinsAgent(
  storyId: string,
  branchName: string
) {
  try {
    const baseUrl = process.env.JENKINS_URL!;
    const jobName = process.env.JENKINS_JOB!;

    console.log(`🚀 Triggering Jenkins for ${storyId}...`);

    // =========================
    // STEP 1: Trigger Build
    // =========================
    const triggerRes = await axios.post(
      `${baseUrl}/job/${jobName}/buildWithParameters?BRANCH_NAME=${branchName}`,
      {},
      {
        auth: {
          username: process.env.JENKINS_USER!,
          password: process.env.JENKINS_TOKEN!
        },
        maxRedirects: 0,
        validateStatus: (status) => status === 201
      }
    );

    const queueUrl = triggerRes.headers["location"];

    console.log("📌 Queue URL:", queueUrl);

    // =========================
    // STEP 2: WAIT → GET BUILD NUMBER
    // =========================
    let buildNumber: number | null = null;

    while (!buildNumber) {
      console.log("⏳ Waiting for build to start...");

      const queueRes = await axios.get(`${queueUrl}api/json`, {
        auth: {
          username: process.env.JENKINS_USER!,
          password: process.env.JENKINS_TOKEN!
        }
      });

      buildNumber = queueRes.data.executable?.number || null;

      if (!buildNumber) {
        await delay(3000);
      }
    }

    console.log(`🏗 Build started: #${buildNumber}`);

    // =========================
    // STEP 3: WAIT → BUILD COMPLETE
    // =========================
    let building = true;
    let result: string | null = null;

    while (building) {
      console.log("⏳ Checking build status...");

      const buildRes = await axios.get(
        `${baseUrl}/job/${jobName}/${buildNumber}/api/json`,
        {
          auth: {
            username: process.env.JENKINS_USER!,
            password: process.env.JENKINS_TOKEN!
          }
        }
      );

      building = buildRes.data.building;
      result = buildRes.data.result;

      if (building) {
        console.log("⏳ Waiting 30 seconds before next status check...");
  await delay(30000); // 30 seconds
      }
    }

    console.log(`🎯 Build Result: ${result}`);

    // =========================
    // STEP 4: REPORT URL
    // =========================
    const reportUrl = `${baseUrl}/job/${jobName}/${buildNumber}/HTML_20Report/`;

    console.log("📊 Report URL:", reportUrl);

    // =========================
    // RETURN FINAL RESULT
    // =========================
    return {
      buildNumber,
      result,
      reportUrl
    };

  } catch (error: any) {
    console.error(
      "❌ Jenkins Agent Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// =========================
// Helper
// =========================
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}