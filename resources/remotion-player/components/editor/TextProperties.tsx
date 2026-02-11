import React from "react";
import type { TextElementData, AnimationData } from "../../../../types";
import {
  type ThemeColors,
  FieldGroup,
  SectionHeader,
  TextArea,
  ColorInput,
  NumberInput,
  SelectInput,
  SliderInput,
  InlineFields,
} from "./EditorControls";
import { AnimationProperties } from "./AnimationProperties";

export const TextProperties: React.FC<{
  element: TextElementData;
  onChange: (patch: Partial<TextElementData>) => void;
  colors: ThemeColors;
}> = ({ element, onChange, colors }) => {
  return (
    <div>
      <SectionHeader title="Text Content" colors={colors} />

      <FieldGroup label="Text" colors={colors}>
        <TextArea
          value={element.text}
          onChange={(v) => onChange({ text: v })}
          colors={colors}
          rows={3}
        />
      </FieldGroup>

      <InlineFields>
        <FieldGroup label="Font Size" colors={colors}>
          <NumberInput
            value={element.fontSize}
            onChange={(v) => onChange({ fontSize: v })}
            colors={colors}
            min={8}
            max={400}
          />
        </FieldGroup>
        <FieldGroup label="Font Weight" colors={colors}>
          <SelectInput
            value={String(element.fontWeight || 400)}
            onChange={(v) => onChange({ fontWeight: parseInt(v) })}
            colors={colors}
            options={[
              { value: "300", label: "Light" },
              { value: "400", label: "Regular" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semi Bold" },
              { value: "700", label: "Bold" },
              { value: "800", label: "Extra Bold" },
              { value: "900", label: "Black" },
            ]}
          />
        </FieldGroup>
      </InlineFields>

      <FieldGroup label="Color" colors={colors}>
        <ColorInput
          value={element.color}
          onChange={(v) => onChange({ color: v })}
          colors={colors}
        />
      </FieldGroup>

      <FieldGroup label="Font Family" colors={colors}>
        <SelectInput
          value={element.fontFamily || "sans-serif"}
          onChange={(v) => onChange({ fontFamily: v })}
          colors={colors}
          options={[
            { value: "sans-serif", label: "Sans Serif" },
            { value: "serif", label: "Serif" },
            { value: "monospace", label: "Monospace" },
            { value: "Georgia, serif", label: "Georgia" },
            { value: "Arial, sans-serif", label: "Arial" },
          ]}
        />
      </FieldGroup>

      <FieldGroup label="Text Align" colors={colors}>
        <SelectInput
          value={element.textAlign || "center"}
          onChange={(v) =>
            onChange({ textAlign: v as "left" | "center" | "right" })
          }
          colors={colors}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
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
        <FieldGroup label="Max Width (%)" colors={colors}>
          <NumberInput
            value={element.maxWidth}
            onChange={(v) => onChange({ maxWidth: v })}
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

      <SectionHeader title="Styling" colors={colors} />

      <FieldGroup label="Background Color" colors={colors}>
        <ColorInput
          value={element.backgroundColor}
          onChange={(v) => onChange({ backgroundColor: v })}
          colors={colors}
        />
      </FieldGroup>

      <InlineFields>
        <FieldGroup label="Padding" colors={colors}>
          <NumberInput
            value={element.padding}
            onChange={(v) => onChange({ padding: v })}
            colors={colors}
            min={0}
            max={100}
          />
        </FieldGroup>
        <FieldGroup label="Border Radius" colors={colors}>
          <NumberInput
            value={element.borderRadius}
            onChange={(v) => onChange({ borderRadius: v })}
            colors={colors}
            min={0}
            max={100}
          />
        </FieldGroup>
      </InlineFields>

      <InlineFields>
        <FieldGroup label="Line Height" colors={colors}>
          <NumberInput
            value={element.lineHeight}
            onChange={(v) => onChange({ lineHeight: v })}
            colors={colors}
            min={0.5}
            max={3}
            step={0.1}
          />
        </FieldGroup>
        <FieldGroup label="Letter Spacing" colors={colors}>
          <NumberInput
            value={element.letterSpacing}
            onChange={(v) => onChange({ letterSpacing: v })}
            colors={colors}
            min={-5}
            max={20}
            step={0.5}
          />
        </FieldGroup>
      </InlineFields>

      <AnimationProperties
        label="Enter Animation"
        animation={element.enterAnimation}
        onChange={(anim: AnimationData | undefined) =>
          onChange({ enterAnimation: anim })
        }
        colors={colors}
        isTextElement
      />

      <AnimationProperties
        label="Exit Animation"
        animation={element.exitAnimation}
        onChange={(anim: AnimationData | undefined) =>
          onChange({ exitAnimation: anim })
        }
        colors={colors}
        isTextElement
      />
    </div>
  );
};
