/* ============================================================
   MiAtlas Sync — Google Apps Script bridge (read + write)
   ------------------------------------------------------------
   Turns YOUR (private) Google Sheet into MiAtlas's database.
   No server, and the Sheet does NOT need to be public.

   The readable "Places" tab IS the live data — so you can edit
   points straight in the Sheet and MiAtlas will pick them up.
   Heavy stuff (uploaded thumbnails, GPX routes) is kept in a
   hidden "_blobs" tab, keyed by id, so the Places tab stays clean.

   SETUP (see the setup guide for full steps):
   1. Change SECRET below to your own private password.
   2. Deploy > New deployment > Web app >
        Execute as: Me,  Who has access: Anyone  > Deploy.
   3. Copy the /exec url. In MiAtlas > ☁ Sync, paste url + SECRET.
   ============================================================ */

// ⬇️  CHANGE THIS to your own secret (letters/numbers, no spaces).
//     Type the SAME value into MiAtlas.
var SECRET = "change-me-to-something-private";

var PLACES_SHEET = "Places";   // human-readable, source of truth
var BLOB_SHEET   = "_blobs";   // hidden: id -> {thumb, route}
var HEADERS = ["id","name","cat","status","lat","lng","note","photos","detail","detailEditedAt"];

/* ---------- entry points ---------- */
function doGet(e)  { return handle_((e && e.parameter) ? e.parameter : {}); }
function doPost(e) {
  var p = {};
  try { p = JSON.parse(e.postData.contents); }
  catch (err) { p = (e && e.parameter) ? e.parameter : {}; }
  return handle_(p);
}

function handle_(p) {
  try {
    if (String(p.key || "") !== String(SECRET)) return out_({ ok: false, error: "unauthorized" });
    var action = p.action || "load";
    if (action === "load") return out_(loadData_());
    if (action === "save") return out_(saveData_(p.data));
    if (action === "ping") return out_({ ok: true, pong: true });
    return out_({ ok: false, error: "unknown action" });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- sheets ---------- */
function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function placesSheet_() {
  var sh = ss_().getSheetByName(PLACES_SHEET);
  if (!sh) { sh = ss_().insertSheet(PLACES_SHEET); sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}
function blobSheet_() {
  var sh = ss_().getSheetByName(BLOB_SHEET);
  if (!sh) { sh = ss_().insertSheet(BLOB_SHEET); sh.appendRow(["id", "json"]); }
  return sh;
}

/* map header names -> column index (0-based) */
function headerMap_(row) {
  var m = {};
  for (var i = 0; i < row.length; i++) {
    var h = String(row[i] || "").trim().toLowerCase();
    if (h) m[h] = i;
  }
  return m;
}

/* ---------- load ---------- */
function loadData_() {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (e) {}
  try {
    var sh = placesSheet_();
    var last = sh.getLastRow(), lastCol = sh.getLastColumn();
    if (last < 2) return { ok: true, rev: contentRev_([]), data: [] };

    var values = sh.getRange(1, 1, last, Math.max(lastCol, HEADERS.length)).getValues();
    var map = headerMap_(values[0]);
    var col = function (name) { return map.hasOwnProperty(name) ? map[name] : -1; };
    var get = function (row, name) { var c = col(name); return c >= 0 ? row[c] : ""; };

    var blobs = readBlobs_();
    var idCol = col("id");
    var newIds = [];             // [rowIndexInSheet, id] for blank ids we assign
    var out = [];

    for (var r = 1; r < values.length; r++) {
      var row = values[r];
      var name = String(get(row, "name") || "").trim();
      var lat = parseFloat(get(row, "lat"));
      var lng = parseFloat(get(row, "lng"));
      if (!name && !(isFinite(lat) && isFinite(lng))) continue;   // skip blank lines

      var id = String(get(row, "id") || "").trim();
      if (!id) { id = "p-" + Date.now() + "-" + Math.floor(Math.random() * 1e6) + "-" + r; newIds.push([r + 1, id]); }

      var p = {
        id: id,
        name: name,
        cat: String(get(row, "cat") || "highlight").trim() || "highlight",
        status: String(get(row, "status") || "wish").trim() || "wish",
        lat: isFinite(lat) ? lat : null,
        lng: isFinite(lng) ? lng : null,
        note: String(get(row, "note") || ""),
        photos: String(get(row, "photos") || "")
      };
      var detail = String(get(row, "detail") || "");
      if (detail) p.detail = detail;
      var dEdit = get(row, "detaileditedat");
      if (dEdit !== "" && dEdit != null) {
        var ms = (dEdit instanceof Date) ? dEdit.getTime() : Date.parse(dEdit);
        if (!isNaN(ms)) p.detailEditedAt = ms;
      }
      var b = blobs[id];
      if (b) { if (b.thumb) p.thumb = b.thumb; if (b.route) p.route = b.route; }
      out.push(p);
    }

    // persist any ids we generated for hand-added rows
    if (newIds.length && idCol >= 0) {
      newIds.forEach(function (pair) { sh.getRange(pair[0], idCol + 1).setValue(pair[1]); });
    }
    return { ok: true, rev: contentRev_(out), data: out };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/* ---------- save ---------- */
function saveData_(data) {
  if (!Array.isArray(data)) return { ok: false, error: "data must be an array" };
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (e) {}
  try {
    var sh = placesSheet_();
    sh.clear();
    var rows = [HEADERS.slice()];
    data.forEach(function (p) {
      rows.push([
        p.id || "",
        p.name || "",
        p.cat || "",
        p.status || "",
        (p.lat != null ? p.lat : ""),
        (p.lng != null ? p.lng : ""),
        p.note || "",
        p.photos || "",
        p.detail || "",
        p.detailEditedAt ? new Date(p.detailEditedAt).toISOString() : ""
      ]);
    });
    sh.getRange(1, 1, rows.length, HEADERS.length).setValues(rows);
    sh.setFrozenRows(1);

    writeBlobs_(data);
    return { ok: true, rev: contentRev_(data), count: data.length };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/* ---------- blobs (thumbnails + routes), keyed by id ---------- */
function readBlobs_() {
  var sh = blobSheet_();
  var last = sh.getLastRow();
  var map = {};
  if (last < 2) return map;
  var vals = sh.getRange(2, 1, last - 1, 2).getValues();
  vals.forEach(function (row) {
    var id = String(row[0] || "").trim();
    if (!id) return;
    try { map[id] = JSON.parse(row[1]); } catch (e) {}
  });
  return map;
}
function writeBlobs_(data) {
  var sh = blobSheet_();
  sh.clear();
  var rows = [["id", "json"]];
  data.forEach(function (p) {
    if (p.thumb || p.route) {
      var obj = {};
      if (p.thumb) obj.thumb = p.thumb;
      if (p.route) obj.route = p.route;
      rows.push([p.id || "", JSON.stringify(obj)]);
    }
  });
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
  try { sh.hideSheet(); } catch (e) {}
}

/* ---------- content revision (hash) ----------
   A hash of the meaningful data. Changes whenever the data changes,
   INCLUDING edits you make by hand in the Sheet. MiAtlas uses this
   to tell whether the cloud copy moved since it last synced.        */
function contentRev_(data) {
  var norm = (data || []).slice().sort(function (a, b) {
    return String(a.id).localeCompare(String(b.id));
  }).map(function (p) {
    return [p.id, p.name, p.cat, p.status, p.lat, p.lng, p.note || "",
            p.photos || "", p.detail || "", p.detailEditedAt || "",
            p.thumb ? 1 : 0, (p.route && p.route.distanceKm) || ""];
  });
  var s = JSON.stringify(norm);
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, s, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("");
}
