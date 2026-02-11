import React from "react";
import type { ElementData } from "../../../../types";
import { type ThemeColors, SectionHeader, EditorButton } from "./EditorControls";

function elementLabel(el: ElementData): string {
  switch (el.type) {
    case "text":
      return el.text.length > 30 ? el.text.slice(0, 30) + "..." : el.text;
    case "shape":
      return `${el.shape} shape`;
    case "image":
      return "Image";
    default:
      return (el as ElementData).type;
  }
}

function elementIcon(el: ElementData): string {
  switch (el.type) {
    case "text":
      return "T";
    case "shape":
      return el.shape === "circle"
        ? "\u25CF"
        : el.shape === "ellipse"
          ? "\u2B2D"
          : el.shape === "line"
            ? "\u2014"
            : "\u25A0";
    case "image":
      return "\u25A3";
    default:
      return "?";
  }
}

export const ElementList: React.FC<{
  elements: ElementData[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onRemove: (id: string) => void;
  colors: ThemeColors;
}> = ({ elements, selectedId, onSelect, onRemove, colors }) => {
  return (
    <div>
      <SectionHeader title="Elements" colors={colors} />

      {elements.length === 0 && (
        <div
          style={{
            fontSize: 11,
            color: colors.textSecondary,
            padding: "8px 0",
            fontStyle: "italic",
          }}
        >
          No elements in this scene
        </div>
      )}

      {elements.map((el) => {
        const isSelected = el.id === selectedId;
        return (
          <div
            key={el.id}
            onClick={() => onSelect(isSelected ? null : el.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              marginBottom: 2,
              borderRadius: 4,
              cursor: "pointer",
              backgroundColor: isSelected
                ? colors.accent + "22"
                : "transparent",
              border: isSelected
                ? `1px solid ${colors.accent}`
                : `1px solid transparent`,
              transition: "background-color 0.1s",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                backgroundColor: colors.bgTertiary,
                color: colors.textPrimary,
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {elementIcon(el)}
            </span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textPrimary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {elementLabel(el)}
              </div>
              <div style={{ fontSize: 10, color: colors.textSecondary }}>
                {el.type} &middot; ({el.x.toFixed(0)}%, {el.y.toFixed(0)}%)
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(el.id);
              }}
              title="Remove element"
              style={{
                background: "none",
                border: "none",
                color: colors.textSecondary,
                cursor: "pointer",
                fontSize: 14,
                padding: "2px 4px",
                borderRadius: 3,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
