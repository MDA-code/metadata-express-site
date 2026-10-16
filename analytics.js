// Anonymous visit and click counts for Metadata Express.
// No cookies; nothing that identifies you is stored.
(function () {
  var URL_ = "https://metadata-express-license.metadata-express-license.workers.dev/hit";

  function send(data) {
    try {
      var body = new Blob([JSON.stringify(data)], { type: "text/plain" });
      if (!(navigator.sendBeacon && navigator.sendBeacon(URL_, body))) {
        fetch(URL_, { method: "POST", body: body, keepalive: true, mode: "no-cors" });
      }
    } catch (e) {}
  }

  var page = location.pathname.replace(/^.*\/metadata-express-site/, "") || "/";
  if (page === "" || page.endsWith("/")) page += "index.html";

  send({ page: page.replace(/^\//, ""), ref: document.referrer });

  window.mxTrack = function (event) { send({ event: event }); };

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (link.dataset.checkout) send({ event: "subscribe_" + link.dataset.checkout });
    else if (href.indexOf("/releases/latest/download/") !== -1) {
      // Every installer counts as a download, and which one is kept too.
      var kind = (href.indexOf(".exe") !== -1 ? "windows" : "mac") + (href.indexOf("NoAI") !== -1 ? "_noai" : "");
      send({ event: "download" });
      send({ event: "download_" + kind });
    }
    else if (href.indexOf("billing.stripe.com") !== -1) send({ event: "manage_subscription" });
  }, true);
})();
