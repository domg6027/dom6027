import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* -------------------------------------------------- */
/*                 Resolve root path                  */
/* -------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Repo root (helpers/ → root) */
const ROOT_DIR = path.join(__dirname, "..");

/* data.json lives in ROOT */
const DATA_FILE = path.join(ROOT_DIR, "data.json");

/* -------------------------------------------------- */
/*               Internal: safe JSON read             */
/* -------------------------------------------------- */

function loadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("data.json not found in repo root");
    }

    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Ezra JSON load error:", err.message);
    return null;
  }
}

/* -------------------------------------------------- */
/*                Public Ezra helpers                 */
/* -------------------------------------------------- */

/**
 * Returns current creational date string
 * Example: "Yom Sheni, Tishi'i 24, 6027 AA"
 */
export function getCreationalDate() {
  const data = loadJSON(DATA_FILE);
  return data?.creational_date || null;
}

/**
 * Returns full raw data.json object
 * (for future holy days, flags, etc.)
 */
export function getEzraData() {
  return loadJSON(DATA_FILE);
}
