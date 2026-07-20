# KI-Salon Interviewbogen

Statische Webseite für den Interviewbogen von Susanne Volkwein und Frank Vullhorst. Interessierte füllen den Bogen im Browser aus; Eingaben werden lokal zwischengespeichert und beim Absenden über **Netlify Forms** gespeichert.

## Dateien

```
index.html              # Seite und Formular
css/styles.css          # Design (PDF-Farben, Mobile)
js/form-persist.js      # localStorage-Entwurf
js/form-collect.js      # Formular → JSON
js/form-validate.js     # Pflichtfelder
js/submit.js            # Versand-Adapter (Netlify Forms)
```

Kein Build, kein Framework. Hosting: Netlify (an GitHub angebunden).

## Lokal testen

`index.html` im Browser öffnen oder:

```bash
npx --yes serve .
```

Lokal (`file://` oder ohne Netlify) läuft ein **Demo-Modus**: Absenden zeigt „Geschafft!“, Daten in der Konsole / `localStorage` (`ki-salon-fragebogen-last-submit`). Echte Einsendungen nur über die Netlify-URL.

## Zwischenspeicherung

Beim Tippen und beim Verlassen der Seite: Key `ki-salon-fragebogen-v1` im Browser. Nach erfolgreichem Absenden wird der Entwurf gelöscht.

## E-Mail-Benachrichtigungen (Netlify)

Damit Susanne und Frank bei jedem Absenden eine Mail bekommen:

1. [Netlify](https://app.netlify.com) → Site **KI-Salon-Fragen** öffnen  
2. **Forms** (oder Site configuration → Forms)  
3. **Form notifications** → **Add notification** → **Email notification**  
4. Zwei Benachrichtigungen anlegen (oder eine mit Weiterleitung):
   - `Susanne@SusanneVolkwein.de`
   - `Frank@FrankVullhorst.de`  
5. Formular: `interviewbogen`, Event: **New form submission**

Einsendungen liegen auch unter **Forms** im Dashboard (Export/CSV für Auswertung).

## Adapter wechseln

Nur `js/submit.js` anpassen. Signatur:

```js
FormSubmit.submitAnswers(payload)  // → Promise
// payload = { meta: { formVersion, submittedAt, source }, answers: { ... } }
```

`FormCollect.flatten(payload)` liefert eine flache Map (eine Spalte pro Feld).

## Feldliste (Auswertung)

| ID | Bedeutung |
|----|-----------|
| `vorname`, `name`, `email`, `telefon` | Kontaktdaten |
| `unternehmen_branche`, `land`, `wohnsitz`, `adresse`, `website`, `linkedin` | Kontext |
| `motivation_*` | Motivationstexte |
| `skala_austausch` | 1–10 |
| `haltung_*`, `ki_als` | Haltung (Mehrfachauswahl) |
| `rolle`, `mitarbeitende`, `erfahrung_*` | Erfahrung |
| `passung_*`, `skala_vertraulichkeit` | Passung |
| `verbindlich_6_monate`, `praesenz_darmstadt` | ja/nein |
| `budget`, `sonstiges` | Rahmendaten |
| `datenschutz` | true/false |

## Design

Farben und Aufbau folgen dem PDF-Fragebogen. Schrift: Calibri wo installiert, sonst Source Sans 3 (Google Fonts).
