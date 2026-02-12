import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { z } from "zod";
import type { WidgetMetadata } from "mcp-use/react";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import { Player, type PlayerRef } from "@remotion/player";
import { DynamicComposition } from "./components/DynamicComposition";
import { EditorLayout } from "./components/editor/EditorLayout";
import { getEditorTheme } from "./components/editor/EditorControls";
import { useCompositionEditor } from "./components/editor/useCompositionEditor";
import type { CompositionData, SceneData } from "../../types";

// --- Widget metadata for mcp-use auto-registration ---
const propSchema = z.object({
  composition: z
    .string()
    .describe("JSON string containing the full composition data"),
});

// @ts-expect-error - Zod v4 deep type instantiation with mcp-use WidgetMetadata
export const widgetMetadata: WidgetMetadata = {
  description: "Interactive Remotion video player for previewing compositions",
  props: propSchema,
  exposeAsTool: false,
  metadata: {
    prefersBorder: true,
    autoResize: true,
    widgetDescription:
      "Renders a live Remotion video composition with play/pause/scrub controls",
    csp: {
      resourceDomains: [
        "https://images.unsplash.com",
        "https://picsum.photos",
      ],
    },
  },
};

// --- Helpers ---

function calculateTotalDuration(scenes: SceneData[]): number {
  let total = 0;
  for (let i = 0; i < scenes.length; i++) {
    total += scenes[i].durationInFrames;
    if (i < scenes.length - 1 && scenes[i].transition) {
      total -= scenes[i].transition!.durationInFrames;
    }
  }
  return Math.max(total, 1);
}

/**
 * Try to parse scenes from a value that may be:
 * - A complete JSON array (object)
 * - A complete JSON string
 * - An incomplete/streaming JSON string (partial)
 * Returns whatever valid scenes we can extract, or empty array.
 */
function tryParseScenes(raw: unknown): SceneData[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.filter(
      (s) => s && typeof s === "object" && s.id && s.durationInFrames && s.background
    );
  }

  if (typeof raw !== "string" || raw.trim().length === 0) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (s: any) => s && typeof s === "object" && s.id && s.durationInFrames && s.background
      );
    }
    return [];
  } catch {
    return extractPartialScenes(raw);
  }
}

/**
 * Extract complete scene objects from a partially streamed JSON array string.
 * e.g. '[{"id":"s1",...},{"id":"s2",...},{"id":"s3' -> first 2 scenes
 */
function extractPartialScenes(raw: string): SceneData[] {
  const scenes: SceneData[] = [];
  let depth = 0;
  let objectStart = -1;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === "{") {
      if (depth === 0) objectStart = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && objectStart >= 0) {
        const chunk = raw.slice(objectStart, i + 1);
        try {
          const obj = JSON.parse(chunk);
          if (obj.id && obj.durationInFrames && obj.background) {
            scenes.push(obj);
          }
        } catch {
          // incomplete object, skip
        }
        objectStart = -1;
      }
    }
  }

  return scenes;
}

// --- LocalStorage persistence for surviving fullscreen remounts ---
const STORAGE_KEY = "remotion-mcp-composition";
const STORAGE_EDIT_KEY = "remotion-mcp-edit-mode";

function persistComposition(comp: CompositionData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comp));
  } catch { /* noop */ }
}

function loadPersistedComposition(): CompositionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return null;
}

function persistEditMode(editing: boolean) {
  try {
    localStorage.setItem(STORAGE_EDIT_KEY, editing ? "1" : "0");
  } catch { /* noop */ }
}

function loadPersistedEditMode(): boolean {
  try {
    return localStorage.getItem(STORAGE_EDIT_KEY) === "1";
  } catch { /* noop */ }
  return false;
}

// --- Main widget using raw MCP Apps SDK for streaming ---

const RemotionPlayerWidget: React.FC = () => {
  // Raw tool input — updates progressively during streaming via ontoolinputpartial
  const [toolInput, setToolInput] = useState<Record<string, unknown> | null>(null);
  const [inputIsFinal, setInputIsFinal] = useState(false);
  // Tool result props (from ontoolresult)
  const [resultProps, setResultProps] = useState<Record<string, unknown> | null>(null);
  // Persisted composition from localStorage (survives fullscreen remount)
  const [persistedComp, setPersistedComp] = useState<CompositionData | null>(
    () => loadPersistedComposition()
  );

  const playerRef = useRef<PlayerRef>(null);
  const [isEditMode, setIsEditMode] = useState(() => loadPersistedEditMode());
  const [theme, setTheme] = useState<"light" | "dark">("light");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef = useRef<any>(null);

  // --- Wire up the raw MCP Apps SDK ---
  useApp({
    appInfo: { name: "Remotion Video Creator", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      appRef.current = app;

      // STREAMING: fires repeatedly as LLM generates tokens
      app.ontoolinputpartial = (params: any) => {
        setInputIsFinal(false);
        setToolInput(params?.arguments ?? params ?? {});
      };

      // COMPLETE: fires once when tool arguments are finalized
      app.ontoolinput = (params: any) => {
        setInputIsFinal(true);
        setToolInput(params?.arguments ?? params ?? {});
      };

      // RESULT: fires when tool execution completes on server
      app.ontoolresult = (result: any) => {
        const props =
          result?.structuredContent?.["mcp-use/props"]
          ?? result?.content?.[0]?.["mcp-use/props"]
          ?? {};
        setResultProps(props);
      };

      // Theme changes from host
      app.onhostcontextchanged = (params: any) => {
        if (params?.theme) setTheme(params.theme);
      };
    },
  });

  // Detect theme from system on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      if (isDark) setTheme("dark");
    }
  }, []);

  // --- Streaming composition: parse partial scenes from toolInput ---
  const streamingComposition = useMemo<CompositionData | null>(() => {
    if (inputIsFinal || !toolInput) return null;

    const scenes = tryParseScenes(toolInput.scenes);
    if (scenes.length === 0 && !toolInput.title) return null;

    return {
      meta: {
        title: (toolInput.title as string) || "Untitled",
        width: (toolInput.width as number) || 1920,
        height: (toolInput.height as number) || 1080,
        fps: (toolInput.fps as number) || 30,
      },
      scenes,
    };
  }, [inputIsFinal, toolInput]);

  // --- Final composition: from result props, final toolInput, or persisted ---
  const finalComposition = useMemo<CompositionData | null>(() => {
    // From result props (widget props from server)
    const compStr = (resultProps as any)?.composition;
    if (compStr && typeof compStr === "string") {
      try { return JSON.parse(compStr); } catch { /* noop */ }
    }

    // From final tool input
    if (inputIsFinal && toolInput?.scenes) {
      const raw = toolInput.scenes;
      let parsedScenes: SceneData[] = [];
      if (typeof raw === "string") {
        try { parsedScenes = JSON.parse(raw); } catch { /* noop */ }
      } else if (Array.isArray(raw)) {
        parsedScenes = raw;
      }
      if (parsedScenes.length > 0) {
        return {
          meta: {
            title: (toolInput.title as string) || "Untitled",
            width: (toolInput.width as number) || 1920,
            height: (toolInput.height as number) || 1080,
            fps: (toolInput.fps as number) || 30,
          },
          scenes: parsedScenes,
        };
      }
    }

    // Fallback: persisted from localStorage (survives fullscreen remount)
    if (persistedComp) return persistedComp;

    return null;
  }, [resultProps, inputIsFinal, toolInput, persistedComp]);

  // Persist composition whenever final changes
  useEffect(() => {
    if (finalComposition) {
      persistComposition(finalComposition);
    }
  }, [finalComposition]);

  // When a NEW final arrives from a new tool call, exit edit mode
  const prevFinalRef = useRef(finalComposition);
  useEffect(() => {
    if (finalComposition && finalComposition !== prevFinalRef.current && prevFinalRef.current !== null) {
      setIsEditMode(false);
      persistEditMode(false);
    }
    prevFinalRef.current = finalComposition;
  }, [finalComposition]);

  const isStreaming = !inputIsFinal && !finalComposition;
  const composition = finalComposition || streamingComposition;

  const totalDuration = useMemo(() => {
    if (!composition?.scenes?.length) return 1;
    return calculateTotalDuration(composition.scenes);
  }, [composition?.scenes]);

  const isDark = theme === "dark";
  const bgPrimary = isDark ? "#16213e" : "#f8f9fa";
  const bgSecondary = isDark ? "#1a1a2e" : "#e9ecef";
  const textPrimary = isDark ? "#e0e0e0" : "#333333";
  const textSecondary = isDark ? "#888888" : "#999999";
  const borderColor = isDark ? "#0f3460" : "#dee2e6";
  const accent = isDark ? "#4a9eff" : "#0066cc";
  const editorColors = getEditorTheme(isDark);

  const enterEditMode = useCallback(async () => {
    // Persist state BEFORE requesting fullscreen (which may remount the widget)
    if (finalComposition) persistComposition(finalComposition);
    persistEditMode(true);
    setIsEditMode(true);
    try {
      await appRef.current?.requestDisplayMode?.({ mode: "fullscreen" });
    } catch { /* noop */ }
  }, [finalComposition]);

  const exitEditMode = useCallback(async () => {
    setIsEditMode(false);
    persistEditMode(false);
    try {
      await appRef.current?.requestDisplayMode?.({ mode: "inline" });
    } catch { /* noop */ }
  }, []);

  const handleSendFollowUp = useCallback(async (prompt: string) => {
    try {
      await appRef.current?.sendFollowUpMessage?.(prompt);
    } catch { /* noop */ }
  }, []);

  // --- Loading: no data yet ---
  if (!composition) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 280,
          backgroundColor: bgPrimary,
          borderRadius: 12,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: textSecondary }}>
          <StreamingDot color={accent} size={32} />
          <div style={{ fontSize: 14, marginTop: 16 }}>
            {toolInput?.title
              ? `Building scenes for "${toolInput.title}"...`
              : "Generating composition..."}
          </div>
          <div style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>
            Preview will appear as scenes stream in
          </div>
        </div>
      </div>
    );
  }

  // --- Edit mode ---
  if (isEditMode && finalComposition) {
    return (
      <EditModeWrapper
        composition={finalComposition}
        colors={editorColors}
        sendFollowUpMessage={handleSendFollowUp}
        onClose={exitEditMode}
      />
    );
  }

  // --- Streaming or View mode ---
  const meta = composition.meta;
  const sceneCount = composition.scenes?.length || 0;
  const durationSec = (totalDuration / meta.fps).toFixed(1);

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: bgPrimary,
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: bgSecondary,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: textPrimary,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {isStreaming ? (
            <StreamingDot color={accent} />
          ) : (
            <span style={{ fontSize: 16 }}>&#127916;</span>
          )}
          <span>{isStreaming ? (meta.title || "Creating...") : meta.title}</span>
          {isStreaming && (
            <span style={{ fontSize: 11, color: accent, fontWeight: 400 }}>
              streaming...
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
            color: textSecondary,
          }}
        >
          <span>{meta.width}x{meta.height}</span>
          <span>{meta.fps}fps</span>
          <span>
            {sceneCount} scene{sceneCount !== 1 ? "s" : ""}
            {isStreaming ? " loaded" : ""}
          </span>
          {!isStreaming && <span>{durationSec}s</span>}
          {!isStreaming && (
            <button
              onClick={enterEditMode}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid ${accent}`,
                borderRadius: 4,
                cursor: "pointer",
                backgroundColor: "transparent",
                color: accent,
                fontFamily: "inherit",
                transition: "background-color 0.15s",
              }}
            >
              &#9998; Edit
            </button>
          )}
        </div>
      </div>

      {/* Player — renders during both streaming and final */}
      <div style={{ backgroundColor: "#000" }}>
        <Player
          key={isStreaming ? `streaming-${sceneCount}` : "final"}
          ref={playerRef}
          component={DynamicComposition}
          inputProps={{ scenes: composition.scenes }}
          durationInFrames={totalDuration}
          fps={meta.fps}
          compositionWidth={meta.width}
          compositionHeight={meta.height}
          controls={!isStreaming}
          autoPlay
          loop
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

// --- Pulsing dot indicator for streaming state ---
const StreamingDot: React.FC<{ color: string; size?: number }> = ({
  color,
  size = 10,
}) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let frame: number;
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) % 1200;
      setOpacity(0.3 + 0.7 * Math.abs(Math.sin((elapsed / 1200) * Math.PI)));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        opacity,
        transition: "opacity 0.1s",
      }}
    />
  );
};

/**
 * Wrapper that initializes the composition editor hook.
 * Separated so useCompositionEditor doesn't run until edit mode.
 */
const EditModeWrapper: React.FC<{
  composition: CompositionData;
  colors: ReturnType<typeof getEditorTheme>;
  sendFollowUpMessage: (prompt: string) => Promise<void>;
  onClose: () => void;
}> = ({ composition, colors, sendFollowUpMessage, onClose }) => {
  const editor = useCompositionEditor(composition);

  useEffect(() => {
    editor.resetTo(composition);
  }, [composition]);

  const handleSendToAI = useCallback(async () => {
    const json = editor.getJSON();
    const prompt = `Here is the updated composition I've edited. Please review my changes and continue iterating on it:\n\n\`\`\`json\n${json}\n\`\`\`\n\nPlease call create_composition with these updated scenes to apply the changes.`;
    await sendFollowUpMessage(prompt);
  }, [editor, sendFollowUpMessage]);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: 500 }}>
      <EditorLayout
        composition={editor.composition}
        selectedSceneIndex={editor.selectedSceneIndex}
        selectedElementId={editor.selectedElementId}
        isDirty={editor.isDirty}
        onSelectScene={editor.setSelectedSceneIndex}
        onSelectElement={editor.setSelectedElementId}
        onUpdateScene={editor.updateScene}
        onUpdateElement={editor.updateElement}
        onRemoveElement={editor.removeElement}
        onSendToAI={handleSendToAI}
        onClose={onClose}
        colors={colors}
      />
    </div>
  );
};

export default RemotionPlayerWidget;
