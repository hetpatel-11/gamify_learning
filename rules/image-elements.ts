export const RULE_IMAGE_ELEMENTS = `# Image Elements

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

## Properties

- **src**: Image URL (must be HTTPS, CORS-enabled)
- **objectFit**: "cover" (fills area, may crop), "contain" (fits inside, may have gaps), "fill" (stretches)
- **borderRadius**: Corner rounding in pixels

## Allowed Domains

Images can be loaded from:
- https://images.unsplash.com
- https://picsum.photos

## Tips

- Always set width and height for images
- Use objectFit "cover" for full-bleed backgrounds
- Use objectFit "contain" for logos/icons that shouldn't be cropped
- Add borderRadius for rounded image cards
`;
