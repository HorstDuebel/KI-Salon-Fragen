/**
 * Abhängige Freitextfelder bei Checkbox/Radio-Optionen.
 * Trigger tragen data-target="zielFeldId" am Input.
 */
var FormChoices = (function () {
  function getTarget(form, trigger) {
    var id = trigger.getAttribute("data-target");
    if (!id) return null;
    return form.querySelector("#" + id) || form.elements.namedItem(id);
  }

  function isActive(trigger) {
    if (trigger.type === "checkbox") return trigger.checked;
    if (trigger.type === "radio") return trigger.checked;
    return false;
  }

  function syncPair(form, trigger, shouldFocus) {
    var target = getTarget(form, trigger);
    if (!target) return;

    var active = isActive(trigger);
    target.disabled = !active;
    target.tabIndex = active ? 0 : -1;

    if (!active) {
      target.value = "";
      target.classList.remove("field-invalid");
    } else if (shouldFocus && document.activeElement !== target) {
      target.focus();
    }
  }

  function syncAll(form) {
    var triggers = form.querySelectorAll("[data-target]");
    for (var i = 0; i < triggers.length; i++) {
      syncPair(form, triggers[i], false);
    }
  }

  function init(form) {
    syncAll(form);

    form.addEventListener("change", function (event) {
      var el = event.target;
      if (!el || !el.getAttribute || !el.getAttribute("data-target")) return;
      syncPair(form, el, true);

      if (el.type === "radio" && el.name) {
        var group = form.querySelectorAll('input[type="radio"][name="' + el.name + '"][data-target]');
        for (var i = 0; i < group.length; i++) {
          if (group[i] !== el) syncPair(form, group[i], false);
        }
      }
    });
  }

  return {
    init: init,
    syncAll: syncAll
  };
})();
