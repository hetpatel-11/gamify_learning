import React from "react";
import type { ImageElementData, AnimationData } from "../../../../types";
import {
  type ThemeColors,
  FieldGroup,
  SectionHeader,
  TextInput,
  NumberInput,
  SelectInput,
  SliderInput,
  InlineFields,
} from "./EditorControls";
import { AnimationProperties } from "./AnimationProperties";

export const ImageProperties: React.FC<{
  element: ImageElementData;
  onChange: (patch: Partial<ImageElementData>) => void;
  colors: ThemeColors;
}> = ({ element, onChange, colors }) => {
  return (
    <div>
      <SectionHeader title="Image" colors={colors} />

      <FieldGroup label="Source URL" colors={colors}>
        <TextInput
          value={element.src}
          onChange={(v) => onChange({ src: v })}
          colors={colors}
          placeholder="https://..."
        />
      </FieldGroup>

      <FieldGroup label="Object Fit" colors={colors}>
        <SelectInput
          value={element.objectFit || "cover"}
          onChange={(v) =>
            onChange({ objectFit: v as "cover" | "contain" | "fill" })
          }
          colors={colors}
          options={[
            { value: "cover", label: "Cover" },
            { value: "contain", label: "Contain" },
            { value: "fill", label: "Fill" },
          ]}
        />
      </FieldGroup>

      <SectionHeader title="Position & Size" colors={colors} />

      <InlineFields>
        <FieldGroup label="X (%)" colors={colors}>
          <NumberInput
            value={element.x}
            onChange={(v) => onChange({ x: v })}
            colors={colors}
            min={0}
            max={100}
            step={0.5}
          />
        </FieldGroup>
        <FieldGroup label="Y (%)" colors={colors}>
          <NumberInput
            value={element.y}
            onChange={(v) => onChange({ y: v })}
            colors={colors}
            min={0}
            max={100}
            step={0.5}
          />
        </FieldGroup>
      </InlineFields>

      <InlineFields>
        <FieldGroup label="Width (%)" colors={colors}>
          <NumberInput
            value={element.width}
            onChange={(v) => onChange({ width: v })}
            colors={colors}
            min={0}
            max={100}
            step={0.5}
          />
        </FieldGroup>
        <FieldGroup label="Height (%)" colors={colors}>
          <NumberInput
            value={element.height}
            onChange={(v) => onChange({ height: v })}
            colors={colors}
            min={0}
            max={100}
            step={0.5}
          />
        </FieldGroup>
      </InlineFields>

      <InlineFields>
        <FieldGroup label="Rotation" colors={colors}>
          <NumberInput
            value={element.rotation}
            onChange={(v) => onChange({ rotation: v })}
            colors={colors}
            min={-360}
            max={360}
          />
        </FieldGroup>
        <FieldGroup label="Opacity" colors={colors}>
          <SliderInput
            value={element.opacity ?? 1}
            onChange={(v) => onChange({ opacity: v })}
            colors={colors}
            min={0}
            max={1}
            step={0.05}
          />
        </FieldGroup>
      </InlineFields>

      <FieldGroup label="Border Radius" colors={colors}>
        <NumberInput
          value={element.borderRadius}
          onChange={(v) => onChange({ borderRadius: v })}
          colors={colors}
          min={0}
          max={200}
        />
      </FieldGroup>

      <AnimationProperties
        label="Enter Animation"
        animation={element.enterAnimation}
        onChange={(anim: AnimationData | undefined) =>
          onChange({ enterAnimation: anim })
        }
        colors={colors}
      />

      <AnimationProperties
        label="Exit Animation"
        animation={element.exitAnimation}
        onChange={(anim: AnimationData | undefined) =>
          onChange({ exitAnimation: anim })
        }
        colors={colors}
      />
    </div>
  );
};
