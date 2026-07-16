============================================================
  MiAtlas — A Vietnam Odyssey
  Your personal travel map. 🌅
============================================================

WHAT THIS IS
------------
MiAtlas is a single web page (MiAtlas.html) that shows an interactive map of Vietnam — and the whole world. You can pin
the places you've conquered and the ones still on your bucket list: peaks, hidden beaches and islands, motorbike loops and
passes, and other highlights.

It comes pre-loaded with 33 places, including 2 peaks already marked as "conquered" (Tà Xùa and Nam Kang Hô Tao). Everything
is yours to edit, add to, or delete.


HOW TO OPEN IT
--------------
1. Double-click "MiAtlas.html". It opens in your web browser
   (Chrome, Edge, Safari, Firefox — any of them).
2. That's it. No install, no account, no password.

NOTE: You need an internet connection for the map to load (the map images come from the web). The page itself works
offline, but the map tiles won't show without internet.


USING THE MAP
-------------
• Zoom / pan: scroll or use the + / – buttons; drag to move.
• Map style: top-right corner — switch between Streets,
  Terrain, and Satellite.
• Click any pin to see its details and a link to open it in
  Google Maps.
• Click a place in the left list to fly the map to it.

Pin colors:
   CORAL  = Conquered  ✓  (places you've been)
   LAVENDER = Want to go ★ (your bucket list)

Pin icons:
   ⛰️ peak    🏖️ sea/beach    🛵 loop/pass    ✨ highlight


ADDING A PLACE (with Google Maps)
---------------------------------
1. Click "＋ Add a place" (top-left).
2. Open the spot in Google Maps. Copy either:
   - the LINK from the address bar, OR
   - the COORDINATES (right-click the spot on Google Maps,
     then click the "lat, long" numbers to copy them).
3. Paste it into the "Google Maps link or coordinates" box
   and click "Pin it" — the latitude/longitude fill in
   automatically.
4. Give it a name, pick a category and status (conquered or
   want-to-go), add a note if you like, then "Save".

TIP: Short links like "maps.app.goo.gl/..." do NOT contain coordinates. Open the short link first, then copy the numbers
or the full link from the address bar.

Editing / deleting: click "✎ Edit" on any place (in the list or on the map popup). You can also tap "✓ Mark conquered" /
"↩ Move to wishlist" to quickly change status.


★ IMPORTANT — WHERE YOUR DATA IS SAVED ★
----------------------------------------
Your pins are saved INSIDE YOUR WEB BROWSER on the computer you're using (this is called "localStorage") — NOT inside the
MiAtlas.html file itself.

What this means in plain words:
• Your added/edited pins stay on THIS computer + THIS browser.
• If you open MiAtlas.html on another computer, or in a  different browser, or after clearing your browser data,
  your custom pins will NOT be there (you'll see the original 33 starter pins again).
• To carry your map somewhere else, use EXPORT / IMPORT below.

WANT REAL CROSS-DEVICE SYNC?
There is now an optional Cloud Sync: link the app to your own
(private) Google Sheet with the "☁ Sync" button, and your map
follows you across phone and computer automatically. Full steps
are in "MiAtlas-Sync-Huong-Dan.md" (Vietnamese). With sync on,
your data is safe in your Sheet even if this browser is cleared.


MOVING YOUR MAP TO ANOTHER COMPUTER (Export / Import)
-----------------------------------------------------
TO BACK UP or MOVE your pins:
1. Click "⭳ Export". A small file called
   "miatlas-places.json" downloads to your computer.
   (This file holds ALL your places — keep it safe.)

TO RESTORE or LOAD them on another computer/browser:
1. Copy BOTH files to the other computer:
      - MiAtlas.html
      - miatlas-places.json
2. Open MiAtlas.html there.
3. Click "⭱ Import" and choose your "miatlas-places.json".
4. You'll be asked:
      - "Replace" = wipe current pins, load the file's pins.
      - "Cancel"  = merge / add the file's pins to what's
                    already there.

GOOD HABIT: Export a fresh backup every now and then, and
especially before clearing your browser or switching devices.


TROUBLESHOOTING
---------------
• Blank page / map not showing → check your internet connection, then refresh the page.
• "My pins disappeared" → you likely opened it in a different browser/computer, or cleared browser data. Use Import with
  your exported .json backup.
• Map looks empty but list shows places → switch map style (top-right) or zoom out.

------------------------------------------------------------
Enjoy the journey. Collect moments like summits. 🌏
------------------------------------------------------------
