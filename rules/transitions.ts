export const RULE_TRANSITIONS = `# Scene Transitions

Add to a scene to animate the transition to the NEXT scene. Do NOT add a transition to the last scene.

## Types

### fade
\`\`\`json
{ "type": "fade", "durationInFrames": 15 }
\`\`\`

### slide
\`\`\`json
{ "type": "slide", "durationInFrames": 20, "direction": "from-left" }
\`\`\`

### wipe
\`\`\`json
{ "type": "wipe", "durationInFrames": 20, "direction": "from-right" }
\`\`\`

### flip
\`\`\`json
{ "type": "flip", "durationInFrames": 25 }
\`\`\`

### clockWipe
\`\`\`json
{ "type": "clockWipe", "durationInFrames": 20 }
\`\`\`

## Directions (for slide/wipe)
"from-left", "from-right", "from-top", "from-bottom"

## Duration Calculation

**IMPORTANT**: Transition durations overlap adjacent scenes.

Total composition duration = sum of all scene durations - sum of all transition durations.

Example: 3 scenes of 60 frames each, with two 15-frame transitions:
60 + 60 + 60 - 15 - 15 = 150 frames (not 180)

## Tips
- 10-15 frames for quick transitions
- 15-20 frames for normal transitions
- 20-30 frames for dramatic transitions
- Fade is the safest default
- Slide works great for sequential content (presentations)
`;
