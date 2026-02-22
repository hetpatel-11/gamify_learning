export const RULE_INDEX = `# Gamified Learning Engine — Turn Any Topic Into an Interactive Video Lesson

Teach complex topics as gamified module videos with XP, quizzes, achievements, and progress bars.
Also supports free-form Remotion video creation, animated diagrams, and URL-scraped themed videos.

## Available Tools

### 🎮 Gamified Learning (PRIMARY)
- **create_learning_module** — FASTEST PATH: given a topic + modules + quiz, auto-generates a complete gamified video (XP bar, badges, key point reveals, quiz card, level-up scene). No code needed.
- **rule_gamified_learning** — Component templates: XP bars, module badges, quiz cards, achievement popups, level-up scenes, difficulty system

### 🌐 URL Scraping
- **scrape_url** — Fetch any URL, extract content + detect brand theme (30+ domains, 15 content categories). Use BEFORE creating videos from URLs.

### 📹 Free-Form Video
- **create_video** — Create any Remotion video from raw React/TSX files
- **rule_react_code** — Project file structure, imports, composition exports, props
- **rule_remotion_animations** — useCurrentFrame, frame-driven animations
- **rule_remotion_timing** — interpolate, spring, Easing, spring configs
- **rule_remotion_sequencing** — Sequence, durationInFrames, scene management
- **rule_remotion_transitions** — TransitionSeries, fade, slide, wipe, flip
- **rule_remotion_text_animations** — Typewriter effect, word highlighting
- **rule_remotion_trimming** — Trim start/end of animations with Sequence
- **rule_remotion_diagrams** — Flowcharts, node graphs, bar/donut charts, timelines, split text+diagram layouts, animated code blocks

---

## Decision Flow

**User wants to learn a topic?**
→ Use **create_learning_module** directly. Provide topic, 2–5 modules with key points, optional quiz.

**User provides a URL to learn from?**
→ Call **scrape_url** first → extract keyPoints + theme → call **create_learning_module** with that content and theme colors.

**User wants a diagram or explainer video?**
→ Call **rule_remotion_diagrams** → call **create_video** with the diagram code.

**User wants a custom animated video?**
→ Call **rule_react_code** → call **create_video** with the files.

---

## create_learning_module — Quick Reference

\`\`\`json
{
  "topic": "How RSA Encryption Works",
  "difficulty": "intermediate",
  "xpTotal": 600,
  "modules": [
    {
      "title": "What is a Prime Number?",
      "keyPoints": [
        "A prime has exactly 2 factors: 1 and itself",
        "Examples: 2, 3, 5, 7, 11, 13...",
        "There are infinitely many primes (proven by Euclid)"
      ]
    },
    {
      "title": "The Key Generation Step",
      "keyPoints": [
        "Pick two large primes p and q",
        "Compute n = p × q (the public modulus)",
        "The private key is hidden in the factorization of n"
      ]
    },
    {
      "title": "Encrypting a Message",
      "keyPoints": [
        "Your message M is raised to the public exponent e",
        "Computed as: C = M^e mod n",
        "Only the holder of the private key can reverse this"
      ]
    }
  ],
  "quiz": {
    "question": "What makes RSA secure?",
    "options": [
      "Fast addition of large numbers",
      "The difficulty of factoring large numbers",
      "A secret password stored on a server",
      "Using the same key for encryption and decryption"
    ],
    "correctIndex": 1
  },
  "theme": {
    "primaryColor": "#7C3AED",
    "backgroundColor": "#0D0D1A",
    "accentColor": "#FFD700"
  }
}
\`\`\`

---

## URL-Based Learning (Themed)

When the user gives a URL:
1. Call **scrape_url** — get title, keyPoints, and theme (colors, mood)
2. Break the keyPoints into logical modules (2–5 points per module)
3. Call **create_learning_module** using the scraped content + the theme's primaryColor/backgroundColor/accentColor
4. Example: paulgraham.com → YC orange theme, 3–4 modules from the essay's key arguments

---

## Quality Bar

- Every learning module video should feel like a **game**, not a slideshow
- XP bar always fills over time — creates tension and reward
- Key points animate in one at a time — never dump all at once
- Quiz always has a dramatic reveal moment at frame 90
- Level-up scene is always the final reward — make it feel earned
- Match difficulty color to content complexity (green → beginner, gold → intermediate, red → advanced, purple → boss)
`;
