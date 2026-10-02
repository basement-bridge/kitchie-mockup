/* Shared behaviour for the three "how do I clear it" variations of sort option B. The page sets <body data-clear="tap|title|ribbon">.
   Sample data only. Use-by dates are offsets from today, so the labels stay current. */
(function () {
  "use strict";
  var CLEAR = document.body.getAttribute("data-clear");
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

  /* ---------- state ---------- */
  // A: view (loc|cat) and sort (name|useby|recent) are separate. B and C: one mode (loc|cat|useby).
  var state = { view: "loc", sort: "name", mode: "loc", area: "", cat: "" };
  function sortKey() { return OPTION === "a" ? state.sort : state.mode === "useby" ? "useby" : "name"; }
  function viewKey() { return OPTION === "a" ? state.view : state.mode === "cat" ? "cat" : "loc"; }   // which filter the ribbon shows
  var AREA_ORDER = ["Fridge", "Pantry", "Freezer"];

  function areaCmp(x, y) {
    var px = AREA_ORDER.indexOf(x), py = AREA_ORDER.indexOf(y);
    if (px !== -1 || py !== -1) return (px === -1 ? 99 : px) - (py === -1 ? 99 : py);
    return x.localeCompare(y);
  }
  function byName(a, b) { return a.name.localeCompare(b.name); }
  function byUseBy(a, b) {   // soonest first (past use by on top), undated last, ties by name
    var x = a.days === null ? Infinity : a.days, y = b.days === null ? Infinity : b.days;
    return x === y ? byName(a, b) : x - y;
  }
  function byRecent(a, b) { return a.age - b.age || byName(a, b); }

  function metaLine(i, flat) {
    return [flat ? i.area : "", i.qty, i.place, i.category].filter(Boolean).join(" · ");
  }
  function rowHtml(i, flat) {
    var due = i.days === null ? "" : '<span class="k-due" data-tone="' + dueTone(i.days) + '" title="Use by ' + dateStr(i.days) + '">' + esc(dueLabel(i.days)) + "</span>";
    return '<li data-row><a class="rowlink" href="#" draggable="false"><div class="main"><div class="name"><span aria-hidden="true">' + i.emoji + "</span> " + esc(i.name) + '</div><div class="meta">' + esc(metaLine(i, flat)) + "</div></div>" + due + '<span class="chev">' + IC.chev + "</span></a></li>";
  }

  /* ---------- state ----------
     pin: "" (nothing: the plain list), "loc" or "cat". Starts as "" so the page opens with no location or category filter.
     clock: Use by on or off, separate from pin and tag. */
  var state = { pin: "", clock: false, area: "", cat: "" };
  var AREA_ORDER = ["Fridge", "Pantry", "Freezer"];
  function areaCmp(x, y) {
    var px = AREA_ORDER.indexOf(x), py = AREA_ORDER.indexOf(y);
    if (px !== -1 || py !== -1) return (px === -1 ? 99 : px) - (py === -1 ? 99 : py);
    return x.localeCompare(y);
  }
  function byName(a, b) { return a.name.localeCompare(b.name); }
  function byUseBy(a, b) {   // soonest first (past use by on top), undated last, ties by name
    var x = a.days === null ? Infinity : a.days, y = b.days === null ? Infinity : b.days;
    return x === y ? byName(a, b) : x - y;
  }
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

  function titleText() {
    if (state.clock) return state.pin ? "Use by · " + PIN_NAME[state.pin] : "Use by";
    return state.pin ? PIN_NAME[state.pin] : "All items";
  }

  function pinSwitch() {
    // "tap": the two buttons are toggles (pressed, tap again to clear). "title" and "ribbon": a plain two-way switch.
    var tog = CLEAR === "tap";
    return '<div class="iseg" id="pinsw" role="' + (tog ? "group" : "radiogroup") + '" aria-label="Group the list by">' + [["loc", IC.pin, "Location"], ["cat", IC.tag, "Category"]].map(function (o) {
      var on = state.pin === o[0];
      return '<button type="button" ' + (tog ? 'aria-pressed="' + on + '"' : 'role="radio" aria-checked="' + on + '"') + ' data-pin="' + o[0] + '" aria-label="' + o[2] + (tog && on ? ". Tap again to clear" : "") + '" title="' + o[2] + (tog && on ? " (tap again to clear)" : "") + '">' + o[1] + "</button>";
    }).join("") + "</div>";
  }
  function clockButton() {
    return '<button type="button" class="tog' + (state.clock ? " is-on" : "") + '" id="clock" aria-pressed="' + state.clock + '" aria-label="Use by, soonest first" title="Use by, soonest first: ' + (state.clock ? "on" : "off") + '">' + (state.clock ? IC.clockOn : IC.clock) + "</button>";
  }

  function render() {
    var view = state.pin, isCat = view === "cat", sel = isCat ? state.cat : state.area;
    var flat = state.clock || !view;

    // title row
    var head = CLEAR === "title" && view
      ? '<button type="button" class="titlechip" id="clearchip" aria-label="' + PIN_NAME[view] + ". Tap to clear the " + PIN_NAME[view].toLowerCase() + ' view"><span>' + PIN_NAME[view] + '</span><span class="x" aria-hidden="true">' + IC.close + "</span></button>"
      : '<b id="title">' + titleText() + "</b>";
    $("#titlerow").innerHTML = head + '<div class="ctl">' + pinSwitch() + clockButton() + "</div>";

    // ribbon: only when Location or Category is on
    if (!view) $("#tabs").innerHTML = "";
    else {
      var vals = isCat
        ? Array.from(new Set(ITEMS.map(function (i) { return i.category; }))).sort()
        : Array.from(new Set(ITEMS.map(function (i) { return i.area; }))).sort(areaCmp);
      var clear = CLEAR === "ribbon" ? '<button type="button" class="clearpill" id="clearpill" aria-label="Clear the ' + PIN_NAME[view].toLowerCase() + ' view">' + IC.close + "<span>Clear</span></button>" : "";
      $("#tabs").innerHTML = '<nav class="tabs" aria-label="' + PIN_NAME[view] + '">' + clear + '<a href="#" data-tab="" ' + (sel === "" ? 'aria-current="page"' : "") + ' draggable="false">All</a>' +
        vals.map(function (v) { return '<a href="#" data-tab="' + esc(v) + '" ' + (v === sel ? 'aria-current="page"' : "") + ' draggable="false">' + esc(v) + "</a>"; }).join("") + "</nav>";
    }

    // list
    var shown = ITEMS.filter(function (i) { return !sel || (isCat ? i.category : i.area) === sel; });
    var html;
    if (!shown.length) html = '<p class="empty">Nothing here.</p>';
    else if (flat) {
      html = '<ul class="rows" data-flat>' + shown.slice().sort(state.clock ? byUseBy : byName).map(function (i) { return rowHtml(i, true); }).join("") + "</ul>";
    } else {
      var map = {};
      shown.forEach(function (i) { var k = isCat ? i.category : i.area; (map[k] = map[k] || []).push(i); });
      html = Object.keys(map).sort(isCat ? undefined : areaCmp).map(function (k) {
        var l = map[k].slice().sort(byName);
        return '<section class="group"><div class="grouphead"><h2>' + esc(k) + '</h2><span class="count">' + l.length + '</span></div><ul class="rows">' + l.map(function (i) { return rowHtml(i, false); }).join("") + "</ul></section>";
      }).join("");
    }
    $("#list").innerHTML = html;
  }

  function clearPin() { state.pin = ""; state.area = ""; state.cat = ""; render(); toast("Location and Category cleared"); }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("a[data-tab]");
    if (t) { e.preventDefault(); var keep = $("nav.tabs").scrollLeft; if (state.pin === "cat") state.cat = t.getAttribute("data-tab"); else state.area = t.getAttribute("data-tab"); render(); $("nav.tabs").scrollLeft = keep; return; }
    if (e.target.closest("a.rowlink, a[href='#']")) { e.preventDefault(); return; }
    if (e.target.closest("#clock")) { state.clock = !state.clock; render(); toast(state.clock ? "Use by, soonest first: on" : "Use by: off"); return; }
    if (e.target.closest("#clearchip, #clearpill")) { clearPin(); return; }
    var b = e.target.closest("#pinsw button");
    if (b) {
      var k = b.getAttribute("data-pin");
      if (state.pin === k) { if (CLEAR === "tap") clearPin(); return; }   // tapping the lit icon again clears it (variation 1 only)
      state.pin = k; render();
    }
  });

  $("#hdr").innerHTML = '<button type="button" class="icon" aria-label="Profile" title="Profile">' + IC.person + '</button><button type="button" class="icon" aria-label="Search" title="Search">' + IC.search + "</button>";
  $("#dock").innerHTML = '<button type="button" class="icon" aria-label="Add an item" title="Add an item">' + IC.plus + '</button><button type="button" class="icon" aria-label="Copy shopping list" title="Copy shopping list">' + IC.cart + '</button><button type="button" class="icon" aria-label="Copy kitchen list" title="Copy kitchen list">' + IC.list + "</button>";
  render();
})();
