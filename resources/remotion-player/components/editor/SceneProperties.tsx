import React from "react";
import type { SceneData, TransitionData, BackgroundData } from "../../../../types";
import {
  type ThemeColors,
  FieldGroup,
  SectionHeader,
  ColorInput,
  NumberInput,
  SelectInput,
  InlineFields,
} from "./EditorControls";

const TRANSITION_TYPES = [
  { value: "", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "wipe", label: "Wipe" },
  { value: "flip", label: "Flip" },
  { value: "clockWipe", label: "Clock Wipe" },
];

const TRANSITION_DIRECTIONS: { value: string; label: string }[] = [
  { value: "from-left", label: "From Left" },
  { value: "from-right", label: "From Right" },
  { value: "from-top", label: "From Top" },
  { value: "from-bottom", label: "From Bottom" },
];

export const SceneProperties: React.FC<{
  scene: SceneData;
  onChange: (patch: Partial<SceneData>) => void;
  colors: ThemeColors;
  isLastScene: boolean;
}> = ({ scene, onChange, colors, isLastScene }) => {
  const bg = scene.background;

  const updateBackground = (patch: Partial<BackgroundData>) => {
    onChange({ background: { ...scene.background, ...patch } });
  };

  return (
    <div>
      <SectionHeader title="Scene Settings" colors={colors} />

      <FieldGroup label="Duration (frames)" colors={colors}>
        <NumberInput
          value={scene.durationInFrames}
          onChange={(v) => onChange({ durationInFrames: v })}
          colors={colors}
          min={1}
          max={9000}
        />
      </FieldGroup>

      <SectionHeader title="Background" colors={colors} />

      <FieldGroup label="Type" colors={colors}>
        <SelectInput
          value={bg.type}
          onChange={(v) => {
            if (v === "gradient") {
              updateBackground({
                type: "gradient",
                colors: bg.colors || [bg.color || "#000000", "#333333"],
                direction: bg.direction ?? 180,
              });
            } else {
              updateBackground({
                type: "solid",
                color: bg.color || bg.colors?.[0] || "#000000",
              });
            }
          }}
          colors={colors}
          options={[
            { value: "solid", label: "Solid" },
            { value: "gradient", label: "Gradient" },
          ]}
        />
      </FieldGroup>

      {bg.type === "solid" && (
        <FieldGroup label="Color" colors={colors}>
          <ColorInput
            value={bg.color}
            onChange={(v) => updateBackground({ color: v })}
            colors={colors}
          />
        </FieldGroup>
      )}

      {bg.type === "gradient" && (
        <>
          {(bg.colors || []).map((c, i) => (
            <FieldGroup label={`Color ${i + 1}`} colors={colors} key={i}>
              <ColorInput
                value={c}
                onChange={(v) => {
                  const next = [...(bg.colors || [])];
                  next[i] = v;
                  updateBackground({ colors: next });
                }}
                colors={colors}
              />
            </FieldGroup>
          ))}
          <FieldGroup label="Direction (degrees)" colors={colors}>
            <NumberInput
              value={bg.direction ?? 180}
              onChange={(v) => updateBackground({ direction: v })}
              colors={colors}
              min={0}
              max={360}
            />
          </FieldGroup>
        </>
      )}

      {!isLastScene && (
        <>
          <SectionHeader title="Transition (to next scene)" colors={colors} />

          <FieldGroup label="Type" colors={colors}>
            <SelectInput
              value={scene.transition?.type || ""}
              onChange={(v) => {
                if (!v) {
                  onChange({ transition: undefined });
                } else {
                  onChange({
                    transition: {
                      type: v as TransitionData["type"],
                      durationInFrames:
                        scene.transition?.durationInFrames || 15,
                      direction:
                        scene.transition?.direction || "from-right",
                    },
                  });
                }
              }}
              colors={colors}
              options={TRANSITION_TYPES}
            />
          </FieldGroup>

          {scene.transition && (
            <InlineFields>
              <FieldGroup label="Duration (frames)" colors={colors}>
                <NumberInput
                  value={scene.transition.durationInFrames}
                  onChange={(v) =>
                    onChange({
                      transition: { ...scene.transition!, durationInFrames: v },
                    })
                  }
                  colors={colors}
                  min={1}
                  max={120}
                />
              </FieldGroup>
              <FieldGroup label="Direction" colors={colors}>
                <SelectInput
                  value={scene.transition.direction || "from-right"}
                  onChange={(v) =>
                    onChange({
                      transition: {
                        ...scene.transition!,
                        direction: v as TransitionData["direction"],
                      },
                    })
                  }
                  colors={colors}
                  options={TRANSITION_DIRECTIONS}
                />
              </FieldGroup>
            </InlineFields>
          )}
        </>
      )}
    </div>
  );
};
