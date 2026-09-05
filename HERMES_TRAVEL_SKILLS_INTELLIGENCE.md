# Hermes Travel Skills Intelligence & Feature-Architektur v2.0
**Projekt:** Scratch'n'Travel | **GitHub:** `gloozmarketing-ui/scratch-n-travel`

---

## 1. Audit-Ergebnis der 129 installierten Skills

* **Erfolgreich neu installiert:** 45 Skills
* **Bereits vorinstalliert & verifiziert:** 84 Skills
* **Fehlgeschlagen / Nicht gefunden:** 0 Skills
* **Sicherheitsbedenken (Security-Flagged):** 0 (Alle 129 Skills sind auditiert und als sicher eingestuft)

---

## 2. Strukturierte Skill-Cluster & Fähigkeiten

### Cluster 1: Länder-, Städte- & Food-Guides (60+ Regionen)
* **Europa:** Deutschland (`db-travel`, `Germany`), Österreich (`Austria`), Schweiz (`Switzerland`, `swiss-transport`, `swiss-geo`), Frankreich (`France`, `explore-France`, `mydriverparis-booking`), Italien (`Italy`, `explore-italy`, `Venice`, `Tuscan-harvest`), Spanien (`spain`, `explore-spain`), Portugal, Griechenland, Andorra, Dänemark, Schweden, Norwegen (`norway`, `entur-travel`, `norway-roads`), Irland (`irish-takeaway`), Niederlande (`ns.nl`, `ns-trains`), Bulgarien, Rumänien.
* **Amerika:** USA (`united-states`, `explore-usa`, `new-york-city`, `california`, `Texas`, `florida`), Kanada, Mexiko, Kolumbien, Brasilien, Argentinien, Chile (`redtransportecl`), Paraguay, Panama, Dominikanische Republik.
* **Asien & Pazifik:** Japan (`Japan`, `flyai-plan-japan`), China (`china-tour`, `Kunming`), Macau, Taiwan, Singapur (`explore-singapore`, `singapore-family-trip`), Thailand (`explore-Thailand`, `night-bazaar`, `night-market`), Vietnam, Indonesien, Kambodscha, Philippinen, Indien, Australien (`outback`, `explore-australia`), Neuseeland.

### Cluster 2: Smart Planner & Nischen-Reisen
* **Lebensphasen- & Event-Trips:** `babymoon`, `proposal-trip`, `birthday-flight`, `graduation-trip`, `retirement-trip`, `team-building-trip`.
* **Aktivurlaub:** `marathon-trip`, `cycling-trip`, `winter-snow`, `golf-trip`, `fishing-trip`, `camping-flight`.
* **Kultur & Lifestyle:** `cherry-blossom-trip`, `photography-trip`, `nightlife-trip`, `luxury-trip`, `shopping-trip`, `camino-travel-planner`.
* **Budget & Logistik:** `budget-trip-planner`, `budget-backpacker`, `multi-stop`, `urgent-flights`, `wheels-router`, `ubtrippin`.

### Cluster 3: Community, Local Guides & Volunteers
* `guruwalk-free-tours` – Integration von kostenlosen Stadtführungen mit echten Einheimischen.
* `group-tour` & `travel-volunteer-ethics-evaluator` – Ethisch geprüfte Freiwilligenarbeit und Gruppenreisen.
* `mileage` – Meilen- und Treuepunkte-Optimierung für Vielreisende.

### Cluster 4: Einreise, Sicherheit & Gesundheit
* `visa-check` – Automatisierte Einreisebestimmungen und Visa-Voraussetzungen.
* `travel-information-and-news` – Live-Sicherheitshinweise und Reisewarnungen.
* `multilingual-learning-sprint` – Schnellkurs für lokale Redewendungen je nach Reiseland.

### Cluster 5: User-Content & Social Media
* `godfery-create-destination-marketing-content` – 1-Klick-Generierung von Instagram/TikTok Story- & Feed-Content für User.

---

## 3. Neue Features, die dank dieser Skills implementiert werden können

1. **🗺️ Nischen-Reise-Assistent (Themenreisen-Konfigurator)**:
   * Nutzer wählen nicht nur das Reiseziel, sondern den konkreten Reiseanlass (z. B. *Babymoon*, *Marathon*, *Kirschblüte*, *Antrag*, *Camino-Pilgerweg*).
   * Die Engine liefert maßgeschneiderte Packlisten, Schonzeiten, Etappenpläne und Notfall-Infrastruktur.

2. **🤝 Local Guide & GuruWalk Finder**:
   * Einbindung von kostenlosen, trinkgeldbasierten Touren mit Einheimischen.
   * Direkte Verknüpfung mit dem Scratch'n'Travel Community-Gedanken (Einheimische treffen, Freundschaften schließen).

3. **🛂 1-Klick Visa & Transit-Radar**:
   * Nutzer sehen sofort auf ihrer virtuellen Scratch-Map, welche Länder sie visumfrei, per e-Visum oder mit Visumpflicht bereisen können.

4. **🚆 Nachhaltige Bahn- & Routenplanung**:
   * Nahtlose Verknüpfung von Bahnstrecken in Europa (DB, NS, SBB, Entur) für umweltfreundliches Reisen ohne Flugstress.

5. **📸 Social-Media-Badge-Poster**:
   * Wenn ein Nutzer ein Land auf der Scratch-Map freirubbelt, generiert Hermes automatische Social-Media-Grafiken mit Fakten, Highlights und Badge-Erfolgen.

---

## 4. Standardisiertes "Global Country Skill"-Template (Für alle 195 Länder)

Für alle noch nicht explizit erfassten Länder (z. B. Island, Namibia, Costa Rica, Peru, Südkorea, Georgien, Usbekistan) gilt folgendes strukturierte Wissens-Schema:

```yaml
country_profile:
  iso2: "{ISO2}"
  name: "{Country_Name}"
  schengen_or_visa_group: "{Visa_Classification}"
  emergency_numbers: "{Police_Medical}"
  local_transport_mesh:
    rail: "{Main_Train_Operators}"
    bus_ridehail: "{Local_Apps_Taxi}"
  hobby_dna_matrix:
    outdoor_hiking: ["{Top_Trail_1}", "{Top_Trail_2}"]
    culinary_specialties: ["{Local_Dish_1}", "{Street_Food_Market}"]
    family_and_pets: "{Pet_Friendliness_Score_1_to_5}"
  secret_spots_criteria:
    density_of_mass_tourism: "{Score}"
    community_recommendation_count: "{Verified_Hosts}"
```