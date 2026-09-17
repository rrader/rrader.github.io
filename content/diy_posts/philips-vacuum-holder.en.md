---
title: "Wall Mount for Philips 8000 Aqua Plus Vacuum (PETG + TPU)"
date: 2026-05-31T18:00:00+03:00
draft: false
tags: ["diy", "3d-printing", "fusion360", "maker", "hardware"]
---

The cordless **Philips 8000 Series Aqua Plus** is great for quick daily cleanups, but in our cabinet shelf there simply isn't enough vertical height to store the vacuum fully assembled. While the motor unit sits nicely on its original charging dock, the long aluminum extension tube and crevice nozzle have to be detached and parked on the wall right next to it.

Off-the-shelf broom clips and generic hardware store wall mounts don't work:
1. **Unusual oval cross-section:** the aluminum tube measures **42.5 × 32 mm**, whereas standard utility clips are designed for 25–30 mm round broom handles.
2. **Scratch risk:** rigid spring steel clamps or hard molded plastic jaws quickly scratch the anodized finish on the aluminum tube.
3. **Fatigue of all-rigid snap clips:** 3D prints made entirely from PETG or PLA with flexure arms eventually suffer from layer fatigue, creep, or layer splitting under repeated snap cycles.

So I took the solid concept of an Everbilt rail broom clip and modified it in Fusion 360 to fit the exact width and oval contour of the Philips tube: widening the rigid PETG base bracket and reshaping the flexible TPU strap with proper tension.

* **MakerWorld Model:** [Vacuum tube holder for Phillips 8000 Aqua Plus (Model 2871355)](https://makerworld.com/en/models/2871355-vacuum-tube-holder-for-phillips-8000-aqua-plus#profileId-3205806)
* **Origin Inspiration:** Everbilt rail broom clip concept ([Printables 1214566](https://www.printables.com/model/1214566-broom-mop-attachments-for-everbilt-rail))

![Philips 8000 Series Aqua Plus extension tube docked inside a closet next to the vacuum motor unit](/images/vacuum-holder/vacuum-installed-in-closet.webp)

---

## 1. Holder Geometry and Engineered Sizing
 
Keep in mind that the figures below are not merely raw caliper readings of the bare tube (which can vary slightly depending on measurement point or manufacturing tolerances), but rather the tuned functional dimensions of the bracket itself, designed for smooth clearance, positive retention, and material elasticity:

| Model Parameter | Value | Engineered Purpose & Fit |
|---|---|---|
| **Cradle Inner Width** | ~44.8 mm | Optimized clearance for the ~42.5 mm oval tube section |
| **Cradle Saddle Depth** | ~32.5 mm | Sized for the ~32.0 mm tube profile thickness |
| **Throat Opening Clearance** | 50.0 mm | Smooth entry: tube pops in easily without falling out forward |
| **Hole Center Spacing** | 30.0 mm | Compact mounting base for cabinet walls (holes centered at X = ±15 mm) |
| **Screw Hole Diameter** | 4.5 mm | Sized for 3.5–4.0 mm wood screws or M4 bolts (3.0 mm back wall thickness) |
| **TPU Pre-tension Offset** | ~15–20 mm | Strap is slightly shorter than the arc for positive clamping tension |

---

## 2. Fusion 360 Design Architecture (Iteration v9)

The model went through several test fits (`bracket-v9` being the final iteration) to dial in the snap feel and clamping force:

![Fusion 360 3D model of the wall bracket and flexible retention strap](/images/vacuum-holder/cad-model-overview.webp)

The assembly consists of three parts:

1. **Wall Bracket (PETG):**
   * Features a U-shaped saddle contoured to the radius of the Philips 8000 tube.
   * Two 4.5 mm screw holes spaced at **30 mm** on the base plate (3 mm back wall thickness, fully accessible through the open cradle cavity).
   * Forward-projecting hinge lugs with through-holes to receive the locking pins (overall bracket width is 89 mm).
2. **Flexible Retention Strap (TPU 95A):**
   * Printed flat on the build plate.
   * Eyelets on both ends slip into the bracket lugs, while ribbed gripping ridges on the inner contact surface prevent the aluminum tube from sliding vertically.
   * Length is pre-tensioned so it stretches slightly when pressing the tube into the cradle, snapping it firmly into place.
3. **Locking Hinge Pins (PETG, 2 pcs):**
   * Flanged cylindrical pins (⌀4 mm, 25 mm length) that push through the bracket lugs and strap eyelets from above.
   * Eliminates the need for metal nuts, bolts, or hinge hardware.

![Fusion 360 top-angle view showing 30 mm screw mounting holes and hinge lugs](/images/vacuum-holder/cad-model-bracket-top.webp)

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

The bracket is screwed onto the closet panel with two wood screws. The black PETG body provides solid structural anchoring, while the white flexible TPU strap stretches smoothly around the tube to hold it in place.

![Assembled mount installed on the wall: black PETG bracket with white TPU strap and locking pins](/images/vacuum-holder/bracket-assembled-on-wall.webp)

Docking and releasing is a simple single-handed operation: push the tube in to clip, pull forward to release. Zero wobble, zero scratches on the anodized finish, and completely rattle-free.
