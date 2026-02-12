export const RULE_SHAPE_ELEMENTS = `# Shape Elements

\`\`\`json
{
  "id": "rect-1",
  "type": "shape",
  "shape": "rectangle",
  "x": 50, "y": 50,
  "width": 40, "height": 30,
  "fill": "#e74c3c",
  "stroke": "#ffffff",
  "strokeWidth": 3,
  "borderRadius": 12,
  "shadow": "0 4px 20px rgba(0,0,0,0.3)",
  "enterAnimation": { "type": "scale" }
}
\`\`\`

## Shape Types

- **"rectangle"**: Standard box, supports borderRadius
- **"circle"**: borderRadius automatically set to 50%
- **"ellipse"**: borderRadius automatically set to 50%
- **"line"**: Renders as a horizontal line using strokeWidth as height

## Properties

- **fill**: Fill color (CSS color)
- **stroke**: Border/outline color
- **strokeWidth**: Border width in pixels
- **borderRadius**: Corner rounding in pixels (rectangle only)
- **shadow**: CSS box-shadow string, e.g. "0 4px 20px rgba(0,0,0,0.3)"

## Common Uses

- Accent lines: rectangle at height 0.3-0.5%, width 8-15%
- Background cards: rectangle with borderRadius 12-16, fill with alpha
- Decorative circles: circle with fill and shadow
- Dividers: line at full width
`;
