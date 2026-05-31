/* =========================================================
   Anchor Scaffold MCP — landing interactivity
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- nav: shadow on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- copy buttons (clipboard) ---------- */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  function flashCopied(btn) {
    btn.classList.add("copied");
    var prev = btn.getAttribute("aria-label") || "";
    btn.setAttribute("aria-label", "Copied!");
    window.setTimeout(function () {
      btn.classList.remove("copied");
      if (prev) btn.setAttribute("aria-label", prev);
    }, 1600);
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { flashCopied(btn); },
          function () { fallbackCopy(text); flashCopied(btn); }
        );
      } else {
        fallbackCopy(text);
        flashCopied(btn);
      }
    });
  });

  /* ---------- tabs (before / after) ---------- */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".tab-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
      });
    });
  });

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- animated terminal ---------- */
  var termBody = document.getElementById("term-body");
  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Script of lines. type=user lines are "typed" char by char.
  var script = [
    { t: "user", html: '<span class="t-prompt">$</span> <span class="t-cmd">anchor-scaffold gen-ts-client --idl target/idl/escrow.json</span>' },
    { t: "out", delay: 380, html: '<span class="t-dim">→ reading IDL…</span>' },
    { t: "out", delay: 280, html: '<span class="t-ok">✓</span> Parsed IDL  <span class="t-dim">(4 instructions, 2 accounts)</span>' },
    { t: "out", delay: 300, html: '<span class="t-ok">✓</span> Generated typed instruction callers' },
    { t: "out", delay: 300, html: '<span class="t-ok">✓</span> Generated PDA helpers + account fetchers' },
    { t: "out", delay: 320, html: '<span class="t-ok">✓</span> Wrote <span class="t-str">app/src/client/escrow.ts</span>  <span class="t-dim">(cache hit · 91% cheaper)</span>' },
    { t: "blank", delay: 360 },
    { t: "out", delay: 0, html: '<span class="t-comment">// then in your app:</span>' },
    { t: "out", delay: 220, html: '<span class="t-key">const</span> client = <span class="t-key">new</span> <span class="t-fn">EscrowClient</span>(program);' },
    { t: "out", delay: 260, html: '<span class="t-key">await</span> client.<span class="t-fn">initialize</span>({ maker, seed, amount });' },
    { t: "out", delay: 260, html: '<span class="t-key">const</span> escrow = <span class="t-key">await</span> client.<span class="t-fn">fetchEscrow</span>(maker, seed);' }
  ];

  function makeCursor() {
    var c = document.createElement("span");
    c.className = "term__cursor";
    return c;
  }

  function renderStatic() {
    if (!termBody) return;
    var html = "";
    script.forEach(function (line) {
      if (line.t === "blank") html += "\n";
      else html += line.html + "\n";
    });
    termBody.innerHTML = html;
  }

  function typeLine(line, done) {
    // For user lines we simulate typing the visible command text.
    var prompt = '<span class="t-prompt">$</span> ';
    var fullCmd = line.html.replace(/<[^>]+>/g, "");
    var cmdText = fullCmd.replace(/^\$\s*/, "");
    var lineEl = document.createElement("div");
    termBody.appendChild(lineEl);
    var cursor = makeCursor();
    var i = 0;
    function step() {
      lineEl.innerHTML = prompt + '<span class="t-cmd">' + cmdText.slice(0, i) + "</span>";
      lineEl.appendChild(cursor);
      i++;
      if (i <= cmdText.length) {
        window.setTimeout(step, 26 + Math.random() * 34);
      } else {
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        window.setTimeout(done, 260);
      }
    }
    step();
  }

  function appendLine(line, done) {
    var el = document.createElement("div");
    if (line.t === "blank") {
      el.innerHTML = "&nbsp;";
    } else {
      el.innerHTML = line.html;
    }
    termBody.appendChild(el);
    window.setTimeout(done, line.delay || 0);
  }

  function runTerminal() {
    if (!termBody) return;
    termBody.innerHTML = "";
    var idx = 0;
    function next() {
      if (idx >= script.length) {
        // trailing blinking cursor
        var tail = document.createElement("div");
        tail.innerHTML = '<span class="t-prompt">$</span> ';
        tail.appendChild(makeCursor());
        termBody.appendChild(tail);
        return;
      }
      var line = script[idx++];
      if (line.t === "user") typeLine(line, next);
      else appendLine(line, next);
    }
    next();
  }

  if (termBody) {
    if (prefersReduced) {
      renderStatic();
    } else if ("IntersectionObserver" in window) {
      var started = false;
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true;
            runTerminal();
            tio.disconnect();
          }
        });
      }, { threshold: 0.4 });
      tio.observe(termBody);
    } else {
      runTerminal();
    }
  }
})();
