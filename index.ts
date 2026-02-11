import { MCPServer, text, widget } from "mcp-use/server";
import { z } from "zod";
import { REMOTION_CHEATSHEET } from "./cheatsheet.js";

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

server.tool(
  {
    name: "read_me",
    description:
      "IMPORTANT: Call this FIRST before creating any composition. Returns the complete guide for the Remotion scene description format including element types, animation options, color palettes, timing guide, and full examples.",
  },
  async () => {
    return text(REMOTION_CHEATSHEET);
  }
);

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
      'Array of scene objects (or JSON string). Each scene: { id: string, durationInFrames: number, background: { type: "solid"|"gradient", color?: string, colors?: string[], direction?: number }, elements: [{ id, type: "text"|"shape"|"image", x, y, ... }], transition?: { type: "fade"|"slide"|"wipe"|"flip"|"clockWipe", durationInFrames, direction? } }'
    ),
});

// @ts-expect-error - Zod v4 type depth issue with mcp-use generics
server.tool(
  {
    name: "create_composition",
    description:
      "Create or update a Remotion video composition. Renders as a live interactive video player with play/pause/scrub controls. Call read_me first to learn the format.",
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
      // Already an array (ChatGPT sends objects directly)
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
          `To iterate: call create_composition again with modified scenes. You can change colors, text, animations, add/remove elements, or add new scenes.`
      ),
    });
  }
);

await server.listen(port);
