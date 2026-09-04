"use strict";

for (const button of document.querySelectorAll("[data-window]")) {
  button.addEventListener("click", () => window.opengraph.window(button.dataset.window));
}

const sidebar = document.getElementById("sidebar");
document.getElementById("toggleSidebar").addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});
