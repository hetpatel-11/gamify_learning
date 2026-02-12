export const RULE_TIMING = `# Timing Guide

## FPS Reference (at 30fps)
- 30 frames = 1 second
- 15 frames = 0.5 seconds
- 60 frames = 2 seconds
- 90 frames = 3 seconds
- 150 frames = 5 seconds

## Scene Duration Guide
- Quick flash: 15-30 frames (0.5-1s)
- Normal scene: 60-120 frames (2-4s)
- Long scene (lots of content): 150-300 frames (5-10s)

## Animation Duration Guide
- Quick animation: 10-15 frames
- Normal animation: 20-30 frames
- Dramatic animation: 40-60 frames

## Stagger Delay Pattern
Give each element an increasing delay for sequential entrances:
- Element 1: delay 0
- Element 2: delay 8
- Element 3: delay 16
- Element 4: delay 24

## Timing Formula
Total composition seconds = total frames / fps

Total frames = sum of scene durationInFrames - sum of transition durationInFrames

## Tips
- Scene duration should be long enough for all enter animations to complete
- Exit animations start counting from the END of the scene
- Leave at least 15-20 frames after the last animation for the audience to read
`;
