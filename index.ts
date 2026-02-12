import { MCPServer, text, widget } from "mcp-use/server";
import { z } from "zod";
import { RULE_INDEX } from "./rules/index.js";
import { RULE_SCENE_FORMAT } from "./rules/scene-format.js";
import { RULE_TEXT_ELEMENTS } from "./rules/text-elements.js";
import { RULE_SHAPE_ELEMENTS } from "./rules/shape-elements.js";
import { RULE_IMAGE_ELEMENTS } from "./rules/image-elements.js";
import { RULE_ANIMATIONS } from "./rules/animations.js";
import { RULE_TRANSITIONS } from "./rules/transitions.js";
import { RULE_TIMING } from "./rules/timing.js";
import { RULE_EXAMPLES } from "./rules/examples.js";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = new MCPServer({
  name: "remotion-mcp",
  title: "Remotion Video Creator",
  version: "1.0.0",
  description:
    "Create animated video compositions with Remotion. Design multi-scene videos with text, shapes, images, animations, and transitions - all through conversation.",
  host: process.env.HOST ?? "0.0.0.0",
  baseUrl: process.env.MCP_URL ?? `http://localhost:${port}`,
});

// --- Rule tools (skill-style routing) ---

server.tool(
  {
    name: "read_me",
    description:
      "IMPORTANT: Call this FIRST before creating any composition. Returns the format guide overview and lists available rule tools for specific topics (animations, transitions, text, shapes, images, timing, examples).",
  },
  async () => text(RULE_INDEX)
);

server.tool(
  { name: "rule_scene_format", description: "Scene structure, backgrounds (solid/gradient), element positioning" },
  async () => text(RULE_SCENE_FORMAT)
);

server.tool(
  { name: "rule_text_elements", description: "Text element properties: fontSize, fontWeight, color, fontFamily, textAlign, lineHeight, backgroundColor" },
  async () => text(RULE_TEXT_ELEMENTS)
);

server.tool(
  { name: "rule_shape_elements", description: "Shape types (rectangle, circle, ellipse, line), fill, stroke, borderRadius, shadow" },
  async () => text(RULE_SHAPE_ELEMENTS)
);

server.tool(
  { name: "rule_image_elements", description: "Image src, objectFit, borderRadius, allowed domains" },
  async () => text(RULE_IMAGE_ELEMENTS)
);

server.tool(
  { name: "rule_animations", description: "Enter/exit animations: fade, slide, scale, spring, bounce, rotate, blur, typewriter + spring config presets" },
  async () => text(RULE_ANIMATIONS)
);

server.tool(
  { name: "rule_transitions", description: "Scene-to-scene transitions: fade, slide, wipe, flip, clockWipe + duration calculation" },
  async () => text(RULE_TRANSITIONS)
);

server.tool(
  { name: "rule_timing", description: "FPS guide, duration in frames, scene/animation timing, staggered entrances" },
  async () => text(RULE_TIMING)
);

server.tool(
  { name: "rule_examples", description: "Full working examples, color palettes, common patterns (title card, slide deck, kinetic typography)" },
  async () => text(RULE_EXAMPLES)
);

// --- Composition tool ---

const compositionSchema = z.object({
  title: z.string().describe("Title of the composition"),
  width: z
    .number()
    .optional()
    .default(1920)
    .describe("Canvas width in pixels (default: 1920)"),
  height: z
    .number()
    .optional()
    .default(1080)
    .describe("Canvas height in pixels (default: 1080)"),
  fps: z
    .number()
    .optional()
    .default(30)
    .describe("Frames per second (default: 30)"),
  scenes: z
    .union([z.string(), z.array(z.any())])
    .describe(
      'Array of scene objects (or JSON string). Each scene: { id, durationInFrames, background, elements, transition? }. Call read_me and rule tools first to learn the format.'
    ),
});

// @ts-expect-error - Zod v4 type depth issue with mcp-use generics
server.tool(
  {
    name: "create_composition",
    description:
      "Create or update a Remotion video composition. Renders as a live interactive video player. Call read_me first, then call specific rule tools as needed to learn the format.",
    schema: compositionSchema,
    widget: {
      name: "remotion-player",
      invoking: "Creating video composition...",
      invoked: "Video composition ready",
    },
  },
  async (params: z.infer<typeof compositionSchema>) => {
    const { title, width, height, fps, scenes } = params;
    let parsedScenes;
    if (Array.isArray(scenes)) {
      parsedScenes = scenes;
    } else {
      try {
        parsedScenes = JSON.parse(scenes);
      } catch {
        return text(
          "Error: Invalid JSON in scenes parameter. Please provide a valid JSON array of scene objects."
        );
      }
    }

    if (!Array.isArray(parsedScenes) || parsedScenes.length === 0) {
      return text("Error: scenes must be a non-empty JSON array.");
    }

    for (let i = 0; i < parsedScenes.length; i++) {
      const scene = parsedScenes[i];
      if (!scene.id || !scene.durationInFrames || !scene.background) {
        return text(
          `Error: Scene at index ${i} is missing required fields (id, durationInFrames, background).`
        );
      }
    }

    const composition = JSON.stringify({
      meta: { title, width, height, fps },
      scenes: parsedScenes,
    });

    let totalFrames = 0;
    for (let i = 0; i < parsedScenes.length; i++) {
      totalFrames += parsedScenes[i].durationInFrames || 0;
      if (i < parsedScenes.length - 1 && parsedScenes[i].transition) {
        totalFrames -= parsedScenes[i].transition.durationInFrames || 0;
      }
    }
    const totalSeconds = (totalFrames / fps).toFixed(1);

    return widget({
      props: { composition },
      output: text(
        `Created composition "${title}" (${width}x${height}, ${fps}fps, ${parsedScenes.length} scene(s), ~${totalSeconds}s).\n` +
          `The video is now playing in the widget with full playback controls.\n` +
          `To iterate: call create_composition again with modified scenes.`
      ),
    });
  }
);

await server.listen(port);
