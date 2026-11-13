// Small helpers for the pages: screenshots open large, and a phone gets
// a way to send the download link to a computer.
(function () {
  // Screenshots: click or tap to see one at a readable size (drag to
  // look around on a phone), click again or press Esc to close.
  var shots = document.querySelectorAll("picture img");
  Array.prototype.forEach.call(shots, function (img) {
    if ((img.getAttribute("width") || 0) < 700) return;
    img.classList.add("zoomable");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", (img.alt || "Screenshot") + " (open larger)");
    function open() {
      var view = document.createElement("div");
      view.className = "zoom-view";
      var big = document.createElement("img");
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      var close = document.createElement("button");
      close.className = "zoom-close";
      close.setAttribute("aria-label", "Close");
      close.textContent = "×";
      view.appendChild(big);
      view.appendChild(close);
      if (window.innerWidth < 1100) {
        var hint = document.createElement("div");
        hint.className = "zoom-hint";
        hint.textContent = "Drag to look around";
        view.appendChild(hint);
      }
      function shut() {
        view.remove();
        document.removeEventListener("keydown", key);
        document.documentElement.style.overflow = "";
      }
      function key(e) { if (e.key === "Escape") shut(); }
      var moved = false;
      view.addEventListener("scroll", function () { moved = true; });
      view.addEventListener("pointerdown", function () { moved = false; });
      view.addEventListener("click", function (e) { if (e.target === close || !moved) shut(); });
      document.addEventListener("keydown", key);
      document.documentElement.style.overflow = "hidden";
      document.body.appendChild(view);
    }
    img.addEventListener("click", open);
    img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });

  // Phones can't install the app: offer to send the link to a computer.
  var cta = document.querySelector(".phone-cta");
  if (cta && /iPhone|iPod|Android.*Mobile|Windows Phone/i.test(navigator.userAgent)) {
    cta.hidden = false;
    var buttons = document.querySelector(".hero .wrap > .ctas");
    if (buttons) buttons.hidden = true;
    var share = document.getElementById("phone-share");
    if (share && navigator.share) {
      share.hidden = false;
      share.addEventListener("click", function () {
        navigator.share({ title: "Metadata Express", text: "Metadata Express: download it on a Mac or Windows computer", url: "https://metadataexpress.com/#download" }).catch(function () {});
      });
    }
  }
})();
