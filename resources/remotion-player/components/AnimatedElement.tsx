import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img } from "remotion";
import type {
  ElementData,
  AnimationData,
  TextElementData,
  ShapeElementData,
  ImageElementData,
} from "../../../types";

function computeAnimationStyle(
  animation: AnimationData | undefined,
  frame: number,
  fps: number,
  isExit: boolean,
  sceneDuration: number
): React.CSSProperties {
  if (!animation) return {};

  const delay = animation.delay || 0;
  const duration = animation.durationInFrames || 20;

  const startFrame = isExit ? sceneDuration - duration - delay : delay;
  const endFrame = startFrame + duration;

  const style: React.CSSProperties = {};
  let transform = "";

  switch (animation.type) {
    case "fade": {
      const [from, to] = isExit ? [1, 0] : [0, 1];
      style.opacity = interpolate(frame, [startFrame, endFrame], [from, to], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    }

    case "slide": {
      const dir = animation.direction || (isExit ? "right" : "left");
      const isHorizontal = dir === "left" || dir === "right";
      const sign = dir === "right" || dir === "down" ? 1 : -1;
      const distance = 100;

      if (isExit) {
        const val = interpolate(
          frame,
          [startFrame, endFrame],
          [0, sign * distance],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        transform += isHorizontal
          ? ` translateX(${val}%)`
          : ` translateY(${val}%)`;
      } else {
        const val = interpolate(
          frame,
          [startFrame, endFrame],
          [-sign * distance, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        transform += isHorizontal
          ? ` translateX(${val}%)`
          : ` translateY(${val}%)`;
      }

      const [fromOp, toOp] = isExit ? [1, 0] : [0, 1];
      style.opacity = interpolate(
        frame,
        [startFrame, Math.min(startFrame + 10, endFrame)],
        [fromOp, toOp],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      break;
    }

    case "scale": {
      const config = animation.springConfig || { damping: 200 };
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config,
      });
      const [fromScale, toScale] = isExit ? [1, 0] : [0, 1];
      const scale = interpolate(progress, [0, 1], [fromScale, toScale]);
      transform += ` scale(${scale})`;
      break;
    }

    case "spring": {
      const config = animation.springConfig || { damping: 10, stiffness: 100 };
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config,
      });

      if (isExit) {
        const inverted = 1 - progress;
        transform += ` translateY(${interpolate(inverted, [0, 1], [0, 50])}px)`;
        style.opacity = interpolate(inverted, [0, 1], [1, 0]);
      } else {
        transform += ` translateY(${interpolate(progress, [0, 1], [50, 0])}px)`;
        style.opacity = interpolate(progress, [0, 1], [0, 1]);
      }
      break;
    }

    case "bounce": {
      const config = animation.springConfig || {
        damping: 8,
        stiffness: 200,
      };
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config,
      });
      const [fromScale, toScale] = isExit ? [1, 0] : [0, 1];
      const scale = interpolate(progress, [0, 1], [fromScale, toScale]);
      transform += ` scale(${scale})`;
      break;
    }

    case "rotate": {
      const [fromRot, toRot] = isExit ? [0, 360] : [-360, 0];
      const rotation = interpolate(
        frame,
        [startFrame, endFrame],
        [fromRot, toRot],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      transform += ` rotate(${rotation}deg)`;
      const [fromOp, toOp] = isExit ? [1, 0] : [0, 1];
      style.opacity = interpolate(frame, [startFrame, endFrame], [fromOp, toOp], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    }

    case "blur": {
      const [fromBlur, toBlur] = isExit ? [0, 20] : [20, 0];
      const blur = interpolate(
        frame,
        [startFrame, endFrame],
        [fromBlur, toBlur],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      style.filter = `blur(${blur}px)`;
      const [fromOp, toOp] = isExit ? [1, 0] : [0, 1];
      style.opacity = interpolate(frame, [startFrame, endFrame], [fromOp, toOp], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    }

    case "typewriter":
      break;
  }

  if (transform) {
    style.transform = transform;
  }

  return style;
}

function renderText(
  element: TextElementData,
  baseStyle: React.CSSProperties,
  frame: number
) {
  let displayText = element.text;

  if (element.enterAnimation?.type === "typewriter") {
    const delay = element.enterAnimation.delay || 0;
    const duration =
      element.enterAnimation.durationInFrames || element.text.length * 2;
    const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const charCount = Math.floor(progress * element.text.length);
    displayText = element.text.slice(0, charCount);
  }

  return (
    <div
      style={{
        ...baseStyle,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily || "sans-serif",
        fontWeight: element.fontWeight || 400,
        color: element.color,
        textAlign: element.textAlign || "center",
        lineHeight: element.lineHeight || 1.2,
        letterSpacing: element.letterSpacing
          ? `${element.letterSpacing}px`
          : undefined,
        backgroundColor: element.backgroundColor,
        padding: element.padding,
        borderRadius: element.borderRadius,
        maxWidth: element.maxWidth ? `${element.maxWidth}%` : undefined,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {displayText}
    </div>
  );
}

function renderShape(
  element: ShapeElementData,
  baseStyle: React.CSSProperties
) {
  const isCircular = element.shape === "circle" || element.shape === "ellipse";
  const isLine = element.shape === "line";

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: isLine
          ? element.stroke || element.fill
          : element.fill,
        border:
          !isLine && element.stroke
            ? `${element.strokeWidth || 2}px solid ${element.stroke}`
            : undefined,
        borderRadius: isCircular ? "50%" : element.borderRadius,
        boxShadow: element.shadow,
        height: isLine ? `${element.strokeWidth || 2}px` : baseStyle.height,
      }}
    />
  );
}

function renderImage(
  element: ImageElementData,
  baseStyle: React.CSSProperties
) {
  return (
    <Img
      src={element.src}
      style={{
        ...baseStyle,
        objectFit: element.objectFit || "cover",
        borderRadius: element.borderRadius,
      }}
    />
  );
}

export const AnimatedElement: React.FC<{
  element: ElementData;
  sceneDuration: number;
}> = ({ element, sceneDuration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterStyle = computeAnimationStyle(
    element.enterAnimation,
    frame,
    fps,
    false,
    sceneDuration
  );
  const exitStyle = computeAnimationStyle(
    element.exitAnimation,
    frame,
    fps,
    true,
    sceneDuration
  );

  const mergedTransform = [enterStyle.transform, exitStyle.transform]
    .filter(Boolean)
    .join(" ");

  const mergedOpacity =
    (enterStyle.opacity !== undefined ? Number(enterStyle.opacity) : 1) *
    (exitStyle.opacity !== undefined ? Number(exitStyle.opacity) : 1);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${element.x}%`,
    top: `${element.y}%`,
    transform: `translate(-50%, -50%)${mergedTransform ? ` ${mergedTransform}` : ""}`,
    opacity:
      element.opacity !== undefined
        ? element.opacity * mergedOpacity
        : mergedOpacity,
    filter: enterStyle.filter || exitStyle.filter,
  };

  if (element.width !== undefined) baseStyle.width = `${element.width}%`;
  if (element.height !== undefined) baseStyle.height = `${element.height}%`;
  if (element.rotation) {
    baseStyle.transform += ` rotate(${element.rotation}deg)`;
  }

  switch (element.type) {
    case "text":
      return renderText(element as TextElementData, baseStyle, frame);
    case "shape":
      return renderShape(element as ShapeElementData, baseStyle);
    case "image":
      return renderImage(element as ImageElementData, baseStyle);
    default:
      return null;
  }
};
