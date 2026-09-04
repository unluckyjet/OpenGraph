"use strict";

for (const button of document.querySelectorAll("[data-window]")) {
  button.addEventListener("click", () => window.opengraph.window(button.dataset.window));
}

const sidebar = document.getElementById("sidebar");
document.getElementById("toggleSidebar").addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

/* --- the sidebar tree ----------------------------------------------------
 *
 * The rows are built here rather than written into the page, so the tree is a
 * function of data. Nothing is hardcoded: TREE is empty, so the sidebar shows
 * nothing until something fills it.
 */

const FOLDER =
  "M2 4.5 a1 1 0 0 1 1-1 h3 l1.2 1.5 H13 a1 1 0 0 1 1 1 V12 a1 1 0 0 1-1 1 H3 a1 1 0 0 1-1-1 Z";
const PROJECT = "M3 3 L13 13 M13 3 L3 13";

function icon(path) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "row-icon");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  shape.setAttribute("d", path);
  shape.setAttribute("fill", "none");
  shape.setAttribute("stroke", "currentColor");
  shape.setAttribute("stroke-width", "1.1");
  svg.append(shape);
  return svg;
}

/** One clickable line. `kind` picks the indent, not the content. */
function row({ label, kind = "flat", selected = false, muted = false, glyph = null }) {
  const button = document.createElement("button");
  button.className = ["row", kind, selected ? "selected" : "", muted ? "muted" : ""]
    .filter(Boolean)
    .join(" ");
  if (glyph) button.append(icon(glyph === "folder" ? FOLDER : PROJECT));
  button.append(document.createTextNode(label));
  return button;
}

function section(label) {
  const heading = document.createElement("div");
  heading.className = "section";
  heading.textContent = label;
  return heading;
}

/**
 * Draw the tree from a list of entries.
 *
 * An entry is {type: "section", label} or a row. Given an empty list this
 * clears the sidebar and draws nothing, which is where the application starts.
 */
function renderTree(entries) {
  const tree = document.getElementById("tree");
  tree.replaceChildren();
  for (const entry of entries) {
    tree.append(entry.type === "section" ? section(entry.label) : row(entry));
  }
}

// Nothing to show yet. Projects and recents will come from wherever they end
// up living, not from the markup.
const TREE = [];

renderTree(TREE);

/* --- the empty stage -----------------------------------------------------
 *
 * The mark, the greeting and the starter cards were written into the page.
 * They are builders now, so what fills the middle of the window is a function
 * of state rather than a block of markup. STAGE is null, so nothing draws.
 */

const SVG = "http://www.w3.org/2000/svg";

function svg(attributes, children) {
  const node = document.createElementNS(SVG, "svg");
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  for (const [tag, shape] of children) {
    const child = document.createElementNS(SVG, tag);
    for (const [key, value] of Object.entries(shape)) child.setAttribute(key, value);
    node.append(child);
  }
  return node;
}

/** The speech-bubble mark that sits above the greeting. */
function mark() {
  const stroke = { fill: "none", stroke: "#c9c9c9", "stroke-width": "2.6", "stroke-linecap": "round" };
  return svg(
    { class: "mark", viewBox: "0 0 64 64", width: "58", height: "58", "aria-hidden": "true" },
    [
      [
        "path",
        {
          d: `M32 8 C17 8 7 17 7 28.5 C7 36 11.5 42.5 18.5 46 C18 49.5 16.5 52.5 14.5 54.5
              C13.5 55.6 14.3 57.2 15.8 56.9 C21 56 25.5 53.8 28.5 50.8 C29.7 50.9 30.8 51 32 51
              C47 51 57 42 57 30.5 C57 18 47 8 32 8 Z`,
          ...stroke,
          "stroke-linejoin": "round",
        },
      ],
      ["path", { d: "M23.5 24.5 L29 29.5 L23.5 34.5", ...stroke, "stroke-linejoin": "round" }],
      ["line", { x1: "33", y1: "34.5", x2: "41", y2: "34.5", ...stroke }],
    ],
  );
}

/** "What should we build in <project>?", with the name underlined. */
function greeting(project) {
  const heading = document.createElement("h1");
  heading.append("What should we build in ");
  heading.append(Object.assign(document.createElement("u"), { textContent: project }));
  heading.append("?");
  return heading;
}

/** One starter card: a coloured glyph over a line of text. */
function card({ label, paths }) {
  const button = document.createElement("button");
  button.className = "card";
  button.append(
    svg({ viewBox: "0 0 20 20", width: "17", height: "17" }, paths),
    Object.assign(document.createElement("span"), { textContent: label }),
  );
  return button;
}

function cards(entries) {
  const wrap = document.createElement("div");
  wrap.className = "cards";
  for (const entry of entries) wrap.append(card(entry));
  return wrap;
}

/**
 * Fill the middle of the window.
 *
 * Given null it clears the stage and draws nothing, which is where the
 * application starts.
 */
function renderStage(state) {
  const stage = document.getElementById("stage");
  stage.replaceChildren();
  if (!state) return;
  if (state.mark) stage.append(mark());
  if (state.project) stage.append(greeting(state.project));
  if (state.cards?.length) stage.append(cards(state.cards));
}

// Nothing to show yet.
const STAGE = null;

renderStage(STAGE);
