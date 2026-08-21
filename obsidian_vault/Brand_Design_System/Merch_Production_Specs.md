# Scratch'n'Travel — Merch Produktions-Spezifikationen (POD API)

## 1. Automatischer Brand-Name
Hermes extrahiert für alle Merch-Designs ausschließlich den Brand-Namen (ohne Domains wie .de / .travel / www).

```javascript
const BRAND = (process.env.SITE_URL || 'https://scratchntravel.com')
  .replace(/^https?:\/\/(www\.)?/, '')
  .replace(/\.(com|de|travel|app|io|net|org).*$/, '');
// Ergibt: "scratchntravel"
```

## 2. Anbieter-Routing
- **Printful API**: Notizbücher, Sport-Shirts mit Stickerei, Anbügel-Patches
- **Contrado API**: PU-Leder Reisetaschen, Weekender, gravierte Metallanhänger
