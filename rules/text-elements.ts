export const RULE_TEXT_ELEMENTS = `# Text Elements

\`\`\`json
{
  "id": "title-1",
  "type": "text",
  "text": "Hello World",
  "x": 50, "y": 40,
  "fontSize": 72,
  "fontWeight": 700,
  "color": "#ffffff",
  "fontFamily": "sans-serif",
  "textAlign": "center",
  "lineHeight": 1.2,
  "letterSpacing": 2,
  "backgroundColor": "rgba(0,0,0,0.3)",
  "padding": 16,
  "borderRadius": 8,
  "maxWidth": 80,
  "enterAnimation": { "type": "spring", "delay": 5 }
}
\`\`\`

## Properties

- **text**: The text content. Use \\n for line breaks
- **fontSize**: In pixels (72 = large title, 48 = heading, 32 = subheading, 24 = body, 16 = small)
- **fontWeight**: 100-900 (400 = normal, 700 = bold)
- **color**: Any CSS color
- **fontFamily**: "sans-serif", "serif", "monospace", "Arial", "Georgia", "Helvetica"
- **textAlign**: "left", "center", "right"
- **lineHeight**: Multiplier (1.2 = tight, 1.5 = normal, 1.8 = loose)
- **letterSpacing**: In pixels
- **backgroundColor**: Optional text background (great for labels/badges)
- **padding**: Pixels of padding around text (used with backgroundColor)
- **borderRadius**: Pixels (used with backgroundColor)
- **maxWidth**: Percentage of canvas width to constrain text wrapping
`;
