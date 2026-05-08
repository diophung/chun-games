/* WiGa shared chrome helpers — loaded by every chrome page (not games). */
(function () {
  "use strict";

  function markActiveNavLink() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;
    var path = window.location.pathname.replace(/\/+$/, "");
    if (path === "" || /\/$/.test(window.location.pathname)) path += "/index.html";
    var current = path.split("/").pop() || "index.html";

    var links = nav.querySelectorAll(".site-nav__link");
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute("href") || "").split("/").pop();
      if (href === current) {
        links[i].classList.add("is-active");
        links[i].setAttribute("aria-current", "page");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markActiveNavLink);
  } else {
    markActiveNavLink();
  }
})();
