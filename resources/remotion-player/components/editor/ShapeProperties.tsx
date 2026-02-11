import React from "react";
import type { ShapeElementData, AnimationData } from "../../../../types";
import {
  type ThemeColors,
  FieldGroup,
  SectionHeader,
  ColorInput,
  NumberInput,
  SelectInput,
  SliderInput,
  TextInput,
  InlineFields,
} from "./EditorControls";
import { AnimationProperties } from "./AnimationProperties";

export const ShapeProperties: React.FC<{
  element: ShapeElementData;
  onChange: (patch: Partial<ShapeElementData>) => void;
  colors: ThemeColors;
}> = ({ element, onChange, colors }) => {
  return (
    <div>
      <SectionHeader title="Shape" colors={colors} />

      <FieldGroup label="Shape Type" colors={colors}>
        <SelectInput
          value={element.shape}
          onChange={(v) =>
            onChange({
              shape: v as "rectangle" | "circle" | "ellipse" | "line",
            })
          }
          colors={colors}
          options={[
            { value: "rectangle", label: "Rectangle" },
            { value: "circle", label: "Circle" },
            { value: "ellipse", label: "Ellipse" },
            { value: "line", label: "Line" },
          ]}
        />
      </FieldGroup>

      <FieldGroup label="Fill Color" colors={colors}>
        <ColorInput
          value={element.fill}
          onChange={(v) => onChange({ fill: v })}
          colors={colors}
        />
      </FieldGroup>

      <FieldGroup label="Stroke Color" colors={colors}>
        <ColorInput
          value={element.stroke}
          onChange={(v) => onChange({ stroke: v })}
          colors={colors}
        />
      </FieldGroup>

      <FieldGroup label="Stroke Width" colors={colors}>
        <NumberInput
          value={element.strokeWidth}
          onChange={(v) => onChange({ strokeWidth: v })}
          colors={colors}
          min={0}
          max={20}
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

      <FieldGroup label="Shadow" colors={colors}>
        <TextInput
          value={element.shadow || ""}
          onChange={(v) => onChange({ shadow: v })}
          colors={colors}
          placeholder="e.g. 0 4px 12px rgba(0,0,0,0.3)"
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
