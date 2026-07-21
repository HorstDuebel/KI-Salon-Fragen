/**
 * Clientseitige Validierung der Pflichtfelder.
 */
var FormValidate = (function () {
  var REQUIRED_TEXT = [
    { name: "vorname", label: "Vorname" },
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "unternehmen_branche", label: "Unternehmen / Branche" },
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
          message: "Bitte fülle das Pflichtfeld „" + item.label + "“ aus.",
          focusEl: el
        };
      }

      if (item.name === "email" && !isValidEmail(value)) {
        markInvalid(el);
        return {
          ok: false,
          message: "Bitte gib eine gültige E-Mail-Adresse ein.",
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
          message: "Bitte gib an, was Du unter „etwas ganz anderes“ meinst.",
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
          message: "Bitte gib an, in welchen Prozessen KI bereits eingesetzt wird.",
          focusEl: prozesse
        };
      }
    }

    var ds = form.elements.namedItem("datenschutz_einwilligung");
    if (!ds || !ds.checked) {
      return {
        ok: false,
        message: "Bitte bestätige die Datenschutzvereinbarung.",
        focusEl: ds
      };
    }

    return { ok: true };
  }

  return {
    validate: validate
  };
})();
