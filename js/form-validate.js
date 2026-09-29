/**
 * Clientseitige Validierung der Pflichtfelder.
 */
var FormValidate = (function () {
  var REQUIRED_TEXT = [
    { name: "vorname", label: "Vorname" },
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "unternehmen_branche", label: "Unternehmen / Branche" },
    { name: "strasse", label: "Straße" },
    { name: "plz_wohnort", label: "PLZ / Wohnsitz" },
    { name: "land", label: "Land" }
  ];

  function clearInvalid(form) {
    var invalids = form.querySelectorAll(".field-invalid");
    for (var i = 0; i < invalids.length; i++) {
      invalids[i].classList.remove("field-invalid");
    }
  }

  function markInvalid(el) {
    if (el) el.classList.add("field-invalid");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isChecked(form, name, value) {
    var nodes = form.querySelectorAll('input[name="' + name + '"]');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].checked && nodes[i].value === value) return true;
    }
    return false;
  }

  function validate(form) {
    clearInvalid(form);

    for (var i = 0; i < REQUIRED_TEXT.length; i++) {
      var item = REQUIRED_TEXT[i];
      var el = form.elements.namedItem(item.name);
      var value = el && el.value ? String(el.value).trim() : "";

      if (!value) {
        markInvalid(el);
        return {
          ok: false,
          message: "Bitte füllen Sie das Pflichtfeld „" + item.label + "“ aus.",
          focusEl: el
        };
      }

      if (item.name === "email" && !isValidEmail(value)) {
        markInvalid(el);
        return {
          ok: false,
          message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
          focusEl: el
        };
      }
    }

    if (isChecked(form, "ki_als", "etwas_ganz_anderes")) {
      var kiAnders = form.elements.namedItem("ki_als_anders");
      var kiAndersValue = kiAnders && kiAnders.value ? String(kiAnders.value).trim() : "";
      if (!kiAndersValue) {
        markInvalid(kiAnders);
        return {
          ok: false,
          message: "Bitte geben Sie an, was Sie unter „etwas ganz anderes“ meinen.",
          focusEl: kiAnders
        };
      }
    }

    var erfahrungStufe = form.elements.namedItem("erfahrung_ki_stufe");
    var erfahrungSelected = "";
    if (erfahrungStufe && typeof erfahrungStufe.length === "number") {
      for (var r = 0; r < erfahrungStufe.length; r++) {
        if (erfahrungStufe[r].checked) {
          erfahrungSelected = erfahrungStufe[r].value;
          break;
        }
      }
    }

    if (erfahrungSelected === "teil_prozesse") {
      var prozesse = form.elements.namedItem("erfahrung_ki_prozesse");
      var prozesseValue = prozesse && prozesse.value ? String(prozesse.value).trim() : "";
      if (!prozesseValue) {
        markInvalid(prozesse);
        return {
          ok: false,
          message: "Bitte geben Sie an, in welchen Prozessen KI bereits eingesetzt wird.",
          focusEl: prozesse
        };
      }
    }

    var terminZusagen = form.elements.namedItem("termin_zusagen");
    var terminSelected = "";
    if (terminZusagen && typeof terminZusagen.length === "number") {
      for (var t = 0; t < terminZusagen.length; t++) {
        if (terminZusagen[t].checked) {
          terminSelected = terminZusagen[t].value;
          break;
        }
      }
    }
    if (!terminSelected) {
      var terminFieldset = form.querySelector('input[name="termin_zusagen"]');
      markInvalid(terminFieldset);
      return {
        ok: false,
        message: "Bitte geben Sie an, ob Sie die sechs Termine verbindlich einplanen können.",
        focusEl: terminFieldset
      };
    }
    if (terminSelected === "einschraenkungen") {
      var einschraenkungen = form.elements.namedItem("termin_einschraenkungen");
      var einschraenkungenValue = einschraenkungen && einschraenkungen.value
        ? String(einschraenkungen.value).trim()
        : "";
      if (!einschraenkungenValue) {
        markInvalid(einschraenkungen);
        return {
          ok: false,
          message: "Bitte nennen Sie die Termine, bei denen Sie Einschränkungen haben.",
          focusEl: einschraenkungen
        };
      }
    }

    var ds = form.elements.namedItem("datenschutz_einwilligung");
    if (!ds || !ds.checked) {
      return {
        ok: false,
        message: "Bitte bestätigen Sie die Datenschutzvereinbarung.",
        focusEl: ds
      };
    }

    return { ok: true };
  }

  return {
    validate: validate
  };
})();
