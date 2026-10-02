/* B1 refined: the behaviour agreed for sort option B1 (use by on at load, cache first then background refresh, ribbon that gets out of the way). Sample data only.
   Sample data only. Use-by dates are offsets from today, so the labels stay current. */
(function () {
  "use strict";
    var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- sample items: [name, emoji, qty, area, spot, category, use-by offset in days (null = none), hours since added] ---------- */
  var RAW = [
    ["milk", "🥛", "1 L", "Fridge", "Door", "Dairy and eggs", 1, 5],
    ["butter", "🧈", "250 g", "Fridge", "Door", "Dairy and eggs", 21, 700],
    ["chicken thighs", "🍗", "600 g", "Fridge", "Bottom shelf", "Meat", -3, 50],
    ["spinach", "🥬", "1 bag", "Fridge", "Crisper", "Veggies", 3, 1],
    ["eggs", "🥚", "10", "Fridge", "Top shelf", "Dairy and eggs", 9, 96],
    ["yoghurt", "🥣", "2 tubs", "Fridge", "Middle shelf", "Dairy and eggs", 0, 30],
    ["carrots", "🥕", "1 bag", "Fridge", "Crisper", "Veggies", 5, 200],
    ["orange juice", "🍊", "1 L", "Fridge", "Door", "Beverages", 7, 12],
    ["rice", "🍚", "2 kg", "Pantry", "Shelf 2", "Dry goods", null, 900],
    ["tinned tomatoes", "🥫", "4 cans", "Pantry", "Shelf 1", "Dry goods", 400, 600],
    ["soy sauce", "🍶", "1 bottle", "Pantry", "Top shelf", "Condiments", null, 800],
    ["frozen peas", "🟢", "1 bag", "Freezer", "Drawer 1", "Veggies", 200, 400],
    ["beef mince", "🥩", "500 g", "Freezer", "Drawer 2", "Meat", -1, 80],
    ["baking paper", "📜", "1 roll", "Other", "Cupboard", "Household", null, 300],
    ["batteries", "🔋", "4", "Other", "Junk drawer", "Household", null, 1000]
  ];
  var ITEMS = RAW.map(function (r) { return { name: r[0], emoji: r[1], qty: r[2], area: r[3], place: r[4], category: r[5], days: r[6], age: r[7] }; });

  /* ---------- the app's use-by wording (server/src/assets/useby.js CONFIG) ---------- */
  var CFG = { soon: 3, count: 7 };
  function days(n) { return n + (n === 1 ? " day" : " days"); }
  function dueLabel(n) {
    if (n < 0) return "Past use by " + days(-n);
    if (n === 0) return "Use today";
    if (n <= CFG.count) return "Use within " + days(n);
    return "More than a week";
  }
  function dueTone(n) { return n < 0 ? "late" : n <= CFG.soon ? "soon" : ""; }
  function dateStr(n) { var d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  /* ---------- icons ---------- */
  function svg(inner) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + inner + "</svg>"; }
  function big(inner) { return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + "</svg>"; }
  var IC = {
    pin: svg('<path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21z"/><circle cx="12" cy="10" r="2.5"/>'),
    tag: svg('<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1.3"/>'),
    az: svg('<text x="2" y="10">A</text><text x="2" y="21">Z</text><path d="M17 5v13M13.5 14.5L17 18l3.5-3.5"/>'),
    hourglass: svg('<path d="M6 3h12M6 21h12M7 3v3.5a5 5 0 0 0 2 4l1.5 1.5L9 13.5a5 5 0 0 0-2 4V21M17 3v3.5a5 5 0 0 1-2 4L13.5 12l1.5 1.5a5 5 0 0 1 2 4V21"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>'),
    clockOn: svg('<circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M12 7v5l3.2 2" stroke="var(--accent)"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    sparkle: svg('<path d="M10 4l1.9 5.1L17 11l-5.1 1.9L10 18l-1.9-5.1L3 11l5.1-1.9z"/><path d="M18.5 3v4M16.5 5h4"/>'),
    person: big('<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>'),
    search: big('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
    chev: big('<path d="M9 6l6 6-6 6"/>'),
    plus: big('<path d="M12 5v14M5 12h14"/>'),
    cart: big('<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2.5l2.2 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2"/>'),
    list: big('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>')
  };

  /* ---------- state ----------
     pin: "" | "loc" | "cat" (never both). clock: Use by, on at every load. area / cat: the picked ribbon value ("" = All).
     ribbon: whether the ribbon is showing. It hides itself after 5 s with no touch, and at once when a value is picked while Use by is on. */
  var MONTH = 30;
  var state = { pin: "", clock: true, area: "", cat: "", ribbon: false };
  var AREA_ORDER = ["Fridge", "Pantry", "Freezer"];
  function areaCmp(x, y) {
    var px = AREA_ORDER.indexOf(x), py = AREA_ORDER.indexOf(y);
    if (px !== -1 || py !== -1) return (px === -1 ? 99 : px) - (py === -1 ? 99 : py);
    return x.localeCompare(y);
  }
  function byName(a, b) { return a.name.localeCompare(b.name); }
  function byUseBy(a, b) { return a.days === b.days ? byName(a, b) : a.days - b.days; }
  function metaLine(i, flat) { return [flat ? i.area : "", i.qty, i.place, i.category].filter(Boolean).join(" · "); }
  function rowHtml(i, flat) {
    var due = i.days === null ? "" : '<span class="k-due" data-tone="' + dueTone(i.days) + '" title="Use by ' + dateStr(i.days) + '">' + esc(dueLabel(i.days)) + "</span>";
    return '<li data-row><a class="rowlink" href="#" draggable="false"><div class="main"><div class="name"><span aria-hidden="true">' + i.emoji + "</span> " + esc(i.name) + '</div><div class="meta">' + esc(metaLine(i, flat)) + "</div></div>" + due + '<span class="chev">' + IC.chev + "</span></a></li>";
  }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("on"); }, 1800);
  }
  var PIN_NAME = { loc: "Location", cat: "Category" };

  /* ---------- loading: cache first, then the server, then the rest page by page (simulated) ---------- */
  var expiring = ITEMS.filter(function (i) { return i.days !== null && i.days <= MONTH; });
  var rest = ITEMS.filter(function (i) { return !(i.days !== null && i.days <= MONTH); });
  var NEW_ITEM = { name: "cream", emoji: "🥛", qty: "300 ml", area: "Fridge", place: "Door", category: "Dairy and eggs", days: 2, age: 1 };
  var PAGE = 3;
  var data = [];            // what the page can show right now
  var phase = "";           // "", "cache", "refreshing", "paging", "done"
  var timers = [];
  function log(msg) {
    var box = $("#loadlog"); if (!box) return;
    var li = document.createElement("li"); li.textContent = (Math.round(performance.now() - t0) / 1000).toFixed(1) + " s  " + msg; box.appendChild(li);
  }
  var t0 = performance.now();
  function load() {
    timers.forEach(clearTimeout); timers = [];
    t0 = performance.now(); $("#loadlog").innerHTML = "";
    data = []; phase = "cache"; state = { pin: "", clock: true, area: "", cat: "", ribbon: false };
    // 1. instant: what was cached on this phone last time (the expiring items only)
    data = expiring.slice(); render(); log("Cache: painted " + expiring.length + " expiring items, no waiting for the server");
    // 2. the server answers: the expiring items are refreshed (a new one has arrived)
    timers.push(setTimeout(function () {
      phase = "refreshing"; data = expiring.concat([NEW_ITEM]); render(); toast("Updated"); log("Server: expiring items refreshed (cream is new)");
    }, 1200));
    // 3. then everything else, one page at a time, quietly
    var pages = Math.ceil(rest.length / PAGE);
    for (var p = 0; p < pages; p++) (function (p) {
      timers.push(setTimeout(function () {
        data = data.concat(rest.slice(p * PAGE, p * PAGE + PAGE)); phase = p === pages - 1 ? "done" : "paging";
        render(); log("Background: page " + (p + 1) + " of " + pages + " loaded" + (p === pages - 1 ? ". Everything is here." : ""));
      }, 2400 + p * 900));
    })(p);
  }

  /* ---------- the ribbon gets out of the way ---------- */
  var idle = 0;
  function touch() {
    clearTimeout(idle);
    if (state.pin && state.ribbon) idle = setTimeout(function () { if (state.ribbon) { state.ribbon = false; render(); log("Ribbon hid itself after 5 s"); } }, 5000);
  }
  function picked() { return state.pin === "cat" ? state.cat : state.pin === "loc" ? state.area : ""; }

  function titleText() {
    var p = picked(), where = p || (state.pin ? PIN_NAME[state.pin] : "");
    if (state.clock) return where ? "Use by · " + where : "Use by";
    return where || "All items";
  }

  function pinSwitch() {
    return '<div class="iseg" id="pinsw" role="group" aria-label="Group the list by">' + [["loc", IC.pin, "Location"], ["cat", IC.tag, "Category"]].map(function (o) {
      var on = state.pin === o[0];
      return '<button type="button" aria-pressed="' + on + '" data-pin="' + o[0] + '" aria-label="' + o[2] + (on ? ". Tap again to clear" : "") + '" title="' + o[2] + (on ? " (tap again to clear)" : "") + '">' + o[1] + "</button>";
    }).join("") + "</div>";
  }
  function clockButton() {
    return '<button type="button" class="tog' + (state.clock ? " is-on" : "") + '" id="clock" aria-pressed="' + state.clock + '" aria-label="Use by, soonest first" title="Use by, expiring within a month: ' + (state.clock ? "on" : "off") + '">' + (state.clock ? IC.clockOn : IC.clock) + "</button>";
  }

  function render() {
    var view = state.pin, isCat = view === "cat", sel = picked();
    var flat = state.clock || !view;

    // title: reads the exact pick; tap it to bring the ribbon back when it has hidden itself
    var head = view && !state.ribbon
      ? '<button type="button" class="titlebtn" id="titlebtn" aria-label="' + titleText() + ". Tap to show the " + PIN_NAME[view].toLowerCase() + ' ribbon"><span id="title">' + esc(titleText()) + '</span><span class="mark" aria-hidden="true">▾</span></button>'
      : '<b id="title">' + esc(titleText()) + "</b>";
    $("#titlerow").innerHTML = head + '<div class="ctl">' + pinSwitch() + clockButton() + "</div>";

    // ribbon
    if (!view || !state.ribbon) $("#tabs").innerHTML = "";
    else {
      var vals = isCat
        ? Array.from(new Set(ITEMS.map(function (i) { return i.category; }))).sort()
        : Array.from(new Set(ITEMS.map(function (i) { return i.area; }))).sort(areaCmp);
      $("#tabs").innerHTML = '<nav class="tabs" aria-label="' + PIN_NAME[view] + '"><a href="#" data-tab="" ' + (sel === "" ? 'aria-current="page"' : "") + ' draggable="false">All</a>' +
        vals.map(function (v) { return '<a href="#" data-tab="' + esc(v) + '" ' + (v === sel ? 'aria-current="page"' : "") + ' draggable="false">' + esc(v) + "</a>"; }).join("") + "</nav>";
    }

    // list: Use by on shows only what expires within a month, soonest first; off shows everything, A to Z
    var base = state.clock ? data.filter(function (i) { return i.days !== null && i.days <= MONTH; }) : data;
    var shown = base.filter(function (i) { return !sel || (isCat ? i.category : i.area) === sel; });
    var html;
    if (!shown.length) html = '<p class="empty">' + (state.clock ? "Nothing here expires within a month." : "Nothing here.") + "</p>";
    else if (flat) {
      html = '<ul class="rows" data-flat>' + shown.slice().sort(state.clock ? byUseBy : byName).map(function (i) { return rowHtml(i, true); }).join("") + "</ul>";
    } else {
      var map = {};
      shown.forEach(function (i) { var k = isCat ? i.category : i.area; (map[k] = map[k] || []).push(i); });
      html = Object.keys(map).sort(isCat ? undefined : areaCmp).map(function (k) {
        var l = map[k].slice().sort(byName);
        return '<section class="group"><div class="grouphead"><h2>' + esc(k) + '</h2></div><ul class="rows">' + l.map(function (i) { return rowHtml(i, false); }).join("") + "</ul></section>";
      }).join("");
    }
    if (!state.clock && phase !== "done") html += '<p class="loading" role="status">Loading the rest…</p>';
    if (state.clock) html += '<p class="note">Use by shows what expires within a month. Turn it off to see everything.</p>';
    $("#list").innerHTML = html;
    touch();
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("a[data-tab]");
    if (t) {
      e.preventDefault(); var keep = $("nav.tabs").scrollLeft, v = t.getAttribute("data-tab");
      if (state.pin === "cat") state.cat = v; else state.area = v;
      if (v && state.clock) { state.ribbon = false; log("Value picked with Use by on: ribbon hid to give the list room"); }
      render(); if ($("nav.tabs")) $("nav.tabs").scrollLeft = keep; return;
    }
    if (e.target.closest("a.rowlink, a[href='#']")) { e.preventDefault(); return; }
    if (e.target.closest("#clock")) { state.clock = !state.clock; render(); toast(state.clock ? "Use by: on" : "Use by: off"); return; }
    if (e.target.closest("#titlebtn")) { state.ribbon = true; render(); return; }
    if (e.target.closest("#replay")) { load(); return; }
    var b = e.target.closest("#pinsw button");
    if (b) {
      var k = b.getAttribute("data-pin");
      if (state.pin === k) { state.pin = ""; state.area = ""; state.cat = ""; state.ribbon = false; render(); toast("Location and Category cleared"); return; }
      state.pin = k; state.ribbon = true; render();
    }
  });
  document.addEventListener("scroll", function (e) { if (e.target.classList && e.target.classList.contains("tabs")) touch(); }, true);

  $("#hdr").innerHTML = '<button type="button" class="icon" aria-label="Profile" title="Profile">' + IC.person + '</button><button type="button" class="icon" aria-label="Search" title="Search">' + IC.search + "</button>";
  $("#dock").innerHTML = '<button type="button" class="icon" aria-label="Add an item" title="Add an item">' + IC.plus + '</button><button type="button" class="icon" aria-label="Copy shopping list" title="Copy shopping list">' + IC.cart + '</button><button type="button" class="icon" aria-label="Copy kitchen list" title="Copy kitchen list">' + IC.list + "</button>";
  load();
})();
