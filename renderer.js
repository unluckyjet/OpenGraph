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
