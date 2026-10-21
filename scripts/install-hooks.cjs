const fs = require("node:fs");
const { spawnSync, execFileSync } = require("node:child_process");

// Hosting builds may receive a source archive rather than a Git checkout.
if (!process.env.CI && fs.existsSync(".git")) {
  const previous = spawnSync("git", ["config", "--get", "core.hooksPath"], { encoding: "utf8" });
  if (previous.status !== 0 && previous.status !== 1) throw new Error("Cannot read the repository hook configuration");
  if (previous.stdout.trim() && previous.stdout.trim() !== ".githooks") throw new Error("Existing Git hooks detected. Integrate .githooks before replacing them.");
  execFileSync("git", ["config", "--local", "core.hooksPath", ".githooks"], { stdio: "inherit" });
  console.log("Repository secret-protection hooks enabled.");
}
