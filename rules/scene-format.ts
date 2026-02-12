export const RULE_SCENE_FORMAT = `# Scene Format

## Scene Structure
\`\`\`json
{
  "id": "scene-1",
  "durationInFrames": 90,
  "background": { ... },
  "elements": [ ... ],
  "transition": { ... }
}
\`\`\`

- **id**: Unique string identifier
- **durationInFrames**: How long this scene lasts (integer). At 30fps: 30 frames = 1 second
- **background**: Scene background (solid or gradient)
- **elements**: Array of text, shape, or image elements
- **transition**: Optional transition to the NEXT scene

## Background Types

### Solid
\`\`\`json
{ "type": "solid", "color": "#1a1a2e" }
\`\`\`

### Gradient
\`\`\`json
{ "type": "gradient", "colors": ["#667eea", "#764ba2"], "direction": 135 }
\`\`\`
- direction: angle in degrees (0 = top-to-bottom, 90 = left-to-right, 135 = diagonal)
- supports 2+ colors

## Element Positioning
- **x, y**: Position as percentage of canvas (0-100). Center = 50, 50
- **width, height**: Size as percentage of canvas (optional)
- Elements are centered on their x,y point (translate -50%, -50%)
- **rotation**: Degrees of rotation (optional)
- **opacity**: 0-1 (optional, default 1)
`;
