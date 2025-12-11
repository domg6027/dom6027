import fs from "fs";
import path from "path";

/* ----------------------------------------
   File location
----------------------------------------- */
const PRAYERS_FILE = path.join(process.cwd(), "prayers.json");

/* ----------------------------------------
   Load JSON safely
----------------------------------------- */
function loadPrayers() {
  if (!fs.existsSync(PRAYERS_FILE)) {
    return { requests: [], last_id: 0 };
  }

  return JSON.parse(fs.readFileSync(PRAYERS_FILE, "utf8"));
}

/* ----------------------------------------
   Save JSON safely (atomic write)
----------------------------------------- */
function savePrayers(data) {
  const tempFile = PRAYERS_FILE + ".tmp";
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
  fs.renameSync(tempFile, PRAYERS_FILE);
}

/* ----------------------------------------
   Normalizer (for duplicate checking)
----------------------------------------- */
function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

/* ----------------------------------------
   Add a new prayer request
----------------------------------------- */
export function addPrayer(text, source = "manual") {
  const data = loadPrayers();

  const normalizedNew = normalize(text);

  // Prevent duplicates
  for (let req of data.requests) {
    if (normalize(req.text) === normalizedNew) {
      return {
        added: false,
        reason: "duplicate",
        existing: req
      };
    }
  }

  const nextID = data.last_id + 1;
  const today = new Date().toISOString().split("T")[0];

  const newRequest = {
    id: nextID,
    text,
    source,
    date_added: today
  };

  data.requests.push(newRequest);
  data.last_id = nextID;

  savePrayers(data);

  return {
    added: true,
    request: newRequest
  };
}

/* ----------------------------------------
   Remove a request by ID
----------------------------------------- */
export function removePrayer(id) {
  const data = loadPrayers();

  const filtered = data.requests.filter(r => r.id !== id);

  if (filtered.length === data.requests.length) {
    return { removed: false, reason: "not_found" };
  }

  data.requests = filtered;
  savePrayers(data);

  return { removed: true };
}

/* ----------------------------------------
   List all requests (sorted by ID)
----------------------------------------- */
export function listPrayers() {
  const data = loadPrayers();

  return data.requests.sort((a, b) => a.id - b.id);
}

/* ----------------------------------------
   Export everything as a toolkit
----------------------------------------- */
export default {
  loadPrayers,
  savePrayers,
  addPrayer,
  removePrayer,
  listPrayers
};
