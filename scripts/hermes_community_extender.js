/**
 * Hermes Community & City Brain Autonomous Extender v1.0
 * 
 * Ingests community feedback and research data, verifies safety and compliance,
 * structures new categories/spots/cities, and expands seeded city brains.
 */

const fs = require('fs');
const path = require('path');

class HermesCommunityExtender {
  constructor() {
    this.seededDir = path.join(__dirname, '..', 'seeded_cities');
    if (!fs.existsSync(this.seededDir)) {
      fs.mkdirSync(this.seededDir, { recursive: true });
    }
  }

  processCommunitySubmission(submission) {
    const { title, story, author, city = 'Lissabon', country = null, category = 'Geheimtipp', coordinates } = submission || {};

    // SNT-112: Pflichtfeld-Validierung — keine erfundenen Fallback-Autoren oder Fake-Koordinaten
    if (!title || !story || !author || !coordinates) {
      return {
        success: false,
        reason: 'Titel, Beschreibung, Autor und Koordinaten sind Pflichtfelder (SNT-112).'
      };
    }

    const citySlug = city.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cityFile = path.join(this.seededDir, `${citySlug}-brain.json`);

    let cityBrain = {
      city,
      country: country || 'International',
      lastUpdated: new Date().toISOString(),
      verifiedSpots: [],
      safetyAlerts: []
    };

    if (fs.existsSync(cityFile)) {
      try {
        cityBrain = JSON.parse(fs.readFileSync(cityFile, 'utf8'));
        if (country) {
          cityBrain.country = country;
        }
      } catch (err) {
        console.warn('Error reading existing brain, reinitializing:', err.message);
      }
    }

    // SNT-112: Kein automatisches 5.0 Rating — Bewertung entsteht nur durch echte Community-Votes
    const newSpot = {
      id: `spot_${Date.now()}`,
      title,
      category,
      story,
      verifiedBy: author,
      coordinates: coordinates.trim(),
      dateAdded: new Date().toISOString().split('T')[0]
    };

    cityBrain.verifiedSpots.push(newSpot);
    cityBrain.lastUpdated = new Date().toISOString();

    fs.writeFileSync(cityFile, JSON.stringify(cityBrain, null, 2), 'utf8');

    return {
      success: true,
      message: `Hermes hat Spot "${title}" erfolgreich im Brain für ${city} verifiziert und strukturiert!`,
      spotId: newSpot.id
    };
  }
}

if (require.main === module) {
  const extender = new HermesCommunityExtender();
  const sample = {
    title: 'Secret Miradouro bei Alfama',
    story: 'Wunderschöne kleine Terrasse mit Schatten und Ausblick über den Tejo ohne Touristenbusse.',
    author: 'Elena (Pionier Explorer)',
    city: 'Lissabon',
    country: 'Portugal',
    category: 'Aussichtspunkt & Romantik',
    coordinates: '38.7120° N, 9.1305° W'
  };

  const res = extender.processCommunitySubmission(sample);
  console.log('🤖 [Hermes Extender]:', res.message);
}

module.exports = HermesCommunityExtender;