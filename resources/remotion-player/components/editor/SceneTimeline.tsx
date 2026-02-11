import React from "react";
import type { SceneData } from "../../../../types";
import { type ThemeColors } from "./EditorControls";

export const SceneTimeline: React.FC<{
  scenes: SceneData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  colors: ThemeColors;
}> = ({ scenes, selectedIndex, onSelect, colors }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        padding: "6px 12px",
        backgroundColor: colors.bgSecondary,
        borderBottom: `1px solid ${colors.borderColor}`,
        overflowX: "auto",
      }}
    >
      {scenes.map((scene, i) => {
        const isSelected = i === selectedIndex;
        const bgPreview =
          scene.background.type === "gradient" && scene.background.colors?.length
            ? `linear-gradient(90deg, ${scene.background.colors.join(", ")})`
            : scene.background.color || "#333";

        return (
          <button
            key={scene.id}
            onClick={() => onSelect(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              border: isSelected
                ? `2px solid ${colors.accent}`
                : `1px solid ${colors.borderColor}`,
              borderRadius: 5,
              cursor: "pointer",
              backgroundColor: isSelected
                ? colors.accent + "18"
                : colors.bgPrimary,
              color: isSelected ? colors.textPrimary : colors.textSecondary,
              fontSize: 11,
              fontWeight: isSelected ? 600 : 400,
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: bgPreview,
                border: `1px solid ${colors.borderColor}`,
                flexShrink: 0,
              }}
            />
            Scene {i + 1}
            <span style={{ fontSize: 10, opacity: 0.7 }}>
              {scene.durationInFrames}f
            </span>
          </button>
        );
      })}
    </div>
  );
};
