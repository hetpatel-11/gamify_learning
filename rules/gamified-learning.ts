export const RULE_GAMIFIED_LEARNING = `# Gamified Learning Videos

Build module-based gamified educational videos with XP systems, progress bars, quiz cards, achievement unlocks, and level-up animations. Every lesson is a game.

---

## Core Design Language

- **Dark base backgrounds** (#0D0D1A or themed) with glowing accents
- **XP bar** always visible at top — fills as content plays
- **Module badges** (numbered, color-coded by difficulty)
- **Key point reveals** — staggered, punchy, one at a time
- **Quiz cards** with A/B/C/D options, correct answer reveal + burst
- **Achievement popups** — slide in from top-right, auto-dismiss
- **Level-up screen** — full dramatic sequence with particle-style radial burst
- **Completion summary** — XP earned, modules done, badge awarded

---

## 1. XP Progress Bar (persistent, animated)

\`\`\`tsx
function XPBar({ progress, maxXP, currentXP, color = "#FFD700" }: {
  progress: number; // 0-1, frame-driven
  maxXP: number; currentXP: number; color?: string;
}) {
  return (
    <div style={{
      position: "absolute", top: 18, left: 40, right: 40, zIndex: 100,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{ color: "#FFD700", fontSize: 12, fontWeight: 700, fontFamily: "Inter, sans-serif", letterSpacing: 1, minWidth: 32 }}>XP</span>
      <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          width: \`\${progress * 100}%\`,
          background: \`linear-gradient(90deg, \${color}, \${color}88)\`,
          boxShadow: \`0 0 8px \${color}88\`,
          transition: "width 0.1s linear",
        }} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "Inter, sans-serif", minWidth: 70 }}>
        {Math.round(progress * maxXP)} / {maxXP}
      </span>
    </div>
  );
}

// Usage — fills from 0 to full over the video duration:
// const frame = useCurrentFrame();
// const { durationInFrames } = useVideoConfig();
// const xpProgress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
// <XPBar progress={xpProgress} maxXP={500} currentXP={0} />
\`\`\`

---

## 2. Module Badge (numbered, difficulty-colored)

\`\`\`tsx
const DIFFICULTY_COLORS = {
  beginner:     { bg: "#22C55E", glow: "#22C55E44" },
  intermediate: { bg: "#F59E0B", glow: "#F59E0B44" },
  advanced:     { bg: "#EF4444", glow: "#EF444444" },
  boss:         { bg: "#A855F7", glow: "#A855F744" },
};

function ModuleBadge({ number, difficulty = "beginner", delay = 0 }: {
  number: number; difficulty?: keyof typeof DIFFICULTY_COLORS; delay?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });
  const { bg, glow } = DIFFICULTY_COLORS[difficulty];
  return (
    <div style={{
      transform: \`scale(\${scale})\`,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 48, height: 48, borderRadius: "50%",
      background: bg, boxShadow: \`0 0 20px \${glow}, 0 0 40px \${glow}\`,
      fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: 18, color: "white",
    }}>
      {number}
    </div>
  );
}
\`\`\`

---

## 3. Key Point Reveal (staggered, punchy)

\`\`\`tsx
function KeyPoint({ text, index, icon = "▸", color = "#60A5FA", baseDelay = 0 }: {
  text: string; index: number; icon?: string; color?: string; baseDelay?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = baseDelay + index * 12;
  const progress = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120 } });
  const x = interpolate(progress, [0, 1], [-40, 0]);
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 14,
      opacity: progress, transform: \`translateX(\${x}px)\`,
      marginBottom: 18,
    }}>
      <span style={{ color, fontSize: 18, lineHeight: 1.4, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <span style={{
        color: "rgba(255,255,255,0.9)", fontSize: 22,
        fontFamily: "Inter, system-ui, sans-serif", fontWeight: 400, lineHeight: 1.5,
      }}>{text}</span>
    </div>
  );
}

// Usage — list of key points:
// {keyPoints.map((pt, i) => <KeyPoint key={i} text={pt} index={i} baseDelay={20} />)}
\`\`\`

---

## 4. Quiz Card with Answer Reveal

\`\`\`tsx
function QuizCard({ question, options, correctIndex, revealAtFrame }: {
  question: string;
  options: string[];
  correctIndex: number;
  revealAtFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardScale = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const revealed = frame >= revealAtFrame;

  return (
    <div style={{
      transform: \`scale(\${cardScale})\`,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16, padding: "32px 40px",
      maxWidth: 700, width: "100%",
    }}>
      {/* Question */}
      <div style={{ color: "white", fontSize: 24, fontWeight: 600, fontFamily: "Inter, sans-serif", marginBottom: 28, lineHeight: 1.4 }}>
        {question}
      </div>
      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex;
          const bg = !revealed
            ? "rgba(255,255,255,0.06)"
            : isCorrect ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.03)";
          const border = !revealed
            ? "1px solid rgba(255,255,255,0.1)"
            : isCorrect ? "1px solid rgba(34,197,94,0.8)" : "1px solid rgba(255,255,255,0.05)";
          const revealScale = revealed && isCorrect
            ? spring({ frame: frame - revealAtFrame, fps, config: { damping: 10, stiffness: 200 } })
            : 1;
          return (
            <div key={i} style={{
              background: bg, border, borderRadius: 10, padding: "14px 20px",
              display: "flex", alignItems: "center", gap: 14,
              transform: \`scale(\${revealScale})\`,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: revealed && isCorrect ? "#22C55E" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0,
                fontFamily: "Inter, sans-serif",
              }}>
                {revealed && isCorrect ? "✓" : String.fromCharCode(65 + i)}
              </span>
              <span style={{
                color: revealed && isCorrect ? "#86EFAC" : "rgba(255,255,255,0.7)",
                fontSize: 18, fontFamily: "Inter, sans-serif",
              }}>{opt}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
\`\`\`

---

## 5. Achievement Popup (slide in from top-right)

\`\`\`tsx
function AchievementPopup({ title, description, icon, delay = 0, color = "#FFD700" }: {
  title: string; description: string; icon: string; delay?: number; color?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const IN_DURATION = 15;
  const HOLD = 60;
  const OUT_START = delay + IN_DURATION + HOLD;
  const progress = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180 } });
  const outProgress = spring({ frame: frame - OUT_START, fps, config: { damping: 18, stiffness: 200 } });
  const x = interpolate(progress, [0, 1], [320, 0]) + interpolate(outProgress, [0, 1], [0, 320]);

  return (
    <div style={{
      position: "absolute", top: 56, right: 32, zIndex: 200,
      transform: \`translateX(\${x}px)\`,
      background: "#1A1A2E", border: \`1px solid \${color}44\`,
      borderRadius: 12, padding: "14px 20px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: \`0 0 24px \${color}22\`, minWidth: 280,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: \`\${color}22\`, border: \`2px solid \${color}\`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>Achievement Unlocked</div>
        <div style={{ color: "white", fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Inter, sans-serif", marginTop: 1 }}>{description}</div>
      </div>
    </div>
  );
}
\`\`\`

---

## 6. Level-Up Screen (full dramatic scene)

\`\`\`tsx
function LevelUpScene({ level, xpEarned, color = "#FFD700" }: {
  level: number; xpEarned: number; color?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Radial burst rings
  const rings = [0, 12, 24, 36].map((delay) => {
    const scale = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 60 } });
    const opacity = interpolate(frame - delay, [0, 30, 60], [0, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { scale, opacity };
  });

  const textScale = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 120 } });
  const xpScale = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ background: "#080810", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Burst rings */}
      {rings.map((ring, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 400 + i * 120, height: 400 + i * 120,
          borderRadius: "50%",
          border: \`2px solid \${color}\`,
          opacity: ring.opacity,
          transform: \`scale(\${ring.scale})\`,
        }} />
      ))}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: 4, color: color,
          textTransform: "uppercase", fontFamily: "Inter, sans-serif",
          transform: \`scale(\${textScale})\`,
        }}>Level Up!</div>

        <div style={{
          fontSize: 120, fontWeight: 900, color: "white",
          fontFamily: "Inter, sans-serif", lineHeight: 1,
          transform: \`scale(\${textScale})\`,
          textShadow: \`0 0 40px \${color}88, 0 0 80px \${color}44\`,
        }}>{level}</div>

        <div style={{
          transform: \`scale(\${xpScale})\`,
          background: \`\${color}22\`, border: \`1px solid \${color}88\`,
          borderRadius: 100, padding: "10px 28px",
          color: color, fontSize: 18, fontWeight: 700,
          fontFamily: "Inter, sans-serif",
        }}>
          +{xpEarned} XP
        </div>
      </div>
    </AbsoluteFill>
  );
}
\`\`\`

---

## 7. Full Module Structure (Scene Sequence)

\`\`\`tsx
// --- Duration constants ---
const INTRO_DUR    = 90;   // 3s  — topic title + difficulty badge
const MODULE_DUR   = 150;  // 5s  — each learning module (key points)
const QUIZ_DUR     = 150;  // 5s  — quiz card with reveal at frame 90
const LEVELUP_DUR  = 90;   // 3s  — level up celebration
const OUTRO_DUR    = 60;   // 2s  — completion summary + XP total

const MODULES = 3; // number of content modules
const TOTAL = INTRO_DUR + (MODULES * MODULE_DUR) + QUIZ_DUR + LEVELUP_DUR + OUTRO_DUR;

export const calculateMetadata = () => ({ durationInFrames: TOTAL, fps: 30 });

export default function GamifiedLesson() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const xpProgress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  let offset = 0;
  return (
    <AbsoluteFill style={{ background: "#0D0D1A", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Persistent XP bar */}
      <XPBar progress={xpProgress} maxXP={500} currentXP={0} />

      {/* Intro scene */}
      <Sequence from={offset} durationInFrames={INTRO_DUR}><IntroScene /></Sequence>

      {/* Module scenes */}
      {[0,1,2].map(i => {
        const from = INTRO_DUR + i * MODULE_DUR;
        return <Sequence key={i} from={from} durationInFrames={MODULE_DUR}><ModuleScene number={i+1} /></Sequence>;
      })}

      {/* Quiz */}
      <Sequence from={INTRO_DUR + MODULES * MODULE_DUR} durationInFrames={QUIZ_DUR}>
        <QuizScene />
      </Sequence>

      {/* Level up */}
      <Sequence from={INTRO_DUR + MODULES * MODULE_DUR + QUIZ_DUR} durationInFrames={LEVELUP_DUR}>
        <LevelUpScene level={2} xpEarned={500} />
      </Sequence>
    </AbsoluteFill>
  );
}
\`\`\`

---

## 8. Difficulty System

| Level       | Color     | Badge | XP Range |
|-------------|-----------|-------|----------|
| Beginner    | #22C55E   | 🟢    | 100–300  |
| Intermediate| #F59E0B   | 🟡    | 300–600  |
| Advanced    | #EF4444   | 🔴    | 600–1000 |
| Boss        | #A855F7   | 🟣    | 1000+    |

---

## 9. Design Rules for Learning Videos

1. **XPBar always at top** — persistent across all scenes, fills with time
2. **One concept per scene** — never overwhelm; 3–5 key points max per module
3. **Quiz after every 2–3 modules** — reinforcement before next section
4. **Achievement popups** — trigger at scene transitions (e.g. "First Module Complete!")
5. **Color consistency** — pick one accent color per topic, use it for all highlights
6. **Numbers/data animate** — use interpolate() to count up stats, never static
7. **Module number always visible** — badge top-left of each scene
8. **End every video with level-up** — always reward completion dramatically
`;
