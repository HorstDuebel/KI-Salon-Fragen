# KI-Salon Interviewbogen

Statische Webseite für den Interviewbogen von Susanne Volkwein und Frank Vullhorst. Interessierte füllen den Bogen im Browser aus; Eingaben werden lokal zwischengespeichert und beim Absenden als strukturiertes JSON versendet.

## Dateien

```
index.html              # Seite und Formular
css/styles.css          # Design (PDF-Farben, Mobile)
js/form-persist.js      # localStorage-Entwurf
js/form-collect.js      # Formular → JSON
js/form-validate.js     # Pflichtfelder
js/submit.js            # Versand-Adapter (Formspree)
```

Kein Build, kein Framework. Seite lokal öffnen oder auf Netlify / GitHub Pages / beliebigem Host ablegen.

## Lokal testen

`index.html` im Browser öffnen oder einen einfachen Server starten:

```bash
npx --yes serve .
```

Ohne konfigurierten Formspree-Endpoint läuft ein **Demo-Modus**: Absenden zeigt „Geschafft!“, die Daten landen in der Konsole und unter `localStorage`-Key `ki-salon-fragebogen-last-submit`.

## Zwischenspeicherung

Beim Tippen und beim Verlassen der Seite werden alle Felder unter dem Key `ki-salon-fragebogen-v1` im Browser des Anwenders gespeichert. Nach erfolgreichem Absenden wird der Entwurf gelöscht.

## Formspree einrichten (Produktion)

1. Account auf [formspree.io](https://formspree.io) anlegen und ein neues Formular erstellen.
2. In `js/submit.js` den Platzhalter ersetzen:

```js
var FORMSPREE_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
```

3. Einsendungen erscheinen im Formspree-Dashboard; CSV-Export für Sortierung und Auswertung nutzen.

Jedes Feld hat eine stabile ID (`vorname`, `skala_austausch`, `ki_als`, …). Zusätzlich wird `_payload_json` mit dem vollständigen verschachtelten Objekt mitgeschickt.

## Adapter wechseln (ohne HTML/CSS)

Nur `js/submit.js` anpassen. Die Funktion muss diese Signatur behalten:

```js
FormSubmit.submitAnswers(payload)  // → Promise
// payload = { meta: { formVersion, submittedAt, source }, answers: { ... } }
```

Hilfreich: `FormCollect.flatten(payload)` liefert eine flache Map (eine Spalte pro Feld), geeignet für Formspree, Netlify Forms oder Tabellen.

Beispiele für Alternativen:

- **Netlify Forms** – `fetch` auf die Seite mit `application/x-www-form-urlencoded` und `form-name`
- **Formbricks / eigenes API** – `fetch(url, { method: "POST", body: JSON.stringify(payload) })`
- **Mail-Skript** – POST an PHP/Node-Endpoint, der eine E-Mail baut

## Feldliste (Auswertung)

| ID | Bedeutung |
|----|-----------|
| `vorname`, `name`, `email`, `telefon` | Kontaktdaten |
| `unternehmen_branche`, `land`, `wohnsitz`, `adresse`, `website`, `linkedin` | Kontext |
| `motivation_*` | Motivationstexte |
| `skala_austausch` | 1–10 |
| `haltung_*`, `ki_als` | Haltung (Mehrfachauswahl als Liste / CSV) |
| `rolle`, `mitarbeitende`, `erfahrung_*` | Erfahrung |
| `passung_*`, `skala_vertraulichkeit` | Passung |
| `verbindlich_6_monate`, `praesenz_darmstadt` | ja/nein |
| `budget`, `sonstiges` | Rahmendaten |
| `datenschutz` | true/false |

## Design

Farben und Aufbau folgen dem PDF-Fragebogen. Schrift: Calibri wo installiert, sonst Source Sans 3 (Google Fonts).
