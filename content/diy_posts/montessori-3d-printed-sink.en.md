---
title: "Autonomous Toddler Montessori Sink: From Plywood and Sheet Metal to 3D Printing"
date: 2026-09-17T12:30:00+03:00
draft: false
tags: ["diy", "3d-printing", "cadquery", "build123d", "parenting", "maker"]
---

Around 12 to 18 months of age, one of the central tenets of Montessori education is independence in everyday hygiene: washing hands, brushing teeth, and wiping faces.

Standard bathroom sinks are fundamentally mismatched for toddlers: even with a stepping stool, reaching the faucet requires straining, balance is precarious, and water splashes everywhere. Most commercial products on the market are either toy plastic play kitchens without real drainage or bulky wooden structures that consume half the room.

I set out to design and construct a **compact, fully autonomous running-water toddler sink**, sized precisely for an ~80 cm tall child.

Along the way, the project went through a complete engineering lifecycle across three distinct manufacturing methods: **CNC-routed birch plywood → laser-cut sheet metal → modular PETG 3D printing**. Here is the breakdown of the design constraints, plumbing hydraulics, and hard-earned engineering lessons.

---

## 1. Ergonomic Envelope & Hard Constraints

Key dimensions established during initial planning:
* **Countertop height:** 390 mm from the floor (ideal for an 80 cm tall toddler). Screw-adjustable legs allow raising the deck to 460 mm as she grows.
* **Deck width:** 500 mm.
* **Deck depth:** 220 mm. *The most critical constraint is keeping depth shallow* — if the counter is too deep, a small child has to lean across the deck on their stomach to reach the stream of water.
* **Basin:** standard stainless steel gastro container GN 1/4 (262×158 mm, 35 mm deep). Durable, food-safe, cheap, and easily replaceable.

---

## 2. Material Iterations: Wood → Sheet Metal → 3D Print

### Attempt 1: Parametric Plywood CNC Routing (CadQuery)
The first countertop design was parametric CadQuery code (`sink/plywood-sink/`) intended for 18 mm waterproof birch plywood:
* Accounted for end-mill bit diameter (6 mm) and inside corner dog-bones.
* Computed toolpaths, multi-pass depths of cut (DOC 6 mm), and holding tabs.

**Why I pivoted:**
Local CNC workshops were reluctant to take single-part custom jobs with tight turnaround times. Furthermore, even with marine varnishes, exposed plywood end-grain in a high-splash wet zone eventually delaminates.

### Attempt 2: Folded Stainless Sheet Metal (AISI 304)
The second approach was a 1.0 mm stainless sheet metal counter with stiffening edge flanges (`sink/metal-sink/`):
* Calculated sheet metal bend allowances ($K=0.33$, inner radius 1.5 mm).
* Generated DXF flat blanks with corner tear-relief notches.

**Why I pivoted:**
Raw sheet metal is cold to toddler touch, sharp exposed edges pose safety hazards, and bending/tig-welding thin stainless for a one-off home prototype was economically impractical.

### Attempt 3: Modular PETG 3D Printing (The Winner)
3D printing with **PETG** solved every design requirement:
* Food-safe, impact-resistant, and entirely immune to moisture and standing water.
* Allows integrating custom snap-fittings, cable ducts, seal grooves, and exact mounting flanges directly into the model.

---

## 3. Engineering Challenges in Large-Scale 3D Printing

Because a 500×220 mm deck exceeds standard print beds (e.g. 256×256 mm), the countertop was split into interlocking modular segments:

1. **Strict No-Support Geometry:**
   All downward surfaces feature 45° chamfers or horizontal bridging geometry, eliminating support cleanup.
2. **Interlocking Alignment Pegs:**
   Male/female alignment pins were modeled with 0.5 mm lead-in chamfers and **+0.2 mm** clearance on depth to ensure seam-tight alignment without binding.
3. **Brass Heat-Set Inserts (M3/M4):**
   Never drive machine screws directly into printed plastic. Every joint and leg flange fastens into brass threaded inserts melted into pilot holes with a soldering iron.
4. **Waterproofing & Sealing:**
   Parting seams were buttered with neutral sanitary silicone before tightening down with stainless hardware and blue threadlocker (Loctite). The exterior was coated in odorless water-based acrylic lacquer.

---

## 4. Closed-Loop Plumbing Architecture

All hydraulics are housed inside the lower envelope under the counter:

```text
[ Clean Water Canister (5L) ] ---> (ViO E11 Dispenser Pump) ---> [ Faucet Outlet ]
                                                                        |
                                                                        v
[ Dirty Water Canister (5L DIN 45) ] <--- (1¼" Sanitary Trap) <--- [ Stainless Pan ]
```

### Water Delivery:
* Driven by a rechargeable **ViO E11** electric water pump. It runs off an internal lithium battery charged via USB-C every few months.
* A custom cylindrical 3D-printed adapter secures the pump flush against the deck, with a rigid feed tube extending down into the 5.5 cm neck of the clean water tank.
* The child taps the top touch sensor once to start the stream and taps again to shut it off — zero grip strength required.

### Drainage & Custom DIN 45 Funnel:
* Fitted with a standard compact 1¼" bathroom siphon with an integrated brass/plastic strainer.
* To safely direct wastewater into an airtight jerrycan, I modeled a custom screw-on funnel in [build123d](https://build123d.readthedocs.io/) (`sink/din45_funnel/`). It threads directly onto the **DIN 45** container neck using buttress KS threads, seating the siphon tube without leaks or odor.

---

## 5. Real-World Results

The sink has transformed our morning routine:
* Complete independence: no stepping stools, no lifting, no falling risk.
* A single 5-liter water swap lasts 4–5 days of active toddler handwashing.
* By restricting depth to 22 cm, sleeves and shirts stay completely dry.

The project demonstrated that combining parametric code-based CAD (CadQuery and build123d) with modern desktop 3D printing enables creating bespoke functional furniture that outperforms off-the-shelf alternatives.
