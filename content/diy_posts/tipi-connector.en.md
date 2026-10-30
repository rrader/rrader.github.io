---
title: "TipiLock: 3D-Printed Top Connector for the JYSK Sminge Kids' Tipi Tent"
date: 2026-10-30T12:00:00+02:00
draft: false
tags: ["diy", "3d-printing", "cadquery", "python", "petg", "maker", "kids"]
---

The **JYSK Sminge** kids' tipi is held up by four wooden poles that are simply tied together at the top with a cord through factory holes. During active play the whole thing wobbles, the poles spread apart, and the fabric sags. So I made a connector that rigidly ties all 4 poles together at the top and sets the correct angles.

The model is parametric, written in Python with CadQuery, and slicing is automated through the headless BambuStudio CLI.

![TipiLock on top of the tipi: the arrow on the front tube points to the entrance](/images/tipi-connector/tipi-connector-front-arrow.webp)

---

## 1. Measurements and geometry

- **Pole circumference (measured with a tape):** 70.0 mm, so $D = 70/\pi \approx 22.3$ mm.
- **Hole diameter in the model:** 23.0 mm (`HOLE_CLEARANCE = +0.7 mm` for a free fit and FDM shrinkage).
- **Entrance (between the two front poles):** $29.33^\circ$ from vertical, exactly **110 cm** of clearance between the legs.
- **Three walls (right, back, left):** $30.15^\circ$ from vertical, exactly **112 cm** of fabric clearance.
- **Orientation marks:** arrows embossed on the front tubes point to the entrance, an `ADALAB` logo on the back one.
- **Connector height:** 60 mm (channel length along the tilted pole is 69 mm).
- **Position on the poles:** the factory $\varnothing 5$ mm cord hole is 6.5 cm from the top end. The connector sits right below these holes. The cord goes through them and the central $\varnothing 11$ mm hole, so the connector can't slide down.
- **Reinforcement:** a solid conical core joins all 4 tubes into one body, no thin legs to snap.
- **Chamfers:** 1.2 mm on all holes for easy pole entry, 1.0 mm on the top outer edge.

![The cord goes through the pole holes and the connector, the knot holds everything in place](/images/tipi-connector/tipi-connector-rope-lock.webp)

---

## 2. Printing (Bambu Lab A1 Mini)

| Parameter | Value |
|---|---|
| **Material** | PETG |
| **Layer height** | 0.24 mm |
| **Orientation** | Upright, flat bottom cut on the bed |
| **Supports** | None needed (self-supporting, angles ~$29.9^\circ$ from vertical) |
| **Perimeters** | 3 walls |
| **Infill** | 15%, Adaptive Cubic or Gyroid |
| **Print time** | ~2 h 17 min |
| **Filament** | ~115 g |

