const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const { isSensitivePath, isBlankTemplate } = require("./check-secret-files.cjs");

for (const file of [".env", "new.env", ".env.production", "app/.env.local", "private.pem", "keys/deploy.key", ".aws/credentials", "config/service-account-prod.json", "secrets.yaml", "terraform.tfstate", "keys/id_ed25519"]) assert.equal(isSensitivePath(file), true, file);
for (const file of [".env.example", "next-env.d.ts", "app/profile.ts", "package-lock.json"]) assert.equal(isSensitivePath(file), false, file);
assert.equal(isBlankTemplate("# Local config\nUPSTASH_REDIS_REST_TOKEN=\nEMPTY=\"\"\n"), true);
assert.equal(isBlankTemplate("UPSTASH_REDIS_REST_TOKEN=x"), false);
assert.equal(isBlankTemplate("export SECRET=value"), false);

// Synthetic values are generated at runtime so no credential-shaped fixture is committed.
const token = createHash("sha256").update("synthetic scanner test fixture").digest("hex").slice(0, 36);
for (const sample of [`UPSTASH_REDIS_REST_TOKEN=${token}`, `const apiKey = "ghp_${token}";`]) {
  const result = spawnSync("gitleaks", ["stdin", "--redact", "--no-banner", "--ignore-gitleaks-allow", "--config", ".gitleaks.toml"], { input: sample, encoding: "utf8" });
  assert.equal(result.status, 1, "Scanner must reject synthetic credentials (and be installed)");
  assert.ok(!(result.stdout + result.stderr).includes(token), "Scanner output must redact credentials");
}
const clean = spawnSync("gitleaks", ["stdin", "--redact", "--no-banner", "--config", ".gitleaks.toml"], { input: "UPSTASH_REDIS_REST_TOKEN=\nconst token = process.env.UPSTASH_REDIS_REST_TOKEN;", encoding: "utf8" });
assert.equal(clean.status, 0, "Blank templates and environment references must pass");
console.log("Security checks passed: sensitive files, blank templates, credential detection, and redaction.");
