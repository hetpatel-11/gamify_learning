import React, { useMemo, useRef } from "react";
import { z } from "zod";
import { McpUseProvider, useWidget, type WidgetMetadata } from "mcp-use/react";
import { Player, type PlayerRef } from "@remotion/player";
import { DynamicComposition } from "./components/DynamicComposition";
import type { CompositionData, SceneData } from "../../types";

const propSchema = z.object({
  composition: z.string().describe("JSON string of the composition"),
});

// @ts-expect-error - Zod v4 deep type instantiation
export const widgetMetadata: WidgetMetadata = {
  description: "Remotion video player",
  props: propSchema,
  exposeAsTool: false,
  metadata: {
    prefersBorder: true,
    autoResize: true,
    widgetDescription: "Renders a Remotion video composition",
    csp: {
      resourceDomains: ["https://images.unsplash.com", "https://picsum.photos"],
    },
  },
};

function totalDuration(scenes: SceneData[]): number {
  let t = 0;
  for (let i = 0; i < scenes.length; i++) {
    t += scenes[i].durationInFrames;
    if (i < scenes.length - 1 && scenes[i].transition)
      t -= scenes[i].transition!.durationInFrames;
  }
  return Math.max(t, 1);
}

const Widget: React.FC = () => {
  const { props, isPending, theme, toolInput } = useWidget();
  const ref = useRef<PlayerRef>(null);

  const comp = useMemo<CompositionData | null>(() => {
    const p = props as Partial<{ composition: string }>;
    const ti = toolInput as Record<string, unknown> | undefined;

    if (p?.composition) {
      try { return JSON.parse(p.composition); } catch {}
    }
    if (ti?.scenes) {
      let scenes: SceneData[] = [];
      if (typeof ti.scenes === "string") {
        try { scenes = JSON.parse(ti.scenes); } catch {}
      } else if (Array.isArray(ti.scenes)) {
        scenes = ti.scenes;
      }
      if (scenes.length)
        return {
          meta: {
            title: (ti.title as string) || "Untitled",
            width: (ti.width as number) || 1920,
            height: (ti.height as number) || 1080,
            fps: (ti.fps as number) || 30,
          },
          scenes,
        };
    }
    return null;
  }, [props, toolInput]);

  const dur = useMemo(() => comp?.scenes ? totalDuration(comp.scenes) : 1, [comp?.scenes]);

  const dark = theme === "dark";
  const bg = dark ? "#141414" : "#fff";
  const bg2 = dark ? "#1c1c1c" : "#f5f5f5";
  const fg = dark ? "#e0e0e0" : "#1a1a1a";
  const fg2 = dark ? "#777" : "#888";
  const bd = dark ? "#2a2a2a" : "#e0e0e0";

  if (isPending || !comp) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, background: bg, borderRadius: 8, fontFamily: "system-ui, sans-serif", color: fg2, fontSize: 13 }}>
        {isPending ? "Creating..." : "No data"}
      </div>
    );
  }

  const { meta, scenes } = comp;

  return (
    <div style={{ borderRadius: 8, overflow: "hidden", background: bg, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: bg2, borderBottom: `1px solid ${bd}` }}>
        <span style={{ color: fg, fontSize: 13, fontWeight: 500 }}>{meta.title}</span>
        <span style={{ color: fg2, fontSize: 11 }}>
          {meta.width}x{meta.height} · {meta.fps}fps · {scenes.length} scene{scenes.length !== 1 ? "s" : ""} · {(dur / meta.fps).toFixed(1)}s
        </span>
      </div>
      <Player
        ref={ref}
        component={DynamicComposition}
        inputProps={{ scenes }}
        durationInFrames={dur}
        fps={meta.fps}
        compositionWidth={meta.width}
        compositionHeight={meta.height}
        controls
        autoPlay
        loop
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default function RemotionPlayerWidget() {
  return (
    <McpUseProvider autoSize>
      <Widget />
    </McpUseProvider>
  );
}
