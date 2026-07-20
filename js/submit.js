/**
 * Versand-Adapter – EINZIGER Ort für die Submit-Logik.
 *
 * Aktuell: Netlify Forms (Hosting auf Netlify).
 * Einsendungen erscheinen unter Site → Forms.
 * E-Mail-Benachrichtigungen in Netlify einrichten
 * (z. B. Susanne@SusanneVolkwein.de und Frank@FrankVullhorst.de).
 *
 * Andere Backends: nur diese Datei anpassen. HTML/CSS möglichst unverändert lassen
 * (Netlify braucht data-netlify am Formular; das kann bei einem Wechsel entfernt werden).
 * Erwartete Signatur: submitAnswers(payload) → Promise
 * payload = { meta: {...}, answers: {...} } von FormCollect.collect()
 */
var FormSubmit = (function () {
  var FORM_NAME = "interviewbogen";

  /** true = auf Netlify absenden; false = nur lokaler Demo-Modus */
  var USE_NETLIFY = true;

  function isLocalFile() {
    return window.location.protocol === "file:";
  }

  function submitViaNetlify(payload) {
    var flat = FormCollect.flatten(payload);
    flat["form-name"] = FORM_NAME;
    flat["bot-field"] = "";
    flat._payload_json = JSON.stringify(payload);

    var body = new URLSearchParams();
    var keys = Object.keys(flat);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = flat[k];
      body.append(k, v == null ? "" : String(v));
    }

    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    }).then(function (res) {
      if (res.ok) return {};
      throw new Error("Netlify Forms antwortete mit Status " + res.status);
    });
  }

  /**
   * Demo lokal (file:// oder USE_NETLIFY = false):
   * speichert die letzte Einsendung nur im Browser.
   */
  function submitDemo(payload) {
    return new Promise(function (resolve) {
      try {
        localStorage.setItem(
          "ki-salon-fragebogen-last-submit",
          JSON.stringify(payload)
        );
      } catch (e) {
        /* ignore */
      }
      console.info("[KI-Salon] Demo-Submit (kein Netlify-Versand):", payload);
      setTimeout(resolve, 350);
    });
  }

  function submitAnswers(payload) {
    if (USE_NETLIFY && !isLocalFile()) {
      return submitViaNetlify(payload);
    }
    return submitDemo(payload);
  }

  return {
    submitAnswers: submitAnswers,
    isConfigured: USE_NETLIFY
  };
})();
