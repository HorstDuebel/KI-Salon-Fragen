/**
 * E-Mail-Links im Footer: Adressen codiert im HTML (Base64),
 * sichtbar für Besucher nach dem Laden, mailto erst bei Interaktion.
 *
 * Reduziert automatisches Auslesen durch einfache Bots – kein vollständiger Spam-Schutz.
 */
(function () {
  function decode(value) {
    if (!value) return "";
    try {
      return atob(value);
    } catch (e) {
      return "";
    }
  }

  function revealAddress(link) {
    var address = decode(link.getAttribute("data-e"));
    if (!address) return "";
    link.textContent = address;
    return address;
  }

  function setMailto(link, address) {
    if (!address || link.getAttribute("data-mailto-ready") === "true") return;
    link.href = "mailto:" + address;
    link.setAttribute("data-mailto-ready", "true");
  }

  function initEmailLinks() {
    var links = document.querySelectorAll(".email-link[data-e]");
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        link.href = "#";
        link.setAttribute("rel", "nofollow");
        var address = revealAddress(link);

        link.addEventListener("click", function (event) {
          var addr = decode(link.getAttribute("data-e"));
          if (!addr) return;
          event.preventDefault();
          setMailto(link, addr);
          window.location.href = "mailto:" + addr;
        });

        link.addEventListener("mouseenter", function () {
          setMailto(link, decode(link.getAttribute("data-e")));
        });

        link.addEventListener("focus", function () {
          setMailto(link, decode(link.getAttribute("data-e")));
        });
      })(links[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEmailLinks);
  } else {
    initEmailLinks();
  }
})();
