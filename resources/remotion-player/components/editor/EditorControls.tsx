import React, { useState, useEffect, useRef } from "react";

type ThemeColors = {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  accent: string;
};

export function getEditorTheme(isDark: boolean): ThemeColors {
  return isDark
    ? {
        bgPrimary: "#141414",
        bgSecondary: "#1c1c1c",
        bgTertiary: "#2a2a2a",
        textPrimary: "#e0e0e0",
        textSecondary: "#777777",
        borderColor: "#2a2a2a",
        accent: "#ffffff",
      }
    : {
        bgPrimary: "#ffffff",
        bgSecondary: "#f5f5f5",
        bgTertiary: "#e8e8e8",
        textPrimary: "#1a1a1a",
        textSecondary: "#888888",
        borderColor: "#e0e0e0",
        accent: "#1a1a1a",
      };
}

export { type ThemeColors };

// --- Shared styles ---

const labelStyle = (colors: ThemeColors): React.CSSProperties => ({
  display: "block",
  fontSize: 11,
  color: colors.textSecondary,
  marginBottom: 3,
  fontWeight: 500,
});

const inputStyle = (colors: ThemeColors): React.CSSProperties => ({
  width: "100%",
  padding: "5px 8px",
  fontSize: 12,
  border: `1px solid ${colors.borderColor}`,
  borderRadius: 4,
  backgroundColor: colors.bgPrimary,
  color: colors.textPrimary,
  outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
});

const fieldWrap: React.CSSProperties = {
  marginBottom: 10,
};

// --- Components ---

export const FieldGroup: React.FC<{
  label: string;
  colors: ThemeColors;
  children: React.ReactNode;
}> = ({ label, colors, children }) => (
  <div style={fieldWrap}>
    <label style={labelStyle(colors)}>{label}</label>
    {children}
  </div>
);

export const SectionHeader: React.FC<{
  title: string;
  colors: ThemeColors;
}> = ({ title, colors }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: colors.textSecondary,
      textTransform: "uppercase" as const,
      letterSpacing: 0.8,
      marginTop: 14,
      marginBottom: 6,
      paddingBottom: 4,
      borderBottom: `1px solid ${colors.borderColor}`,
    }}
  >
    {title}
  </div>
);

export const NumberInput: React.FC<{
  value: number | undefined;
  onChange: (v: number) => void;
  colors: ThemeColors;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}> = ({ value, onChange, colors, min, max, step = 1, placeholder }) => (
  <input
    type="number"
    value={value ?? ""}
    min={min}
    max={max}
    step={step}
    placeholder={placeholder}
    onChange={(e) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v)) onChange(v);
    }}
    style={inputStyle(colors)}
  />
);

export const TextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  colors: ThemeColors;
  placeholder?: string;
}> = ({ value, onChange, colors, placeholder }) => {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = (v: string) => {
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), 200);
  };

  return (
    <input
      type="text"
      value={local}
      placeholder={placeholder}
      onChange={(e) => handleChange(e.target.value)}
      style={inputStyle(colors)}
    />
  );
};

export const TextArea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  colors: ThemeColors;
  rows?: number;
}> = ({ value, onChange, colors, rows = 3 }) => {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = (v: string) => {
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), 200);
  };

  return (
    <textarea
      value={local}
      rows={rows}
      onChange={(e) => handleChange(e.target.value)}
      style={{
        ...inputStyle(colors),
        resize: "vertical" as const,
        lineHeight: 1.4,
      }}
    />
  );
};

export const ColorInput: React.FC<{
  value: string | undefined;
  onChange: (v: string) => void;
  colors: ThemeColors;
}> = ({ value, onChange, colors }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <input
      type="color"
      value={value || "#000000"}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 28,
        height: 28,
        border: `1px solid ${colors.borderColor}`,
        borderRadius: 4,
        padding: 0,
        cursor: "pointer",
        backgroundColor: "transparent",
      }}
    />
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="#000000"
      style={{ ...inputStyle(colors), flex: 1 }}
    />
  </div>
);

export const SelectInput: React.FC<{
  value: string | undefined;
  onChange: (v: string) => void;
  colors: ThemeColors;
  options: { value: string; label: string }[];
}> = ({ value, onChange, colors, options }) => (
  <select
    value={value || options[0]?.value || ""}
    onChange={(e) => onChange(e.target.value)}
    style={{
      ...inputStyle(colors),
      cursor: "pointer",
    }}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export const SliderInput: React.FC<{
  value: number | undefined;
  onChange: (v: number) => void;
  colors: ThemeColors;
  min: number;
  max: number;
  step?: number;
}> = ({ value, onChange, colors, min, max, step = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value ?? min}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{ flex: 1, accentColor: colors.accent }}
    />
    <span style={{ fontSize: 11, color: colors.textSecondary, minWidth: 30 }}>
      {value ?? min}
    </span>
  </div>
);

export const ButtonGroup: React.FC<{
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
  colors: ThemeColors;
}> = ({ options, value, onChange, colors }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            padding: "4px 6px",
            fontSize: 11,
            border: `1px solid ${colors.borderColor}`,
            borderRadius: 3,
            cursor: "pointer",
            backgroundColor: active ? colors.accent : colors.bgPrimary,
            color: active ? "#ffffff" : colors.textPrimary,
            fontFamily: "inherit",
            transition: "background-color 0.15s",
          }}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export const InlineFields: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div style={{ display: "flex", gap: 8 }}>
    {React.Children.map(children, (child) => (
      <div style={{ flex: 1 }}>{child}</div>
    ))}
  </div>
);

export const EditorButton: React.FC<{
  onClick: () => void;
  colors: ThemeColors;
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ onClick, colors, variant = "secondary", children, style }) => {
  const bg =
    variant === "primary"
      ? colors.accent
      : variant === "danger"
        ? "#dc3545"
        : colors.bgTertiary;
  const textColor =
    variant === "primary"
      ? (colors.accent === "#ffffff" ? "#000000" : "#ffffff")
      : variant === "danger"
        ? "#ffffff"
        : colors.textPrimary;

  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 600,
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        backgroundColor: bg,
        color: textColor,
        fontFamily: "inherit",
        transition: "opacity 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
};
