/**
 * Scratch'n'Travel — Luxury Theme & Design System Manager
 * 
 * Supports 3 distinct handcrafted design aesthetics:
 * 1. "theme-obsidian": Signature Dark Luxury (Obsidian, Metallic Gold & Vibrant Emerald)
 * 2. "theme-cream": Warm Editorial Nature (Warm Cream, Terracotta, Sage Green & Paper)
 * 3. "theme-forest": Deep Alpine Forest (Midnight Forest Pine, Dark Slate & Sand Gold)
 */

const THEMES = {
  obsidian: {
    id: 'theme-obsidian',
    name: 'Obsidian & Gold',
    tagline: 'Signature Dark Luxury',
    icon: '✨',
    bg: '#0B131F',
    card: 'rgba(18, 30, 49, 0.75)',
    primary: '#10B981',
    accent: '#F59E0B'
  },
  cream: {
    id: 'theme-cream',
    name: 'Warm Cream & Terracotta',
    tagline: 'Heimatwege Editorial Journal',
    icon: '🌿',
    bg: '#F9F6F0',
    card: 'rgba(255, 255, 255, 0.92)',
    primary: '#D17B49',
    accent: '#8DA99B'
  },
  forest: {
    id: 'theme-forest',
    name: 'Deep Alpine Forest',
    tagline: 'Midnight Pine & Sand',
    icon: '🌲',
    bg: '#1C2820',
    card: 'rgba(40, 56, 48, 0.88)',
    primary: '#10B981',
    accent: '#E6DFD3'
  }
};

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('scratch_theme') || 'obsidian';
  }

  init() {
    this.applyTheme(this.currentTheme, false);
    this.updateSelectorUI();
  }

  setTheme(themeKey) {
    if (!THEMES[themeKey]) return;
    this.currentTheme = themeKey;
    localStorage.setItem('scratch_theme', themeKey);
    this.applyTheme(themeKey, true);
    this.updateSelectorUI();
  }

  applyTheme(themeKey, showNotification = true) {
    const theme = THEMES[themeKey] || THEMES.obsidian;
    const root = document.documentElement;

    // Remove old theme classes
    root.classList.remove('theme-obsidian', 'theme-cream', 'theme-forest');
    root.classList.add(theme.id);

    if (themeKey === 'cream') {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    } else {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    }

    if (showNotification && window.stripeManager) {
      window.stripeManager.showToast(`${theme.icon} Design gewechselt zu "${theme.name}" (${theme.tagline})`);
    }
  }

  updateSelectorUI() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      const key = btn.getAttribute('data-theme');
      if (key === this.currentTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

window.themeManager = new ThemeManager();

document.addEventListener('DOMContentLoaded', () => {
  window.themeManager.init();
});