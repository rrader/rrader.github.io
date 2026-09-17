---
title: "Hybrid Wall Mount for Philips 8000 Aqua Plus Vacuum (PETG + TPU)"
date: 2026-05-31T18:00:00+03:00
draft: false
tags: ["diy", "3d-printing", "fusion360", "maker", "hardware"]
---

The cordless **Philips 8000 Series Aqua Plus** is great for quick daily cleanups, but storing its long aluminum extension tube and accessories neatly on a wall or inside a utility closet is surprisingly awkward.

Off-the-shelf broom clips and generic hardware store wall mounts don't work:
1. **Unusual oval cross-section:** the aluminum tube measures **42.5 × 32 mm**, whereas standard utility clips are designed for 25–30 mm round broom handles.
2. **Scratch risk:** rigid spring steel clamps or hard molded plastic jaws quickly scratch the anodized finish on the aluminum tube.
3. **Fatigue of all-rigid snap clips:** 3D prints made entirely from PETG or PLA with flexure arms eventually suffer from layer fatigue, creep, or layer splitting under repeated snap cycles.

To solve this properly, I designed a hybrid dual-material wall bracket in Autodesk Fusion 360: a rigid, dimensionally stable PETG base bracket combined with a flexible TPU retention strap.

* **MakerWorld Model:** [Vacuum tube holder for Phillips 8000 Aqua Plus (Model 2871355)](https://makerworld.com/en/models/2871355-vacuum-tube-holder-for-phillips-8000-aqua-plus#profileId-3205806)
* **Origin Inspiration:** Everbilt rail broom clip concept ([Printables 1214566](https://www.printables.com/model/1214566-broom-mop-attachments-for-everbilt-rail))

---

## 1. Tube Dimensions & Caliper Measurements

Before opening CAD, I took accurate caliper measurements of the tube profile and the mounting surface:

| Dimension | Value | Notes |
|---|---|---|
| **Tube Width** | 42.5 mm | Width of the oval aluminum section |
| **Tube Depth** | 32.0 mm | Profile thickness front-to-back |
| **Max Throat Opening** | 50.0 mm | Sized so the tube won't fall out even when the latch is open |
| **Hole Center Spacing** | 65.0 mm | Spacing between wall-mounting countersunk screw holes |
| **Counterbore Hole Depth** | 12.0 mm | Fully recesses the drywall screw heads |
| **TPU Pre-tension Offset** | -20.0 mm | Strap is 20 mm shorter than the arc for positive clamping tension |

---

## 2. Fusion 360 Design Architecture (Iteration v9)

The model went through several test fits (`bracket-v9` being the final iteration) to dial in the snap feel and clamping force:

![Rigid PETG wall bracket and two locking hinge pins](/images/vacuum-holder/bracket-and-pins.png)

The assembly consists of three parts:

1. **Wall Bracket (PETG):**
   * Features a U-shaped saddle contoured to the radius of the Philips 8000 tube.
   * Two countersunk screw holes spaced at **65 mm** on the backplate for wall mounting.
   * Forward-projecting hinge lugs with through-holes to receive the locking pins.
2. **Flexible Retention Strap (TPU 95A):**
   * Printed flat on the build plate.
   * Eyelets on both ends slip into the bracket lugs, while ribbed gripping ridges on the inner contact surface prevent the aluminum tube from sliding vertically.
   * Length is pre-tensioned so it stretches slightly when pressing the tube into the cradle, snapping it firmly into place.
3. **Locking Hinge Pins (PETG, 2 pcs):**
   * Flanged cylindrical pins that push through the bracket lugs and strap eyelets from above.
   * Eliminates the need for metal nuts, bolts, or hinge hardware.

![Flexible TPU retention strap with ribbed gripping surface](/images/vacuum-holder/tpu-strap.png)

![Top view of bracket showing 65 mm screw spacing and hinge lugs](/images/vacuum-holder/bracket-top-view.png)

---

## 3. Print Settings (Bambu Lab A1 mini)

The project `.3mf` file is pre-configured into two build plates:

* **Plate 1 (Rubber / TPU):**
  * Filament: Generic TPU (95A).
  * Infill: 100% (the strap works purely in tension and must be solid).
  * Speed: 30–40 mm/s for optimal layer bonding and smooth pin eyelets.
* **Plate 2 (Plastic / PETG):**
  * Filament: PETG (for rigidity and impact strength).
  * Perimeters: 4 walls to reinforce the hinge lugs and screw counterbores.
  * Infill: 25% (Grid or Gyroid).
  * Pin orientation: printed vertically with a brim or horizontally with light supports for round tolerances.

---

## 4. In Use

The bracket is mounted to the wall with two screws. To dock the vacuum or tube, simply push it into the cradle — the TPU strap stretches, wraps around the profile, and holds it firmly with zero play. To release, just pull the tube forward. Zero scratches, zero wobble, and simple single-hand operation.
