export const RULE_INDEX = `# Gamified Learning Engine — Turn Any Topic Into an Interactive Video Lesson

Teach complex topics as gamified module videos with XP, quizzes, achievements, and progress bars.
Also supports free-form Remotion video creation, animated diagrams, and URL-scraped themed videos.

## Available Tools

### 🎮 Gamified Learning (PRIMARY)
- **plan_learning_path** — ALWAYS CALL FIRST. Returns a course map (all modules listed with summaries + XP). Shows the full structure BEFORE any video is generated.
- **teach_module** — Generates ONE focused module video at a time. Call after plan_learning_path, one per module in sequence. Dark bg always, accent color only for highlights.
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
1. Call **plan_learning_path** → shows course map (all modules listed)
2. Call **teach_module** for Module 1
3. After user watches, call **teach_module** for Module 2
4. Continue until all modules done (last one sets isLast: true → triggers level-up)

**User provides a URL to learn from?**
1. Call **scrape_url** → get title, keyPoints, theme (use accentColor from theme.primaryColor)
2. Call **plan_learning_path** with content broken into logical modules
3. Call **teach_module** one at a time with accentColor set to the scraped brand color

**User wants a diagram or explainer video?**
→ Call **rule_remotion_diagrams** → call **create_video** with the diagram code.

**User wants a custom animated video?**
→ Call **rule_react_code** → call **create_video** with the files.

---

## plan_learning_path — Quick Reference

\`\`\`json
{
  "topic": "How RSA Encryption Works",
  "difficulty": "intermediate",
  "totalXp": 600,
  "modules": [
    { "title": "What is a Prime Number?", "summary": "Covers prime fundamentals and why they matter", "xp": 150 },
    { "title": "Key Generation", "summary": "How public/private key pairs are created from two primes", "xp": 200 },
    { "title": "Encrypting a Message", "summary": "The math behind M^e mod n and why only the private key can reverse it", "xp": 250 }
  ]
}
\`\`\`

## teach_module — Quick Reference

\`\`\`json
{
  "topic": "How RSA Encryption Works",
  "moduleNumber": 1,
  "totalModules": 3,
  "title": "What is a Prime Number?",
  "keyPoints": [
    "A prime has exactly 2 factors: 1 and itself",
    "Examples: 2, 3, 5, 7, 11, 13...",
    "There are infinitely many primes — proven by Euclid in 300 BC",
    "RSA security depends entirely on how hard it is to find prime factors"
  ],
  "xp": 150,
  "difficulty": "intermediate",
  "accentColor": "#F59E0B",
  "isLast": false,
  "quiz": {
    "question": "Which of these is NOT a prime number?",
    "options": ["7", "11", "15", "19"],
    "correctIndex": 2
  }
}
\`\`\`

---

## URL-Based Learning (Themed)

When the user gives a URL:
1. Call **scrape_url** → get title, keyPoints, theme
2. Use theme.primaryColor as the accentColor in plan_learning_path and teach_module
3. NEVER use theme.backgroundColor as the video background — always use dark (#0D1117)
4. Example: paulgraham.com → accentColor: "#FF6600", dark background, orange highlights

---

## Quality Bar

- Every learning module video should feel like a **game**, not a slideshow
- XP bar always fills over time — creates tension and reward
- Key points animate in one at a time — never dump all at once
- Quiz always has a dramatic reveal moment at frame 90
- Level-up scene is always the final reward — make it feel earned
- Match difficulty color to content complexity (green → beginner, gold → intermediate, red → advanced, purple → boss)
`;
