# Responsively Studio - Multi-Device Responsive Comparison Workspace

A standalone, high-performance HTML/CSS/JavaScript responsive site comparison & mockup application inspired by Responsively App.

## Features Added

1. **Desktop Application Navigation Bar**:
   - Menu dropdowns: `Device Set`, `View`, `Capture`, `Auto-refresh`, `Tools`, `Account`, `Settings`.
   - Right controls: `Development domain`, `Templates`, `Device Manager`.

2. **Realistic Hardware Device Mockup Frames**:
   - **Smartphones** (e.g. Galaxy S21, iPhone 15 Pro, Pixel 8): Outer chassis with camera punch hole dot.
   - **Tablets** (e.g. iPad Pro 12, iPad Air): Bezel frame with camera dot.
   - **Desktop Computer Monitors** (e.g. Desktop MDPI 1440×900, iMac 24" 4K): **Physical Monitor Frame with Neck Stand and Base Foot** at the bottom!

3. **Device Bar Headers & Control Actions**:
   - Header title dropdown (e.g., `Galaxy S21 | Android (360×800 / 420ppi) ▾`) allowing instant device switching.
   - Action controls:
     - 📷 **Screenshot Capture**: Mockup screenshot generation & modal preview.
     - 🔄 **Rotate Orientation**: Instant width <-> height swap (Portrait / Landscape).
     - ⚡ **Inspect / DevTools**: Toggles the bottom DevTools drawer (Console, Elements, Network, Metrics).
     - ✕ **Remove Screen**: Removes viewport from workspace.

4. **Bottom Device Status Bar**:
   - Displays issue badges (`🔴 0 ⚠️ 0 ℹ️ 5`) and network status (`Online 🟢`).

5. **Built-in Shine Studio Concierge Demo Template**:
   - Includes a built-in automotive protection template matching the exact website in the reference screenshot!

6. **Interactive Inspector & DevTools**:
   - Slide-up bottom drawer with live console log, HTML element viewer, network table, and viewport metrics.

## How to Run

Simply open `index.html` in any browser, or serve locally with Python:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.
