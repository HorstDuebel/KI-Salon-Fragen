/**
 * Versand-Adapter – EINZIGER Ort für die Submit-Logik.
 *
 * Aktuell: Formspree.
 * Endpoint in FORMSPREE_ENDPOINT eintragen (z. B. https://formspree.io/f/xxxxxxxx).
 * Solange der Platzhalter steht, läuft ein lokaler Demo-Modus (kein echter Versand),
 * damit die Seite ohne Account testbar bleibt.
 *
 * Andere Backends: nur diese Datei anpassen. HTML/CSS unverändert lassen.
 * Erwartete Signatur: submitAnswers(payload) → Promise
 * payload = { meta: {...}, answers: {...} } von FormCollect.collect()
 */
var FormSubmit = (function () {
  // <<< Hier Formspree-Form-ID eintragen >>>
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

  var isConfigured =
    FORMSPREE_ENDPOINT.indexOf("YOUR_FORM_ID") === -1 &&
    FORMSPREE_ENDPOINT.indexOf("formspree.io") !== -1;

  function submitViaFormspree(payload) {
    var body = FormCollect.flatten(payload);
    // Zusätzlich volles JSON für flexible Auswertung
    body._payload_json = JSON.stringify(payload);

    return fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (res.ok) return res.json().catch(function () {
        return {};
      });
      return res.json().catch(function () {
        return {};
      }).then(function (data) {
        var msg =
          (data && data.error) ||
          (data && data.errors && data.errors.map(function (e) {
            return e.message;
          }).join(" ")) ||
          "Server antwortete mit Status " + res.status;
        throw new Error(msg);
      });
    });
  }

  /**
   * Demo ohne konfigurierten Endpoint: speichert die letzte Einsendung lokal
   * (nur zum Testen; keine zentrale Auswertung).
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
      console.info("[KI-Salon] Demo-Submit (kein Formspree-Endpoint gesetzt):", payload);
      setTimeout(resolve, 350);
    });
  }

  function submitAnswers(payload) {
    if (isConfigured) {
      return submitViaFormspree(payload);
    }
    return submitDemo(payload);
  }

  return {
    submitAnswers: submitAnswers,
    isConfigured: isConfigured
  };
})();
