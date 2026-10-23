// Run with node scripts/check-content.cjs. Checks local content without network requests.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const exists = file => fs.existsSync(path.join(root, file));
const walk = dir => fs.readdirSync(path.join(root, dir), { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]);
const anchors = ["evidence", "problem-and-intended-users", "role-and-ownership", "what-i-implemented", "architecture-and-decisions", "current-status", "limitations-and-next-steps"];
const projects = new Map();

for (const file of walk("content/projects").filter(file => file.endsWith(".mdx"))) {
  const text = read(file);
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(frontmatter, `${file}: missing frontmatter`);
  const fields = Object.fromEntries([...frontmatter[1].matchAll(/^(\w+):\s*(.+)$/gm)]
    .map(([, key, value]) => [key, value.trim().replace(/^(["'])(.*)\1$/, "$2")]));
  for (const field of ["title", "description", "role", "status"]) assert.ok(fields[field]?.trim(), `${file}: missing ${field}`);
  assert.match(fields.published || "", /^(true|false)$/, `${file}: published must be explicit`);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(fields.date) && Number.isFinite(Date.parse(fields.date)), `${file}: invalid date`);
  assert.ok(Array.isArray(JSON.parse(fields.tags)) && JSON.parse(fields.tags).every(tag => typeof tag === "string" && tag.trim()), `${file}: invalid tags`);
  for (const anchor of anchors) assert.equal([...text.matchAll(new RegExp(`id=["']${anchor}["']`, "g"))].length, 1, `${file}: missing or duplicate ${anchor} anchor`);
  const slug = file.slice("content/projects/".length, -4);
  projects.set(slug, { file, text, fields });
}
assert.ok(projects.size, "No project content found");

function checkLink(target, file) {
  assert.ok(target && !/\s/.test(target), `${file}: invalid link ${target}`);
  if (target.startsWith("#")) return;
  if (/^(https?:|mailto:|tel:)/.test(target)) { new URL(target); return; }
  assert.ok(target.startsWith("/") && !target.startsWith("//"), `${file}: unsupported link ${target}`);
  const pathname = decodeURIComponent(target.split(/[?#]/)[0]);
  if (pathname.startsWith("/projects/")) {
    assert.equal(projects.get(pathname.slice(10).replace(/\/$/, ""))?.fields.published, "true", `${file}: missing or unpublished project ${target}`);
  } else {
    assert.ok(exists(`public${pathname}`) || exists(`app${pathname.replace(/\/$/, "")}/page.tsx`), `${file}: missing local target ${target}`);
  }
}

for (const { file, text, fields } of projects.values()) {
  if (fields.url) checkLink(fields.url, file);
  if (fields.image) {
    assert.ok(fields.image.startsWith("/") && exists(`public${fields.image}`), `${file}: missing preview image ${fields.image}`);
  }
  const links = [...text.matchAll(/!?\[[^\]]*\]\(([^\s)]+)\)/g)].map(match => match[1]);
  for (const target of links) checkLink(target, file);
  for (const [, attrs] of text.matchAll(/<iframe\b([^>]+)>/g)) {
    const src = attrs.match(/\bsrc=["']([^"']+)["']/)?.[1];
    assert.ok(src && /\btitle=["'][^"']+["']/.test(attrs), `${file}: iframe needs a source and title`);
    checkLink(src, file);
    const embedded = new URL(src);
    if (embedded.hostname === "embed.figma.com") {
      assert.ok(links.some(link => {
        const fallback = new URL(link, "https://portfolio.invalid");
        return ["figma.com", "www.figma.com"].includes(fallback.hostname) && fallback.pathname === embedded.pathname;
      }), `${file}: Figma embed needs a direct link to the same prototype`);
    }
  }
}

for (const file of walk("app").filter(file => /\.[jt]sx?$/.test(file))) {
  const text = read(file);
  for (const [, target] of text.matchAll(/["'`](\/[^"'`\s{}]*\.(?:png|jpe?g|webp|gif|svg|avif|ico)|\/projects\/[\w/-]+)["'`]/g)) checkLink(target, file);
  for (const [, slug] of text.matchAll(/\bslug:\s*["']([^"']+)["']/g)) checkLink(`/projects/${slug}`, file);
  for (const [, target] of text.matchAll(/\bhref=["']([^"']+)["']/g)) checkLink(target, file);
}

const profile = read("app/profile.ts");
const groups = [...profile.matchAll(/label:\s*"([^"]+)"[\s\S]*?skills:\s*(\[[^\]]*\])/g)];
assert.ok(groups.length, "Shared technical skills are missing");
for (const [, label, values] of groups) {
  const skills = JSON.parse(values);
  assert.ok(skills.length && skills.every(skill => typeof skill === "string" && skill.trim()), `${label}: empty skill group`);
  assert.equal(new Set(skills).size, skills.length, `${label}: duplicate skills`);
}
for (const file of ["app/components/technical-stack.tsx", "app/resume/page.tsx"]) {
  const text = read(file);
  assert.match(text, /import\s*\{[^}]*\btechnicalSkills\b[^}]*\}\s*from\s*["'][^"']*\/profile["']/, `${file}: use the shared skill source`);
  assert.match(text, /technicalSkills\.map\(/, `${file}: shared skills are not rendered`);
}
function luminance(hex) {
  return [0.2126, 0.7152, 0.0722].reduce((sum, weight, index) => {
    const value = parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;
    return sum + weight * (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  }, 0);
}
function contrast(first, second) {
  const [dark, light] = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (light + 0.05) / (dark + 0.05);
}
const themeCss = read("global.css");
for (const selector of [":root", ':root[data-theme="light"]']) {
  const block = themeCss.slice(themeCss.indexOf(selector)).split("}")[0];
  const colors = Object.fromEntries([...block.matchAll(/--palette-([\w-]+):\s*(\d+) (\d+) (\d+)/g)].map(([, name, ...rgb]) => [name, "#" + rgb.map(value => Number(value).toString(16).padStart(2, "0")).join("")]));
  assert.equal(Object.keys(colors).length, 11, "Both themes must define all palette roles");
  for (const background of [colors.canvas, colors.surface, colors.raised]) {
    for (const text of [colors.paper, colors.secondary]) assert.ok(contrast(text, background) >= 7, `${selector}: primary and body text must meet AAA contrast`);
    for (const text of [colors.muted, colors.accent]) assert.ok(contrast(text, background) >= 4.5, `${selector}: metadata and links must meet AA contrast`);
  }
  assert.ok(contrast(colors["cta-ink"], colors.accent) >= 4.5, `${selector}: CTA text must meet AA contrast`);
}

console.log(`Content checks passed: ${projects.size} case studies, ${[...projects.values()].filter(project => project.fields.published === "true").length} published routes, local links/images, section anchors, Figma fallbacks, and ${groups.length} shared skill groups.`);
