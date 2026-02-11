import React from "react";
import { AbsoluteFill } from "remotion";
import { AnimatedElement } from "./AnimatedElement";
import type { SceneData } from "../../../types";

function getBackgroundStyle(
  background: SceneData["background"]
): React.CSSProperties {
  if (background.type === "gradient" && background.colors?.length) {
    const angle = background.direction ?? 180;
    return {
      background: `linear-gradient(${angle}deg, ${background.colors.join(", ")})`,
    };
  }
  return {
    backgroundColor: background.color || "#000000",
  };
}

export const SceneRenderer: React.FC<{ scene: SceneData }> = ({ scene }) => {
  return (
    <AbsoluteFill style={getBackgroundStyle(scene.background)}>
      {(scene.elements || []).map((element) => (
        <AnimatedElement
          key={element.id}
          element={element}
          sceneDuration={scene.durationInFrames}
        />
      ))}
    </AbsoluteFill>
  );
};
