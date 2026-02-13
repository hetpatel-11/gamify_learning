export const RULE_INDEX = `# Remotion MCP — Video Creation Guide

Create videos using React component code with full Remotion API access.

## Available Rules

- **rule_react_code** - React.createElement API reference, all available Remotion imports, code examples
- **rule_timing** - FPS guide, duration in frames, animation timing patterns

## Quick Start

1. Call **rule_react_code** for the API reference
2. Call **create_video** with your React component code

## Important Rules

1. Use React.createElement, NOT JSX
2. Code must be valid JavaScript (not TypeScript)
3. Hooks (useCurrentFrame, useState, etc.) must be called at the top level
4. Must return a React element
5. DO NOT use CSS transitions/animations — only Remotion frame-based animations
6. durationInFrames is set in the tool parameters, not in the code
`;
