import React from "react";
import type { AnimationData } from "../../../../types";
import {
  type ThemeColors,
  FieldGroup,
  SectionHeader,
  SelectInput,
  NumberInput,
  InlineFields,
} from "./EditorControls";

const ANIMATION_TYPES = [
  { value: "", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "scale", label: "Scale" },
  { value: "spring", label: "Spring" },
  { value: "bounce", label: "Bounce" },
  { value: "rotate", label: "Rotate" },
  { value: "blur", label: "Blur" },
  { value: "typewriter", label: "Typewriter" },
];

const DIRECTIONS = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
];

export const AnimationProperties: React.FC<{
  label: string;
  animation: AnimationData | undefined;
  onChange: (anim: AnimationData | undefined) => void;
  colors: ThemeColors;
  isTextElement?: boolean;
}> = ({ label, animation, onChange, colors, isTextElement }) => {
  const types = isTextElement
    ? ANIMATION_TYPES
    : ANIMATION_TYPES.filter((t) => t.value !== "typewriter");

  const update = (patch: Partial<AnimationData>) => {
    if (!animation) return;
    onChange({ ...animation, ...patch });
  };

  return (
    <div>
      <SectionHeader title={label} colors={colors} />

      <FieldGroup label="Type" colors={colors}>
        <SelectInput
          value={animation?.type || ""}
          onChange={(v) => {
            if (!v) {
              onChange(undefined);
            } else {
              onChange({
                type: v as AnimationData["type"],
                durationInFrames: animation?.durationInFrames || 20,
                delay: animation?.delay || 0,
                ...(v === "slide" ? { direction: animation?.direction || "left" } : {}),
              });
            }
          }}
          colors={colors}
          options={types}
        />
      </FieldGroup>

      {animation && (
        <>
          <InlineFields>
            <FieldGroup label="Duration (frames)" colors={colors}>
              <NumberInput
                value={animation.durationInFrames}
                onChange={(v) => update({ durationInFrames: v })}
                colors={colors}
                min={1}
                max={300}
              />
            </FieldGroup>
            <FieldGroup label="Delay (frames)" colors={colors}>
              <NumberInput
                value={animation.delay}
                onChange={(v) => update({ delay: v })}
                colors={colors}
                min={0}
                max={300}
              />
            </FieldGroup>
          </InlineFields>

          {animation.type === "slide" && (
            <FieldGroup label="Direction" colors={colors}>
              <SelectInput
                value={animation.direction || "left"}
                onChange={(v) =>
                  update({ direction: v as AnimationData["direction"] })
                }
                colors={colors}
                options={DIRECTIONS}
              />
            </FieldGroup>
          )}

          {(animation.type === "spring" ||
            animation.type === "bounce" ||
            animation.type === "scale") && (
            <>
              <InlineFields>
                <FieldGroup label="Damping" colors={colors}>
                  <NumberInput
                    value={animation.springConfig?.damping}
                    onChange={(v) =>
                      update({
                        springConfig: { ...animation.springConfig, damping: v },
                      })
                    }
                    colors={colors}
                    min={1}
                    max={200}
                    placeholder={
                      animation.type === "bounce"
                        ? "8"
                        : animation.type === "spring"
                          ? "10"
                          : "200"
                    }
                  />
                </FieldGroup>
                <FieldGroup label="Stiffness" colors={colors}>
                  <NumberInput
                    value={animation.springConfig?.stiffness}
                    onChange={(v) =>
                      update({
                        springConfig: {
                          ...animation.springConfig,
                          stiffness: v,
                        },
                      })
                    }
                    colors={colors}
                    min={1}
                    max={500}
                    placeholder={
                      animation.type === "bounce" ? "200" : "100"
                    }
                  />
                </FieldGroup>
              </InlineFields>
              <FieldGroup label="Mass" colors={colors}>
                <NumberInput
                  value={animation.springConfig?.mass}
                  onChange={(v) =>
                    update({
                      springConfig: { ...animation.springConfig, mass: v },
                    })
                  }
                  colors={colors}
                  min={0.1}
                  max={10}
                  step={0.1}
                  placeholder="1"
                />
              </FieldGroup>
            </>
          )}
        </>
      )}
    </div>
  );
};
