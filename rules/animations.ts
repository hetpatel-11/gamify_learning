export const RULE_ANIMATIONS = `# Enter/Exit Animations

Applied as "enterAnimation" (element appears) or "exitAnimation" (element disappears).

## fade - Smooth opacity transition
\`\`\`json
{ "type": "fade", "durationInFrames": 20, "delay": 0 }
\`\`\`

## slide - Slide in from a direction
\`\`\`json
{ "type": "slide", "direction": "up", "durationInFrames": 25, "delay": 5 }
\`\`\`
Directions: "left", "right", "up", "down"

## scale - Smooth scale from 0 to 1 (no bounce)
\`\`\`json
{ "type": "scale", "durationInFrames": 20 }
\`\`\`

## spring - Bouncy entrance with physics-based motion
\`\`\`json
{ "type": "spring", "delay": 10 }
{ "type": "spring", "springConfig": { "damping": 12 } }
\`\`\`
Best for: titles, headings, key elements

## bounce - Bouncy scale (more playful)
\`\`\`json
{ "type": "bounce", "delay": 5 }
{ "type": "bounce", "springConfig": { "damping": 8, "stiffness": 200 } }
\`\`\`

## rotate - Spinning entrance
\`\`\`json
{ "type": "rotate", "durationInFrames": 30 }
\`\`\`

## blur - Focus/defocus effect
\`\`\`json
{ "type": "blur", "durationInFrames": 20 }
\`\`\`

## typewriter - Characters appear one by one (TEXT ONLY)
\`\`\`json
{ "type": "typewriter", "durationInFrames": 60, "delay": 10 }
\`\`\`

## Spring Config Presets
- **Smooth** (no bounce): { "damping": 200 }
- **Snappy** (minimal bounce): { "damping": 20, "stiffness": 200 }
- **Bouncy** (playful): { "damping": 8 }
- **Heavy** (slow, dramatic): { "damping": 15, "stiffness": 80, "mass": 2 }

## Animation Properties
- **delay**: Frames to wait before starting (default 0)
- **durationInFrames**: Animation length in frames (default 20)
- **direction**: For slide only - "left", "right", "up", "down"
- **springConfig**: For spring/bounce/scale - { damping, stiffness, mass }
`;
