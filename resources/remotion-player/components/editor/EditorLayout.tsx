import React, { useRef, useMemo } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { DynamicComposition } from "../DynamicComposition";
import type { CompositionData, SceneData, ElementData } from "../../../../types";
import { type ThemeColors, EditorButton } from "./EditorControls";
import { SceneTimeline } from "./SceneTimeline";
import { PropertyPanel } from "./PropertyPanel";

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

export const EditorLayout: React.FC<{
  composition: CompositionData;
  selectedSceneIndex: number;
  selectedElementId: string | null;
  isDirty: boolean;
  onSelectScene: (index: number) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateScene: (sceneIndex: number, patch: Partial<SceneData>) => void;
  onUpdateElement: (
    sceneIndex: number,
    elementId: string,
    patch: Partial<ElementData>
  ) => void;
  onRemoveElement: (sceneIndex: number, elementId: string) => void;
  onSendToAI: () => void;
  onClose: () => void;
  colors: ThemeColors;
}> = ({
  composition,
  selectedSceneIndex,
  selectedElementId,
  isDirty,
  onSelectScene,
  onSelectElement,
  onUpdateScene,
  onUpdateElement,
  onRemoveElement,
  onSendToAI,
  onClose,
  colors,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const meta = composition.meta;
  const scenes = composition.scenes || [];
  const currentScene = scenes[selectedSceneIndex];

  const totalDuration = useMemo(
    () => calculateTotalDuration(scenes),
    [scenes]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: colors.bgPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: colors.bgSecondary,
          borderBottom: `1px solid ${colors.borderColor}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: colors.textPrimary,
          }}
        >
          <span>{meta.title}</span>
          {isDirty && (
            <span
              style={{
                fontSize: 9,
                padding: "2px 6px",
                borderRadius: 3,
                backgroundColor: colors.bgTertiary,
                color: colors.textSecondary,
                fontWeight: 500,
              }}
            >
              Unsaved
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <EditorButton
            onClick={onSendToAI}
            colors={colors}
            variant="primary"
          >
            Send to AI
          </EditorButton>
          <EditorButton onClick={onClose} colors={colors} variant="secondary">
            Close
          </EditorButton>
        </div>
      </div>

      {/* Scene Timeline */}
      <SceneTimeline
        scenes={scenes}
        selectedIndex={selectedSceneIndex}
        onSelect={(i) => {
          onSelectScene(i);
          onSelectElement(null);
        }}
        colors={colors}
      />

      {/* Main content: Player + Property Panel */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Player side */}
        <div
          style={{
            flex: "0 0 60%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#000",
            minWidth: 0,
          }}
        >
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Player
              ref={playerRef}
              component={DynamicComposition}
              inputProps={{ scenes }}
              durationInFrames={totalDuration}
              fps={meta.fps}
              compositionWidth={meta.width}
              compositionHeight={meta.height}
              controls
              autoPlay
              loop
              style={{ width: "100%" }}
            />
          </div>
          {/* Player info bar */}
          <div
            style={{
              padding: "4px 12px",
              display: "flex",
              gap: 12,
              fontSize: 10,
              color: colors.textSecondary,
              backgroundColor: colors.bgSecondary,
              borderTop: `1px solid ${colors.borderColor}`,
              flexShrink: 0,
            }}
          >
            <span>
              {meta.width}x{meta.height}
            </span>
            <span>{meta.fps}fps</span>
            <span>
              {scenes.length} scene{scenes.length !== 1 ? "s" : ""}
            </span>
            <span>{(totalDuration / meta.fps).toFixed(1)}s</span>
          </div>
        </div>

        {/* Property Panel side */}
        <div
          style={{
            flex: "0 0 40%",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {currentScene ? (
            <PropertyPanel
              scene={currentScene}
              sceneIndex={selectedSceneIndex}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectElement}
              onUpdateScene={(patch) =>
                onUpdateScene(selectedSceneIndex, patch)
              }
              onUpdateElement={(elementId, patch) =>
                onUpdateElement(selectedSceneIndex, elementId, patch)
              }
              onRemoveElement={(elementId) =>
                onRemoveElement(selectedSceneIndex, elementId)
              }
              colors={colors}
              isLastScene={selectedSceneIndex === scenes.length - 1}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: colors.textSecondary,
                fontSize: 13,
              }}
            >
              No scene selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
