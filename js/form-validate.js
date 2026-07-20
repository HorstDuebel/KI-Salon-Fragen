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

    var ds = form.elements.namedItem("datenschutz");
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
