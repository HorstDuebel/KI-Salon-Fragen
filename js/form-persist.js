/**
 * Zwischenspeicherung der Formulareingaben in localStorage.
 * Key ist versionsiert, damit alte Entwürfe bei Schema-Änderungen ignoriert werden können.
 */
var FormPersist = (function () {
  var STORAGE_KEY = "ki-salon-fragebogen-v2";
  var DEBOUNCE_MS = 400;
  var formEl = null;
  var timer = null;
  var onSaved = null;

  function getFormData(form) {
    var data = {};
    var elements = form.elements;

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (!el.name || el.disabled) continue;
      if (el.type === "submit" || el.type === "button" || el.type === "reset") continue;

      if (el.type === "checkbox") {
        if (!Object.prototype.hasOwnProperty.call(data, el.name)) {
          data[el.name] = [];
        }
        if (el.checked) {
          data[el.name].push(el.value);
        }
      } else if (el.type === "radio") {
        if (el.checked) {
          data[el.name] = el.value;
        } else if (!Object.prototype.hasOwnProperty.call(data, el.name)) {
          data[el.name] = "";
        }
      } else {
        data[el.name] = el.value;
      }
    }

    // Einzel-Checkbox (Datenschutz): als Bool speichern, falls nur ein Wert
    if (Array.isArray(data.datenschutz_einwilligung)) {
      data.datenschutz_einwilligung = data.datenschutz_einwilligung.indexOf("ja") !== -1;
    }

    return data;
  }

  function applyFormData(form, data) {
    if (!data || typeof data !== "object") return;

    var names = Object.keys(data);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var value = data[name];
      var fields = form.querySelectorAll('[name="' + name + '"]');
      if (!fields.length) continue;

      var first = fields[0];

      if (first.type === "checkbox") {
        var selected = Array.isArray(value)
          ? value
          : value === true || value === "ja"
            ? ["ja"]
            : typeof value === "string" && value
              ? [value]
              : [];
        for (var c = 0; c < fields.length; c++) {
          fields[c].checked = selected.indexOf(fields[c].value) !== -1;
        }
      } else if (first.type === "radio") {
        for (var r = 0; r < fields.length; r++) {
          fields[r].checked = fields[r].value === String(value);
        }
      } else {
        first.value = value == null ? "" : String(value);
      }
    }
  }

  function save() {
    if (!formEl) return;
    try {
      var payload = {
        savedAt: new Date().toISOString(),
        values: getFormData(formEl)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      if (typeof onSaved === "function") onSaved();
    } catch (e) {
      // Quota / privater Modus – still weitermachen
    }
  }

  function scheduleSave() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(save, DEBOUNCE_MS);
  }

  function load() {
    if (!formEl) return;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      applyFormData(formEl, parsed.values || parsed);
    } catch (e) {
      // defekte Daten ignorieren
    }
  }

  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  function init(form, options) {
    formEl = form;
    onSaved = options && options.onSaved;
    var onLoaded = options && options.onLoaded;

    load();
    if (typeof onLoaded === "function") onLoaded();

    form.addEventListener("input", scheduleSave);
    form.addEventListener("change", scheduleSave);

    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") save();
    });
  }

  return {
    init: init,
    save: save,
    load: load,
    clear: clear,
    STORAGE_KEY: STORAGE_KEY
  };
})();
