export const REMOTION_CHEATSHEET = `# Remotion Composition Format Guide

## Overview
Create video compositions by defining scenes with elements and animations.
Each composition has metadata (title, dimensions, fps) and an array of scenes.
Scenes contain positioned elements (text, shapes, images) with optional enter/exit animations.

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

## Element Positioning
- **x, y**: Position as percentage of canvas (0-100). Center = 50, 50
- **width, height**: Size as percentage of canvas (optional)
- Elements are centered on their x,y point (translate -50%, -50%)

## Text Element
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

Properties:
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

## Shape Element
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

Shapes: "rectangle", "circle", "ellipse", "line"
- **circle/ellipse**: borderRadius set to 50% automatically
- **line**: renders as a horizontal line using strokeWidth as height

## Image Element
\`\`\`json
{
  "id": "img-1",
  "type": "image",
  "src": "https://picsum.photos/800/600",
  "x": 50, "y": 50,
  "width": 60, "height": 40,
  "objectFit": "cover",
  "borderRadius": 12,
  "enterAnimation": { "type": "fade", "durationInFrames": 20 }
}
\`\`\`

## Enter/Exit Animations
Applied as "enterAnimation" (element appears) or "exitAnimation" (element disappears).

### fade - Smooth opacity transition
\`\`\`json
{ "type": "fade", "durationInFrames": 20, "delay": 0 }
\`\`\`

### slide - Slide in from a direction
\`\`\`json
{ "type": "slide", "direction": "up", "durationInFrames": 25, "delay": 5 }
\`\`\`
Directions: "left", "right", "up", "down"

### scale - Smooth scale from 0 to 1 (no bounce)
\`\`\`json
{ "type": "scale", "durationInFrames": 20 }
\`\`\`

### spring - Bouncy entrance with physics-based motion
\`\`\`json
{ "type": "spring", "delay": 10 }
{ "type": "spring", "springConfig": { "damping": 12 } }
\`\`\`
Best for: titles, headings, key elements

### bounce - Bouncy scale (more playful)
\`\`\`json
{ "type": "bounce", "delay": 5 }
{ "type": "bounce", "springConfig": { "damping": 8, "stiffness": 200 } }
\`\`\`

### rotate - Spinning entrance
\`\`\`json
{ "type": "rotate", "durationInFrames": 30 }
\`\`\`

### blur - Focus/defocus effect
\`\`\`json
{ "type": "blur", "durationInFrames": 20 }
\`\`\`

### typewriter - Characters appear one by one (TEXT ONLY)
\`\`\`json
{ "type": "typewriter", "durationInFrames": 60, "delay": 10 }
\`\`\`

## Spring Config Presets
- **Smooth** (no bounce): { "damping": 200 }
- **Snappy** (minimal bounce): { "damping": 20, "stiffness": 200 }
- **Bouncy** (playful): { "damping": 8 }
- **Heavy** (slow, dramatic): { "damping": 15, "stiffness": 80, "mass": 2 }

## Scene Transitions
Add to a scene to animate the transition to the NEXT scene:
\`\`\`json
{ "type": "fade", "durationInFrames": 15 }
{ "type": "slide", "durationInFrames": 20, "direction": "from-left" }
{ "type": "wipe", "durationInFrames": 20, "direction": "from-right" }
{ "type": "flip", "durationInFrames": 25 }
{ "type": "clockWipe", "durationInFrames": 20 }
\`\`\`

Types: "fade", "slide", "wipe", "flip", "clockWipe"
Directions (for slide/wipe): "from-left", "from-right", "from-top", "from-bottom"

**IMPORTANT**: Transition duration overlaps adjacent scenes. Total duration = sum of all scene durations - sum of all transition durations.

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

## Timing Guide (at 30fps)
- 30 frames = 1 second
- Quick flash: 15-30 frames (0.5-1s)
- Normal scene: 60-120 frames (2-4s)
- Long scene: 150-300 frames (5-10s)
- Quick animation: 10-15 frames
- Normal animation: 20-30 frames
- Dramatic animation: 40-60 frames
- Stagger delay between elements: 5-10 frames

## Common Patterns

### Staggered Element Entrance
Give each element an increasing delay:
- Element 1: delay 0
- Element 2: delay 8
- Element 3: delay 16
- Element 4: delay 24

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
Title: "Product Launch"
Width: 1920, Height: 1080, FPS: 30

Scenes JSON:
\`\`\`json
[
  {
    "id": "intro",
    "durationInFrames": 90,
    "background": { "type": "gradient", "colors": ["#667eea", "#764ba2"], "direction": 135 },
    "elements": [
      {
        "id": "title",
        "type": "text",
        "text": "Introducing\\nAwesome Product",
        "x": 50, "y": 38,
        "fontSize": 64,
        "fontWeight": 700,
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.3,
        "enterAnimation": { "type": "spring", "delay": 5, "springConfig": { "damping": 12 } }
      },
      {
        "id": "accent-line",
        "type": "shape",
        "shape": "rectangle",
        "x": 50, "y": 52,
        "width": 10, "height": 0.4,
        "fill": "#feca57",
        "borderRadius": 4,
        "enterAnimation": { "type": "scale", "delay": 15, "durationInFrames": 20 }
      },
      {
        "id": "subtitle",
        "type": "text",
        "text": "The future is here",
        "x": 50, "y": 60,
        "fontSize": 28,
        "color": "rgba(255,255,255,0.8)",
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
        "id": "feat-title",
        "type": "text",
        "text": "Key Features",
        "x": 50, "y": 22,
        "fontSize": 48,
        "fontWeight": 700,
        "color": "#ffffff",
        "enterAnimation": { "type": "fade", "durationInFrames": 20 }
      },
      {
        "id": "feat-1",
        "type": "text",
        "text": "Lightning Fast",
        "x": 50, "y": 42,
        "fontSize": 32,
        "color": "#feca57",
        "enterAnimation": { "type": "spring", "delay": 10 }
      },
      {
        "id": "feat-2",
        "type": "text",
        "text": "Secure by Default",
        "x": 50, "y": 54,
        "fontSize": 32,
        "color": "#55efc4",
        "enterAnimation": { "type": "spring", "delay": 18 }
      },
      {
        "id": "feat-3",
        "type": "text",
        "text": "Easy to Deploy",
        "x": 50, "y": 66,
        "fontSize": 32,
        "color": "#74b9ff",
        "enterAnimation": { "type": "spring", "delay": 26 }
      }
    ]
  }
]
\`\`\`

## Important Rules
1. Every scene MUST have a unique "id" string
2. Every element MUST have a unique "id" string
3. durationInFrames must be a positive integer
4. x, y positions are percentages (0-100), center = 50, 50
5. width, height for elements are percentages of canvas
6. fontSize is in pixels
7. DO NOT use CSS transitions or animations - only frame-based animations
8. Transition durations overlap scenes (subtracted from total)
9. Always call read_me first before creating a composition
10. Keep scenes focused - 2-5 elements per scene works best
`;
