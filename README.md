# MiAtlas · A Vietnam Odyssey 🌅

An interactive personal travel map of Vietnam (and the whole world). Pin the places you've **conquered** and the ones still on your **bucket list** — peaks, hidden beaches and islands, motorbike loops and passes, and other highlights. Comes pre-loaded with **33 starter places**.

It's a single self-contained web page. No install, no account. Your data can live purely in your browser, **or** sync privately across all your devices through **your own Google Sheet**.

---

## ✨ Features

- Interactive map (zoom, pan, Street / Terrain / Satellite layers), colored pins for *Conquered* vs *Want to go*, categories for peak / sea / loop / highlight.
- Add places from a Google Maps link or coordinates; upload a thumbnail; attach a GPX route.
- **Detail** per place — a private space to write your impressions (up to 10,000 words), opened only when you click a place, with a "last edited" timestamp.
- **Cloud sync (optional)** — link the app to a private Google Sheet so your map follows you across phone and computer. Auto-pushes every change; asks you only on a real conflict. You can even edit places straight in the Sheet.
- Export / Import your whole map as a JSON backup at any time.

---

## 📂 Files in this repo

| File | What it is |
|------|------------|
| `MiAtlas.html` | The app. **Rename to `index.html`** so GitHub Pages serves it at the site root. |
| `MiAtlas-Sync.gs` | Google Apps Script that turns your private Google Sheet into the app's database (read + write). |
| `MiAtlas-Database-Starter.xlsx` | A ready starter sheet with the 33 places. Upload to Drive → open as Google Sheets → edit directly if you like. |
| `MiAtlas-Sync-Huong-Dan.md` | **Full setup guide (Vietnamese)** — create the database, link the app, deploy to GitHub Pages. |
| `README.txt` | Plain-text quick reference for using the map. |

---

## 🚀 Quick start

**Just try it locally:** open `MiAtlas.html` in any browser. Your pins save in that browser (localStorage).

**Put it online (one URL for every device):**
1. Create a public GitHub repo named `miatlas`.
2. Upload this folder — but **rename `MiAtlas.html` to `index.html`**.
3. **Settings → Pages → Deploy from a branch → `main` / root**.
4. Your site goes live at `https://<your-github-username>.github.io/miatlas/`.

**Sync across devices (keep data private):** follow **`MiAtlas-Sync-Huong-Dan.md`** — you create a private Google Sheet, paste in the `MiAtlas-Sync.gs` script, deploy it as a Web App, then paste that link + a secret key into the app's **☁ Sync** panel.

---

## 🔒 Privacy

The hosted page is **public but harmless** — it's just the empty app shell. It contains **no data and no keys**. Your places live in your own Google Sheet (which stays private) and in each device's browser. Two people can open the same URL and see completely different maps, because each connects to their own Sheet. Only someone with **both** your Web App link **and** your secret key can read or write your data — keep those to yourself.

---

## 💾 Where your data lives

By default, pins are stored in the browser you're using (localStorage), not inside the HTML file. Opening the app in another browser/device, or clearing browser data, resets it to the 33 starter pins — **unless** you've set up cloud sync, in which case your data is safe in your Google Sheet and comes back by re-linking. Either way, **⭳ Export** gives you a JSON backup any time.

---

*Enjoy the journey. Collect moments like summits.* 🌏
