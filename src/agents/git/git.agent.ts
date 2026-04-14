import { execSync } from "child_process";
import { frameworkConfig } from "../../config/framework.config";

export async function runGitAgent(storyId: string) {
  try {
    const branchName = `ai/${storyId}-test-automation`;
    const repoPath = frameworkConfig.basePath;
    const baseBranch = process.env.GITHUB_BASE_BRANCH || "main";

    console.log("📁 Switching to repo:", repoPath);

    // =========================
    // STEP 1: Checkout base branch
    // =========================
    console.log(`🔄 Checking out base branch: ${baseBranch}`);

    execSync(`git checkout ${baseBranch}`, {
      cwd: repoPath,
      stdio: "inherit"
    });

    execSync(`git pull`, {
      cwd: repoPath,
      stdio: "inherit"
    });

    // =========================
    // STEP 2: Stage changes FIRST (IMPORTANT)
    // =========================
    console.log("📦 Staging files...");
    execSync(`git add .`, {
      cwd: repoPath,
      stdio: "inherit"
    });

    // =========================
    // STEP 3: Stash to avoid overwrite issues
    // =========================
    console.log("📥 Stashing changes (if any)...");
    try {
      execSync(`git stash`, {
        cwd: repoPath,
        stdio: "inherit"
      });
    } catch {
      console.log("⚠️ Nothing to stash");
    }

    // =========================
    // STEP 4: Create or switch branch
    // =========================
    console.log("🌿 Creating/switching branch:", branchName);

    try {
      execSync(`git checkout -b ${branchName}`, {
        cwd: repoPath,
        stdio: "inherit"
      });
    } catch {
      console.log("🔁 Branch exists, switching...");
      execSync(`git checkout ${branchName}`, {
        cwd: repoPath,
        stdio: "inherit"
      });
    }

    // =========================
    // STEP 5: Apply stashed changes back
    // =========================
    console.log("📤 Applying stashed changes...");
    try {
      execSync(`git stash pop`, {
        cwd: repoPath,
        stdio: "inherit"
      });
    } catch {
      console.log("⚠️ No stash to apply");
    }

    // =========================
    // STEP 6: Commit
    // =========================
    console.log("📝 Committing...");

    try {
      execSync(
        `git commit -m "AI: Add automation tests for ${storyId}"`,
        {
          cwd: repoPath,
          stdio: "inherit"
        }
      );
    } catch {
      console.log("⚠️ No changes to commit");
    }

    // =========================
    // STEP 7: Push
    // =========================
    console.log("🚀 Pushing to remote...");
    execSync(`git push origin ${branchName}`, {
      cwd: repoPath,
      stdio: "inherit"
    });

    console.log(`✅ Code pushed to branch: ${branchName}`);

    return branchName;

  } catch (error: any) {
    console.error("❌ Git Agent Error:", error.message);
    throw error;
  }
}