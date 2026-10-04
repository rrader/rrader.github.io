---
title: "Light-Bot: Resilient Grid Power Monitoring & Telegram Notification Engine"
date: 2026-07-04T16:26:24+03:00
draft: false
tags: ["projects", "python", "flask", "telegram", "homelab"]
---

In our newly built apartment building, both my neighbors and I found it extremely helpful to know exactly when grid power was on and when it went out. Because my home router and home server are backed up by battery and never shut down during blackouts, I built a straightforward and reliable solution: an in-apartment probe that continuously pings devices plugged directly into raw 220V mains, automatically computing outage durations and notifying all neighbors via a dedicated Telegram channel.

**Light-Bot** is an open-source, multi-component infrastructure monitoring solution designed to reliably detect 220V grid status, track outage/restoration statistics, provide a secure authenticated REST API, and broadcast live status updates to Telegram channels.

* **Source Code:** [github.com/rrader/light-bot](https://github.com/rrader/light-bot)
* **Stack:** Python 3, Flask, Telegram Bot API, Docker, Systemd, Shell scripting

---

## 1. System Architecture

The core challenge of grid monitoring with an uninterrupted power supply is simple: **if your router and server never lose power, how do you know the grid went down?**

Light-Bot solves this through a split architecture:

```
[ Unbacked 220V Device ] (e.g. Air Conditioner / Wall Plug)
         │
         │ (ICMP Ping / Heartbeat)
         ▼
[ Local Router / Probe ] ──(HTTPS + Token)──► [ Remote Cloud VPS ]
                                                      │
                                                      ▼
                                            [ Telegram Channel ]
                                            (Live Alerts & Stats)
```

1. **Local Edge Probe (`monitor.sh`):**
   - Runs directly on the local router or a low-power home server backed by battery.
   - Pings a specific IP address on the local subnet belonging to a device plugged straight into raw wall mains without battery backup (e.g. smart plug or AC unit).
   - Uses consecutive check debouncing (`CONSECUTIVE_CHECKS=3` over 15 seconds) to prevent false positives from transient network jitter.
   - When a state transition occurs, it dispatches an authenticated HTTPS payload to the remote server.

2. **Cloud/VPS Service (`main.py`):**
   - Runs on a high-availability remote VPS or cloud instance independent of local power outages.
   - Hosts a multi-threaded Flask REST API protected by a pre-shared 256-bit bearer token.
   - Maintains state persistence on disk (`power_status.txt`) to survive service restarts without losing state history.

---

## 2. Telegram Notifications & Duration Tracking

When the power state transitions between `ON` and `OFF`, the bot formats a structured message and broadcasts it to the designated Telegram channel.

Key capabilities:
* **Outage Duration:** When electricity returns, the bot computes the exact duration the grid was offline (e.g. `4h 12m`) and highlights it in the notification.
* **Uptime Duration:** When an outage begins, the bot logs how long the power had remained stable prior to the cut.
* **Reliability:** Built with retry mechanisms to ensure Telegram API limits or momentary connection drops don't lose state transition alerts.

---

## 3. Secure REST API

Beyond Telegram broadcasts, Light-Bot exposes clean REST endpoints:

* `GET /health` — Public health check endpoint for uptime monitors:
  ```json
  {
    "status": "ok"
  }
  ```
* `POST /power-status` — Ingests state transitions from authorized local monitoring scripts via `Authorization: Bearer <API_TOKEN>`.
