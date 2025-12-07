// === DERECH OLAM INCLUDE ENGINE ===
// This injects header.html, nav.html, and footer.html into any page.

// Helper: Load an external HTML file into a target element
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

// Load all includes once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  insertInclude("include-header", "/includes/header.html");
  insertInclude("include-nav", "/includes/nav.html");
  insertInclude("include-footer", "/includes/footer.html");
});
