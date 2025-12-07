// === DERECH OLAM INCLUDE ENGINE ===

async function insertInclude(targetId, filePath) {
  const container = document.getElementById(targetId);
  if (!container) return;

  try {
    const response = await fetch(filePath);
    const content = await response.text();
    container.innerHTML = content;
  } catch (err) {
    console.error("Include error:", filePath, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  insertInclude("include-header", "header.html");
  insertInclude("include-nav", "nav.html");
  insertInclude("include-footer", "footer.html");
});
