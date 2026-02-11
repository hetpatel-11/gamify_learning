import React from "react";
import type {
  SceneData,
  ElementData,
  TextElementData,
  ShapeElementData,
  ImageElementData,
} from "../../../../types";
import { type ThemeColors } from "./EditorControls";
import { ElementList } from "./ElementList";
import { SceneProperties } from "./SceneProperties";
import { TextProperties } from "./TextProperties";
import { ShapeProperties } from "./ShapeProperties";
import { ImageProperties } from "./ImageProperties";

export const PropertyPanel: React.FC<{
  scene: SceneData;
  sceneIndex: number;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateScene: (patch: Partial<SceneData>) => void;
  onUpdateElement: (elementId: string, patch: Partial<ElementData>) => void;
  onRemoveElement: (elementId: string) => void;
  colors: ThemeColors;
  isLastScene: boolean;
}> = ({
  scene,
  sceneIndex,
  selectedElementId,
  onSelectElement,
  onUpdateScene,
  onUpdateElement,
  onRemoveElement,
  colors,
  isLastScene,
}) => {
  const selectedElement = selectedElementId
    ? scene.elements.find((e) => e.id === selectedElementId)
    : null;

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "8px 12px",
        backgroundColor: colors.bgPrimary,
        borderLeft: `1px solid ${colors.borderColor}`,
      }}
    >
      <ElementList
        elements={scene.elements}
        selectedId={selectedElementId}
        onSelect={onSelectElement}
        onRemove={onRemoveElement}
        colors={colors}
      />

      <div
        style={{
          marginTop: 12,
          paddingTop: 8,
          borderTop: `1px solid ${colors.borderColor}`,
        }}
      >
        {selectedElement ? (
          <ElementProperties
            element={selectedElement}
            onChange={(patch) => onUpdateElement(selectedElement.id, patch)}
            colors={colors}
          />
        ) : (
          <SceneProperties
            scene={scene}
            onChange={onUpdateScene}
            colors={colors}
            isLastScene={isLastScene}
          />
        )}
      </div>
    </div>
  );
};

const ElementProperties: React.FC<{
  element: ElementData;
  onChange: (patch: Partial<ElementData>) => void;
  colors: ThemeColors;
}> = ({ element, onChange, colors }) => {
  switch (element.type) {
    case "text":
      return (
        <TextProperties
          element={element as TextElementData}
          onChange={onChange as (patch: Partial<TextElementData>) => void}
          colors={colors}
        />
      );
    case "shape":
      return (
        <ShapeProperties
          element={element as ShapeElementData}
          onChange={onChange as (patch: Partial<ShapeElementData>) => void}
          colors={colors}
        />
      );
    case "image":
      return (
        <ImageProperties
          element={element as ImageElementData}
          onChange={onChange as (patch: Partial<ImageElementData>) => void}
          colors={colors}
        />
      );
    default:
      return (
        <div style={{ color: colors.textSecondary, fontSize: 12 }}>
          Unknown element type: {(element as ElementData).type}
        </div>
      );
  }
};
