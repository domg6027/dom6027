// === DERECH OLAM INCLUDE ENGINE (DOMG6027) ===

async function insertInclude(targetId, filePath) {
  const container = document.getElementById(targetId);
  if (!container) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    container.innerHTML = await response.text();
  } catch (err) {
    console.error("Include error:", filePath, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  insertInclude("header-placeholder", "/header.html");
  insertInclude("nav-placeholder", "/nav.html");
  insertInclude("footer-placeholder", "/footer.html");
});
