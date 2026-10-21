// Source-level lifecycle checks; browser QA verifies the resulting motion visually.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
function load(file, mocks, globals) {
  const module = { exports: {} };
  const code = ts.transpileModule(read(file), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: name => mocks[name] ?? require(name), ...globals }, { filename: file });
  return module.exports;
}

const bootstrap = read("app/layout.tsx").match(/id="intro-preference"[\s\S]*?__html: `([^`]+)`/)[1];
function boot({ pathname = "/", hash = "", scrollY = 0, reduced = false, seen = false, blockedStorage = false } = {}) {
  const document = { documentElement: { dataset: {} } };
  let timeout;
  vm.runInNewContext(bootstrap, {
    document, location: { pathname, hash }, scrollY,
    sessionStorage: { getItem() { if (blockedStorage) throw Error("Storage denied"); return seen ? "1" : null; } },
    matchMedia: () => ({ matches: reduced }), setTimeout: callback => { timeout = callback; },
  });
  return { document, timeout };
}
assert.equal(boot().document.documentElement.dataset.intro, "pending");
assert.equal(boot({ blockedStorage: true }).document.documentElement.dataset.intro, "pending");
for (const options of [{ pathname: "/resume" }, { hash: "#stack" }, { scrollY: 500 }, { reduced: true }, { seen: true }, { blockedStorage: true, hash: "#playground" }]) {
  assert.equal(boot(options).document.documentElement.dataset.intro, "done", JSON.stringify(options));
}
const timedOut = boot(); timedOut.timeout();
assert.equal(timedOut.document.documentElement.dataset.intro, "done");

const states = [], panels = [{ offsetHeight: 512 }, { offsetHeight: 512 }, { offsetHeight: 512 }];
const media = { matches: true, addEventListener() {}, removeEventListener() {} };
const pointer = { ...media };
let cleanup, resize, disconnected = false, rootSize = 16, stateIndex = 0;
const viewport = { innerHeight: 709, matchMedia: query => query.includes("pointer") ? pointer : media, addEventListener() {}, removeEventListener() {} };
load("app/components/selected-work.tsx", {
  react: { useRef: () => ({ current: { querySelectorAll: () => panels } }), useState: initial => { const index = stateIndex++; states[index] = initial; return [initial, value => { states[index] = value; }]; }, useEffect: effect => { cleanup = effect(); } },
  "framer-motion": { useScroll: () => ({ scrollYProgress: {} }), useSpring: value => value },
  "next/image": {}, "next/link": {}, "lucide-react": {}, "./text-reveal": {},
}, {
  window: viewport, document: { documentElement: {} }, getComputedStyle: () => ({ fontSize: String(rootSize) }),
  ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} disconnect() { disconnected = true; } },
}).SelectedWork();
assert.deepEqual(states, [true, true], "512px cards fit a 709px desktop viewport and retain hover motion");
panels[1].offsetHeight = 600; resize();
assert.deepEqual(states, [false, true], "Oversized cards lose sticky stacking, while hover motion remains");
panels[1].offsetHeight = 512; rootSize = 24; resize();
assert.equal(states[0], false, "Zoomed rem offsets must be included in available space");
rootSize = 16; pointer.matches = false; resize();
assert.deepEqual(states, [true, false], "Touch input can use a fitting reel without pointer tilt");
media.matches = false; resize();
assert.deepEqual(states, [false, false], "Reduced motion or narrow width disables the desktop effects");
cleanup(); assert.equal(disconnected, true);

(async () => {
  async function intro({ hash = "", scrollY = 0, top = 10 } = {}) {
    let start, animation, stopped = false, completes = 0, reveals = 0, unmount;
    const document = { documentElement: { dataset: { intro: "pending" } }, fonts: { ready: Promise.resolve() } };
    const context = { scale() {}, clearRect() {}, fillText() {}, fillRect() {}, drawImage() {}, measureText: () => ({ fontBoundingBoxAscent: 8, fontBoundingBoxDescent: 2 }), getImageData() { return { data: new Uint8Array(100 * 100 * 4).fill(255) }; } };
    const canvas = () => { const element = { width: 100, height: 100, getContext: () => ({ ...context, canvas: element }) }; return element; };
    const cell = { dataset: { glyph: "K" }, getBoundingClientRect: () => ({ top: 10, left: 10, width: 10, height: 10 }) };
    document.querySelector = () => ({ querySelectorAll: () => Array(14).fill(cell), getBoundingClientRect: () => ({ top, bottom: top + 20, left: 10, right: 90 }) });
    document.createElement = canvas;
    const window = { scrollY, setTimeout: callback => { start = callback; return 1; }, addEventListener() {}, removeEventListener() {} };
    load("app/components/ink-intro.tsx", {
      react: { useRef: () => ({ current: canvas() }), useEffect: effect => { unmount = effect(); } },
      "framer-motion": { animate: (_from, _to, options) => { animation = options; return { stop: () => { stopped = true; } }; } },
    }, { document, window, location: { hash }, innerWidth: 100, innerHeight: 100, devicePixelRatio: 1, clearTimeout() {}, getComputedStyle: () => ({ letterSpacing: "0", fontSize: "10", fontFamily: "sans-serif", fontWeight: "400" }) })
      .InkIntro({ onReveal: () => { reveals++; }, onComplete: () => { completes++; } });
    await Promise.resolve(); start();
    return { document, animation, window, unmount, result: () => ({ stopped, completes, reveals }) };
  }
  for (const options of [{ hash: "#stack" }, { scrollY: 400 }, { top: -50 }, { top: 150 }]) {
    const entry = await intro(options);
    assert.equal(entry.animation, undefined, "Offscreen and deep-link entries must not start a canvas intro");
    assert.equal(entry.result().completes, 1); entry.unmount();
  }
  const delayed = await intro();
  delayed.document.documentElement.dataset.intro = "done";
  delayed.animation.onUpdate(4.1);
  assert.deepEqual(delayed.result(), { stopped: true, completes: 1, reveals: 0 }, "A timed-out intro must not resurrect its overlay");
  delayed.unmount();
  const restored = await intro(); restored.window.scrollY = 500; restored.animation.onUpdate(1);
  assert.equal(restored.result().stopped, true); restored.unmount();
  const normal = await intro(); normal.animation.onUpdate(4.1);
  assert.equal(normal.result().reveals, 1, "A normal entrance must retain its reveal handoff");
  normal.unmount(); assert.equal(normal.result().stopped, true);
  console.log("Motion checks passed: first-entry eligibility, intro timeout/scroll guards, fitting sticky cards, independent hover, and cleanup.");
})().catch(error => { console.error(error); process.exitCode = 1; });
