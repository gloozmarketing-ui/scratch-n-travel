// Was passiert:
1. ScrollTrigger beobachtet jede Section
2. Wenn Section im Viewport (80%):
   - Linke Karte: fliegt von links ein (x: -100)
   - Rechte Karte: fliegt von rechts ein (x: 100)
   - Hauptkarte: skaliert hoch (scale: 0.8 → 1)
3. Stagger-Delay für flüssigen Look