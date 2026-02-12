export const RULE_INDEX = `# Remotion MCP - Composition Format Guide

Create video compositions by defining scenes with elements and animations.
Each composition has metadata (title, dimensions, fps) and an array of scenes.
Scenes contain positioned elements (text, shapes, images) with optional enter/exit animations.

## Available Rules

Call these tools to learn specific topics before creating a composition:

- **rule_scene_format** - Scene structure, backgrounds (solid/gradient), element positioning (x/y percentages)
- **rule_text_elements** - Text properties: fontSize, fontWeight, color, fontFamily, textAlign, lineHeight, backgroundColor, padding
- **rule_shape_elements** - Shape types (rectangle, circle, ellipse, line), fill, stroke, borderRadius, shadow
- **rule_image_elements** - Image src, objectFit, borderRadius
- **rule_animations** - Enter/exit animations: fade, slide, scale, spring, bounce, rotate, blur, typewriter + spring config presets
- **rule_transitions** - Scene-to-scene transitions: fade, slide, wipe, flip, clockWipe + duration calculation
- **rule_timing** - FPS guide, duration in frames, common timing patterns, staggered entrances
- **rule_examples** - Full working examples, color palettes, common patterns (title card, slide deck, kinetic typography)

## Quick Start

1. Call **rule_scene_format** to understand the scene structure
2. Call **rule_animations** to learn animation options
3. Call **create_composition** with your scenes

## Important Rules

1. Every scene MUST have a unique "id" string
2. Every element MUST have a unique "id" string
3. durationInFrames must be a positive integer
4. x, y positions are percentages (0-100), center = 50, 50
5. width, height for elements are percentages of canvas
6. fontSize is in pixels
7. DO NOT use CSS transitions or animations - only frame-based animations
8. Transition durations overlap scenes (subtracted from total)
9. Keep scenes focused - 2-5 elements per scene works best
`;
