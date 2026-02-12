export const RULE_EXAMPLES = `# Examples & Color Palettes

## Color Palettes

### Dark Professional
- Background: gradient ["#0f0c29", "#302b63", "#24243e"]
- Text: #ffffff, #e0e0e0, #b0b0b0
- Accent: #667eea, #764ba2

### Vibrant
- Background: gradient ["#ff6b6b", "#feca57"]
- Text: #2d3436, #ffffff
- Accent: #00cec9, #6c5ce7

### Minimal Clean
- Background: #ffffff or #f8f9fa
- Text: #2d3436, #636e72
- Accent: #0984e3, #00b894

### Sunset
- Background: gradient ["#f12711", "#f5af19"]
- Text: #ffffff, #ffeaa7
- Accent: #e17055, #fab1a0

### Ocean
- Background: gradient ["#2193b0", "#6dd5ed"]
- Text: #ffffff, #dfe6e9
- Accent: #00cec9, #55efc4

### Neon Dark
- Background: #0a0a0a or gradient ["#0a0a0a", "#1a1a2e"]
- Text: #ffffff
- Accent: #00ff87, #60efff, #ff00ff

### Corporate
- Background: #ffffff or gradient ["#2c3e50", "#3498db"]
- Text: #2c3e50, #ecf0f1
- Accent: #3498db, #2ecc71

## Common Patterns

### Title Card
One scene with:
- Large title at y=40 with spring animation
- Subtitle at y=58 with fade + delay 20
- Accent line/shape at y=52 with scale + delay 12

### Slide Deck
Multiple scenes with transitions:
- Each scene has heading + content
- Use fade or slide transitions (15-20 frames)
- Stagger elements within each scene

### Social Media Post (Square)
- width: 1080, height: 1080
- Bold colors, large text (fontSize 56-80)
- Quick animations, 2-4 seconds total

### Kinetic Typography
- Multiple text elements appearing in sequence
- Mix spring, slide, and typewriter animations
- Dark background, white/colored text

## Full Example

Title: "Product Launch", 1920x1080, 30fps

\`\`\`json
[
  {
    "id": "intro",
    "durationInFrames": 90,
    "background": { "type": "gradient", "colors": ["#667eea", "#764ba2"], "direction": 135 },
    "elements": [
      {
        "id": "title", "type": "text", "text": "Introducing\\nAwesome Product",
        "x": 50, "y": 38, "fontSize": 64, "fontWeight": 700, "color": "#ffffff",
        "textAlign": "center", "lineHeight": 1.3,
        "enterAnimation": { "type": "spring", "delay": 5, "springConfig": { "damping": 12 } }
      },
      {
        "id": "line", "type": "shape", "shape": "rectangle",
        "x": 50, "y": 52, "width": 10, "height": 0.4, "fill": "#feca57", "borderRadius": 4,
        "enterAnimation": { "type": "scale", "delay": 15, "durationInFrames": 20 }
      },
      {
        "id": "sub", "type": "text", "text": "The future is here",
        "x": 50, "y": 60, "fontSize": 28, "color": "rgba(255,255,255,0.8)",
        "enterAnimation": { "type": "fade", "delay": 20, "durationInFrames": 25 }
      }
    ],
    "transition": { "type": "fade", "durationInFrames": 15 }
  },
  {
    "id": "features",
    "durationInFrames": 120,
    "background": { "type": "gradient", "colors": ["#764ba2", "#302b63"], "direction": 135 },
    "elements": [
      {
        "id": "feat-title", "type": "text", "text": "Key Features",
        "x": 50, "y": 22, "fontSize": 48, "fontWeight": 700, "color": "#ffffff",
        "enterAnimation": { "type": "fade", "durationInFrames": 20 }
      },
      {
        "id": "f1", "type": "text", "text": "Lightning Fast",
        "x": 50, "y": 42, "fontSize": 32, "color": "#feca57",
        "enterAnimation": { "type": "spring", "delay": 10 }
      },
      {
        "id": "f2", "type": "text", "text": "Secure by Default",
        "x": 50, "y": 54, "fontSize": 32, "color": "#55efc4",
        "enterAnimation": { "type": "spring", "delay": 18 }
      },
      {
        "id": "f3", "type": "text", "text": "Easy to Deploy",
        "x": 50, "y": 66, "fontSize": 32, "color": "#74b9ff",
        "enterAnimation": { "type": "spring", "delay": 26 }
      }
    ]
  }
]
\`\`\`
`;
