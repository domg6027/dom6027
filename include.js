// === DERECH OLAM INCLUDE ENGINE (DOMG6027) ===

async function fetchInclude(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } catch (err) {
    console.error("Include error:", filePath, err);
    return "";
  }
}

// NEW: supports data-include system (your current HTML)
async function processDataIncludes() {
  const elements = document.querySelectorAll("[data-include]");

  for (const el of elements) {
    const name = el.getAttribute("data-include");
    let file = "";

    switch (name) {
      case "header":
        file = "https://domg6027.github.io/dom6027/header.html";
        break;

      case "nav_bar":
      case "nav":
        // fallback support for both systems
        file = "https://domg6027.github.io/dom6027/nav_bar.html";
        break;

      case "footer":
        file = "https://domg6027.github.io/dom6027/footer.html";
        break;

      default:
        console.warn("Unknown include:", name);
        continue;
    }

    el.innerHTML = await fetchInclude(file);
  }
}

// LEGACY: supports id-based placeholders (old system)
async function processPlaceholders() {
  const map = [
    ["header-placeholder", "https://domg6027.github.io/dom6027/header.html"],
    ["nav-placeholder", "https://domg6027.github.io/dom6027/nav_bar.html"],
    ["footer-placeholder", "https://domg6027.github.io/dom6027/footer.html"]
  ];

  for (const [id, file] of map) {
    const el = document.getElementById(id);
    if (!el) continue;
    el.innerHTML = await fetchInclude(file);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await processDataIncludes();
  await processPlaceholders();
});
