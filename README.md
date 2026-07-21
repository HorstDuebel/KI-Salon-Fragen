# KI-Salon Interviewbogen

Statische Webseite für den Interviewbogen von Susanne Volkwein und Frank Vullhorst. Interessierte füllen den Bogen im Browser aus; Eingaben werden lokal zwischengespeichert und beim Absenden über **Netlify Forms** gespeichert.

**Formularversion:** 2.0.0 (Stand PDF 26-07-21)

## Papierversion (PDF)

Alternativ zum Online-Fragebogen kann der Bogen als PDF heruntergeladen, handschriftlich ausgefüllt und in Papierform übergeben werden (`assets/KI-Salon_Fragebogen.pdf`). Der Download-Link steht im Hinweistext unter dem Intro auf der Startseite.

## Dateien

```
index.html              # Seite und Formular
css/styles.css          # Design (PDF-Farben, Mobile)
js/form-choices.js      # Abhängige Freitextfelder bei Optionen
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

Beim Tippen und beim Verlassen der Seite: Key `ki-salon-fragebogen-v2` im Browser. Nach erfolgreichem Absenden wird der Entwurf gelöscht.

## E-Mail-Benachrichtigungen (Netlify)

Damit Susanne und Frank bei jedem Absenden eine Mail bekommen:

1. [Netlify](https://app.netlify.com) → Site **KI-Salon-Fragen** öffnen  
2. **Forms** → **Form notifications** → **Add notification** → **Email notification**  
3. Empfänger: `Susanne@SusanneVolkwein.de` und `Frank@FrankVullhorst.de`  
4. Formular: `interviewbogen`, Event: **New form submission**

Einsendungen liegen auch unter **Forms** im Dashboard (Export/CSV für Auswertung).

## Adapter wechseln

Nur `js/submit.js` anpassen. Signatur:

```js
FormSubmit.submitAnswers(payload)  // → Promise
// payload = { meta: { formVersion, submittedAt, source }, answers: { ... } }
```

`FormCollect.flatten(payload)` liefert eine flache Map (eine Spalte pro Feld).

## Feldliste (Auswertung, v2)

| ID | Bedeutung |
|----|-----------|
| `vorname`, `name`, `email`, `telefon` | Kontaktdaten |
| `unternehmen_branche`, `land`, `wohnsitz`, `adresse`, `website`, `linkedin` | Kontext |
| `motivation_warum` | Warum KI-Salon |
| `motivation_zeitpunkt_herausforderungen` | Zeitpunkt + KI-Herausforderungen |
| `skala_austausch` | 1–10 |
| `haltung_beschreibung`, `haltung_ethik` | Haltung (Freitext) |
| `ki_als` | Mehrfach: technisches_werkzeug, strategische_chance, kulturelle_veraenderung, grosse_herausforderung, etwas_ganz_anderes |
| `ki_als_anders` | Freitext bei „etwas ganz anderes“ |
| `rolle`, `mitarbeitende` | Kontext Unternehmen |
| `erfahrung_ki_stufe` | noch_keine, erste_versuche, regelmaessige_nutzung, teil_prozesse |
| `erfahrung_ki_prozesse` | Freitext bei teil_prozesse |
| `erfahrung_formate` | Ähnliche Formate |
| `passung_ambivalenz`, `passung_meinungen` | Passung (Freitext) |
| `passung_oeffnen` | ja, eher_ja, eher_nein, nein |
| `skala_vertraulichkeit` | 1–10 |
| `verbindlich_6_monate`, `praesenz_darmstadt` | ja/nein |
| `sonstiges` | Sonstiges |
| `datenschutz_einwilligung`, `datenschutz_zeitpunkt` | Einwilligung |

## Design

Farben und Aufbau folgen dem PDF-Fragebogen. Schrift: Calibri wo installiert, sonst Source Sans 3 (Google Fonts).
