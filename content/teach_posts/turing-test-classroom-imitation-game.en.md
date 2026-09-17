---
title: "The Imitation Game: Running a Hands-On Turing Test in the Informatics Classroom"
date: 2026-09-17T13:00:00+03:00
draft: false
tags: ["teaching", "ai", "turing-test", "education", "pedagogy", "stem"]
---

When introducing students to artificial intelligence, conversations inevitably lead back to Alan Turing’s seminal 1950 question: *“Can machines think?”*

In traditional textbooks, the **Turing Test** (originally described as *The Imitation Game*) is frequently treated as an abstract historical anecdote: an interrogator asks questions through a teletype terminal to a hidden human and machine, trying to distinguish between the two. Simply reading a paragraph about it seldom leaves a lasting impression.

In our computer science classes, we transformed this famous philosophical thought experiment into a **live, blind interactive laboratory game**, where students actively pitted state-of-the-art Large Language Models (LLMs) against real human peers.

* **Project Portal & Experiment Notes:** [STEAM Turing Test Project](https://sites.google.com/ortlyc.kiev.ua/steam-turing-test-2023/index)
* **Classroom Presentation (Ukrainian):** [Google Slides: The Imitation Game](https://docs.google.com/presentation/d/1tTq-bh3Adkx8BuaHTFBaEXyzUTV47_py/edit?slide=id.p18#slide=id.p18)
* **English Lesson Plans & Activity Kits:** [Google Drive: Turing Test Lesson Kit](https://drive.google.com/drive/folders/1DA4owU6wyb5ZSfxDWdDBolAWeQIxeA71)

---

### 🕹️ Try It Yourself: Interactive Turing Test Lab

> [!NOTE]
> **How this simulation works:** This is an interactive replay emulator rather than a live model API. The terminal responses recreate actual classroom test logs, demonstrating real student heuristics against generative phrasing (lightly adapted for the web format).

Query both terminals on the prompt subject (up to 3 exchanges) and identify which respondent is human and which is synthetic:

{{< turing_sim lang="en" >}}

---

## 1. Lesson Mechanics: From Philosophy to Blind Evaluation

The learning objective extends far beyond having a casual chatbot dialogue. The exercise trains students to **critically dissect text, identify stylistic footprints of synthetic generation, and explore the epistemological boundary between human cognition and statistical token prediction**.

### Game Rules:
Students are split into distinct roles:
1. **Interrogators (Judges):** devise provocative, open-ended questions and submit them through an isolated terminal interface.
2. **Respondents (Agents):**
   * In certain rounds, real classmates located in an adjacent room or behind a partition respond manually.
   * In other rounds, an LLM (such as ChatGPT) or an automated script generates responses behind the curtain.
   * Control rounds: to prevent game theory exploits, blind control rounds pair two humans (*Human–Human*) or two artificial agents (*Bot–Bot*).

Judges are unaware of the backend configuration. Within a strict transmission buffer (typically 4–5 messages per round), they must classify the source as **Human** or **Synthetic**, logging their confidence level (0%, 50%, 100%).

---

## 2. Which Prompts Actually Expose the Machine?

Observing the interrogation strategies invented by middle and high school students is the highlight of the lesson.

Initially, students attempt trivia questions, calculus problems, or encyclopedic definitions. Contemporary LLMs answer these flawlessly within seconds — and that very perfection immediately reveals the bot.

Interrogators quickly pivot to subtle human heuristics:
* **Subjective Sensory Experience (Qualia):**  
  * *“Describe the exact taste of hot soup when you come home freezing in winter.”*  
  * *“What does your cat’s belly feel like when it purrs?”*  
  AI tends toward poetic, verbose, yet sanitized abstractions (“a symphony of warmth”), whereas a teenage student replies colloquially: *“idk, warm and salty, just hits the spot.”*
* **School Context & Ephemeral Slang:**  
  Testing hyper-local cafeteria jokes, evolving youth slang, or recent classroom happenings.
* **Typing Cadence & Imperfections:**  
  Humans type erratically, skip commas, misspell words under time pressure, and self-correct with asterisks (`*`). AI outputs polished, syntactically pristine paragraphs.
* **Meta-Irony and Cynicism:**  
  *“Are you a robot or a real person?”*  
  Bot: *“I am just a regular person sitting here chatting. Why do you ask?”*  
  Student: *“bro are you serious? stop wasting time and pick a topic.”*

---

## 3. Dedicated Tooling: Streamlit & The Hardware Turing Box

To keep the exercise structured and prevent students from using uncontrolled personal messaging apps, we engineered custom software and designed a physical test rig concept.

### Software Prototype (Streamlit)
For rapid deployment in the classroom, we built a lightweight Python / Streamlit web application:
* **Retro CRT Aesthetic:** green phosphor monochrome styling, scanlines, and an old-school command interface.
* **Isolated Channels:** discrete panes for Terminal 1 and Terminal 2.
* **Buffer Constraints:** enforced 5-message caps to force thoughtful inquiry over spam.
* **Voting Phase:** radio toggles for Signal Source + confidence slider.
* **Aggregated Matrix:** once rounds conclude, the dashboard reveals ground truth alongside student accuracy and calibration curves.

### Hardware Concept («Turing Computer»)
In our STEM club, this concept also inspired a dedicated physical installation prototype: [Turing Computer Project](https://github.com/rrader/sketches/tree/main/turing):
* **Architecture:** Raspberry Pi linked via I2C to an Arduino Nano controlling hardware peripherals.
* **Planned Interface:** heavy-duty toggle switches, illuminated arcade pushbuttons, analog voltmeter indicators, and status LEDs for machine state.
* **Current Status:** the physical build is an active project in progress, planned as an interactive hands-on demo for future STEM expos.

---

## 4. Key Takeaways for Students

The pedagogical impact far exceeded conventional lecture delivery:
1. **Simulation ≠ Understanding:** students experienced firsthand that coherent, grammatically structured output does not imply understanding, intent, or self-awareness.
2. **Searle’s Chinese Room in Practice:** when human students intentionally tried to mimic AI by replying concisely and formally, they were frequently misclassified as machines — and vice versa.
3. **Media Literacy in the Generative Era:** students realized how effortlessly the human mind anthropomorphizes text on a screen, projecting empathy, vulnerability, or hostility onto cold mathematical models.

If you teach informatics, computer science, or AI ethics, this interactive format is one of the most effective ways to spark deep, meaningful discussion. All slide decks, lesson guides, and rubrics are linked at the top of the article.
