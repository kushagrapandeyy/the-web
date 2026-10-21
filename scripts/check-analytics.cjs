// Run with node scripts/check-analytics.cjs. Redis is mocked; no analytics writes occur.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const env = { UPSTASH_REDIS_REST_URL: "https://example.invalid", UPSTASH_REDIS_REST_TOKEN: "test-only" };
let calls = [], options, duplicate = false, fail = false, hang = false;
const Redis = { fromEnv(config) {
  options = config;
  return {
    async set(...args) { calls.push(["set", ...args]); if (fail) throw Error("Unavailable"); return duplicate ? null : "OK"; },
    async incr(...args) { calls.push(["incr", ...args]); if (fail) throw Error("Unavailable"); return 1; },
    async mget(...args) {
      calls.push(["mget", ...args]);
      if (fail) throw Error("Unavailable");
      if (hang) return new Promise((_, reject) => {
        const signal = config.signal();
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      });
      return args.map(() => 2);
    },
  };
} };
function load(file, mocks = {}, environment = env) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, {
    exports: module.exports, module, process: { env: environment }, AbortController, AbortSignal, TextEncoder,
    crypto: require("node:crypto").webcrypto, ...mocks.globals,
    require: name => name === "@upstash/redis" ? { Redis } : mocks[name] ?? require(name),
  }, { filename: file });
  return module.exports;
}
const request = (body, headers = {}) => new Request("https://example.test/api/incr", {
  method: "POST", headers: { "Content-Type": "application/json", ...headers }, body,
});

(async () => {
  const api = load("pages/api/incr.ts").default;
  const published = fs.readdirSync(path.join(root, "content/projects"))
    .filter(file => file.endsWith(".mdx") && /^published: true\s*$/m.test(fs.readFileSync(path.join(root, "content/projects", file), "utf8")))
    .map(file => file.slice(0, -4));
  const source = fs.readFileSync(path.join(root, "pages/api/incr.ts"), "utf8");
  const listed = vm.runInNewContext(source.match(/const publishedSlugs = new Set\((\[[\s\S]*?\])\)/)[1]);
  assert.equal(JSON.stringify([...listed].sort()), JSON.stringify(published.sort()), "API allowlist must match published projects");
  for (const body of ["{", "null", "42", '"text"', "true", "[]", "{}", '{"slug":null}', '{"slug":3}', '{"slug":{}}', '{"slug":[]}']) {
    assert.equal((await api(request(body))).status, 400, body);
  }
  assert.equal((await api(request('{"slug":"missing"}'))).status, 404);
  assert.equal((await api(request('{"slug":"railwayTicketing"}'))).status, 404);
  assert.equal((await api(request('{"slug":"Capstone"}', { "Content-Type": "text/plain" }))).status, 400);
  const get = await api(new Request("https://example.test/api/incr"));
  assert.equal(get.status, 405); assert.equal(get.headers.get("Allow"), "POST");
  assert.equal(calls.length, 0, "Invalid requests must not reach Redis");
  for (const slug of published) assert.equal((await api(request(JSON.stringify({ slug })))).status, 202);
  calls = [];
  assert.equal((await api(request('{"slug":"Capstone"}', { "Content-Type": "application/json; charset=utf-8", "x-forwarded-for": "192.0.2.1, 10.0.0.1" }))).status, 202);
  assert.match(calls[0][1], /^deduplicate:[a-f0-9]{64}:Capstone$/);
  assert.equal(calls[0][3].nx, true); assert.equal(calls[0][3].ex, 86400);
  assert.equal(calls[1][1], "pageviews:projects:Capstone");
  assert.equal(options.retry.retries, 0); assert.ok(options.signal() instanceof AbortSignal);
  calls = []; duplicate = true;
  assert.equal((await api(request('{"slug":"Capstone"}', { "x-forwarded-for": "192.0.2.1" }))).status, 202);
  assert.equal(calls.length, 1, "Duplicate views must not increment");
  duplicate = false; fail = true;
  assert.equal((await api(request('{"slug":"Capstone"}'))).status, 503);
  calls = []; fail = false;
  assert.equal((await load("pages/api/incr.ts", {}, {}).default(request('{"slug":"Capstone"}'))).status, 204);
  assert.equal(calls.length, 0, "Missing credentials must skip Redis");

  const mocks = {
    "contentlayer/generated": { allProjects: [{ slug: "Capstone", published: true }, { slug: "draft", published: false }] },
    "./projects-content": { ProjectsContent: () => null },
  };
  const gallery = load("app/projects/project-list.tsx", mocks).ProjectList;
  assert.equal((await gallery({ category: "engineering" })).props.views.Capstone, 2);
  fail = true;
  const unavailable = await gallery({ category: "engineering" });
  assert.equal(unavailable.props.projects.length, 1); assert.equal(Object.keys(unavailable.props.views).length, 0);
  fail = false; hang = true;
  const watchdog = setTimeout(() => { throw Error("Gallery did not recover from stalled analytics"); }, 2500);
  try { assert.equal(Object.keys((await gallery({ category: "engineering" })).props.views).length, 0); }
  finally { clearTimeout(watchdog); }
  hang = false; calls = [];
  await load("app/projects/project-list.tsx", mocks, {}).ProjectList({ category: "engineering" });
  assert.equal(calls.length, 0);

  let cleanup, fetchOptions;
  load("app/projects/[slug]/view.tsx", {
    react: { useEffect: effect => { cleanup = effect(); } },
    globals: { fetch: (_url, options) => { fetchOptions = options; return Promise.reject(Error("Offline")); } },
  }).ReportView({ slug: "Capstone" });
  await Promise.resolve(); cleanup(); assert.equal(fetchOptions.signal.aborted, true);
  console.log("Analytics checks passed: validation, allowlist, deduplication, missing credentials, failure/timeout fallback, and client cleanup.");
})().catch(error => { console.error(error); process.exitCode = 1; });
