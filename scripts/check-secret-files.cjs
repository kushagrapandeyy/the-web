const { execFileSync } = require("node:child_process");
const path = require("node:path");

function isSensitivePath(file) {
  const name = path.posix.basename(file).toLowerCase();
  if (file === ".env.example") return false;
  return /(^|\/)(\.aws|\.ssh|\.kube)(\/|$)/i.test(file)
    || /^\.env(?:$|\.)|\.env$|^\.env.*\.local$/.test(name)
    || /\.(pem|key|p12|pfx|keystore|jks)$|\.tfstate(?:\.|$)/.test(name)
    || /^id_(rsa|ed25519)/.test(name)
    || /^(credentials|secrets).*\.(json|ya?ml|toml)$/.test(name)
    || /service[-_]account.*\.json$/.test(name);
}

function isBlankTemplate(content) {
  return content.split(/\r?\n/).every(line => /^\s*(?:#.*|[A-Z][A-Z0-9_]*\s*=\s*(?:""|'')?)?\s*$/.test(line));
}

if (require.main === module) {
  const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
  const files = git("ls-files", "-z").split("\0").filter(Boolean);
  const blocked = files.filter(isSensitivePath);
  if (files.includes(".env.example") && !isBlankTemplate(git("show", ":.env.example"))) blocked.push(".env.example (values must be blank)");
  if (blocked.length) {
    console.error(`Commit blocked: sensitive files are tracked:\n${blocked.join("\n")}\nKeep credentials in local environment files or your hosting secret store.`);
    process.exit(1);
  }
  console.log("Sensitive-file check passed.");
}

module.exports = { isSensitivePath, isBlankTemplate };
