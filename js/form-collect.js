/**
 * Sammelt Formularwerte als strukturiertes, auswertbares JSON.
 * Meta + flaches answers-Objekt mit stabilen Feld-IDs.
 */
var FormCollect = (function () {
  var FORM_VERSION = "2.0.0";

  var TEXT_FIELDS = [
    "vorname",
    "name",
    "email",
    "telefon",
    "unternehmen_branche",
    "land",
    "wohnsitz",
    "adresse",
    "website",
    "linkedin",
    "motivation_warum",
    "motivation_zeitpunkt_herausforderungen",
    "haltung_beschreibung",
    "haltung_ethik",
    "rolle",
    "mitarbeitende",
    "ki_als_anders",
    "erfahrung_ki_prozesse",
    "erfahrung_formate",
    "passung_ambivalenz",
    "passung_meinungen",
    "sonstiges",
    "datenschutz_zeitpunkt"
  ];

  var RADIO_FIELDS = [
    "skala_austausch",
    "erfahrung_ki_stufe",
    "passung_oeffnen",
    "skala_vertraulichkeit",
    "verbindlich_6_monate",
    "praesenz_darmstadt"
  ];

  function valueOf(form, name) {
    var el = form.elements.namedItem(name);
    if (!el) return "";
    if (typeof el.length === "number" && el[0] && el[0].type === "radio") {
      for (var i = 0; i < el.length; i++) {
        if (el[i].checked) return el[i].value;
      }
      return "";
    }
    return el.value != null ? String(el.value).trim() : "";
  }

  function checkboxValues(form, name) {
    var nodes = form.querySelectorAll('input[type="checkbox"][name="' + name + '"]');
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].checked) out.push(nodes[i].value);
    }
    return out;
  }

  function collect(form) {
    var answers = {};
    var i;

    for (i = 0; i < TEXT_FIELDS.length; i++) {
      answers[TEXT_FIELDS[i]] = valueOf(form, TEXT_FIELDS[i]);
    }

    for (i = 0; i < RADIO_FIELDS.length; i++) {
      var key = RADIO_FIELDS[i];
      var raw = valueOf(form, key);
      if (key.indexOf("skala_") === 0) {
        answers[key] = raw === "" ? null : Number(raw);
      } else {
        answers[key] = raw;
      }
    }

    answers.ki_als = checkboxValues(form, "ki_als");
    answers.datenschutz_einwilligung = form.elements.namedItem("datenschutz_einwilligung")
      ? (form.elements.namedItem("datenschutz_einwilligung").checked ? "ja" : "")
      : "";

    return {
      meta: {
        formVersion: FORM_VERSION,
        submittedAt: new Date().toISOString(),
        source: "ki-salon-interviewbogen"
      },
      answers: answers
    };
  }

  /** Flache Map für Dienste, die keine verschachtelten Objekte mögen (z. B. Formspree). */
  function flatten(payload) {
    var flat = {
      _formVersion: payload.meta.formVersion,
      _submittedAt: payload.meta.submittedAt,
      _source: payload.meta.source
    };
    var answers = payload.answers;
    var keys = Object.keys(answers);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = answers[k];
      flat[k] = Array.isArray(v) ? v.join(", ") : v == null ? "" : v;
    }
    return flat;
  }

  return {
    FORM_VERSION: FORM_VERSION,
    collect: collect,
    flatten: flatten
  };
})();
