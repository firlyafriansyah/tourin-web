import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import type { TourinProps } from "../types/types";

const TOOLTIP_SPACING = 20;
const VIEWPORT_PADDING = 16;
const HIGHLIGHT_PADDING = 8;
const HIGHLIGHT_BORDER_RADIUS = 12;

const DELAY_TIMES = {
  long: 500,
  short: 100,
  medium: 300,
} as const;

const SIZED = {
  title: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
  },
  content: {
    xs: "10px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "18px",
  },
  helper: {
    xs: "8px",
    sm: "10px",
    md: "12px",
    lg: "14px",
    xl: "16px",
  },
  tooltipWidth: {
    xs: 240,
    sm: 280,
    md: 320,
    lg: 360,
    xl: 400,
  },
};

type TooltipPosition = "bottom" | "top" | "left" | "right";

export function TourinWeb({
  steps,
  onFinish,
  size = "md",
  start = false,
  color = "#3b82f6",
}: TourinProps) {
  const [running, setRunning] = React.useState(start);
  const [stepIndex, setStepIndex] = React.useState(0);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [tooltipHeight, setTooltipHeight] = React.useState(0);
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  const isFirstStep = stepIndex === 0;
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const requestedPosition = currentStep?.tooltipPosition || "bottom";

  const getBestPosition = React.useCallback(
    (rect: DOMRect, requestedPos?: TooltipPosition): TooltipPosition => {
      if (!rect) return "bottom";

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const estimatedHeight = tooltipHeight || 200;

      if (requestedPos) {
        const fits = checkPositionFits(
          rect,
          requestedPos,
          viewportWidth,
          viewportHeight,
          estimatedHeight
        );
        if (fits) return requestedPos;
      }

      const positions: TooltipPosition[] = ["bottom", "top", "right", "left"];

      for (const pos of positions) {
        if (
          checkPositionFits(
            rect,
            pos,
            viewportWidth,
            viewportHeight,
            estimatedHeight
          )
        ) {
          return pos;
        }
      }

      return "bottom";
    },
    [tooltipHeight]
  );
  const checkPositionFits = (
    rect: DOMRect,
    position: TooltipPosition,
    viewportWidth: number,
    viewportHeight: number,
    tooltipH: number
  ): boolean => {
    const tooltipW = SIZED.tooltipWidth[size];

    switch (position) {
      case "bottom":
        return (
          rect.bottom + TOOLTIP_SPACING + tooltipH + VIEWPORT_PADDING <
          viewportHeight
        );
      case "top":
        return rect.top - TOOLTIP_SPACING - tooltipH - VIEWPORT_PADDING > 0;
      case "left":
        return rect.left - TOOLTIP_SPACING - tooltipW - VIEWPORT_PADDING > 0;
      case "right":
        return (
          rect.right + TOOLTIP_SPACING + tooltipW + VIEWPORT_PADDING <
          viewportWidth
        );
      default:
        return false;
    }
  };
  const actualPosition = React.useMemo(() => {
    if (!rect) return requestedPosition;
    return getBestPosition(rect, requestedPosition);
  }, [rect, requestedPosition, getBestPosition]);
  const getTooltipStyle = React.useCallback(() => {
    if (!rect) return {};

    const positions = {
      bottom: {
        top: rect.bottom + TOOLTIP_SPACING,
        left: Math.max(
          VIEWPORT_PADDING,
          Math.min(
            rect.left + rect.width / 2 - SIZED.tooltipWidth[size] / 2,
            window.innerWidth - SIZED.tooltipWidth[size] - VIEWPORT_PADDING
          )
        ),
      },
      top: {
        bottom: window.innerHeight - rect.top + TOOLTIP_SPACING,
        left: Math.max(
          VIEWPORT_PADDING,
          Math.min(
            rect.left + rect.width / 2 - SIZED.tooltipWidth[size] / 2,
            window.innerWidth - SIZED.tooltipWidth[size] - VIEWPORT_PADDING
          )
        ),
      },
      left: {
        top: rect.top,
        right: window.innerWidth - rect.left + TOOLTIP_SPACING,
      },
      right: {
        top: rect.top,
        left: rect.right + TOOLTIP_SPACING,
      },
    };

    return positions[actualPosition];
  }, [rect, actualPosition]);
  const updateRect = React.useCallback(() => {
    if (!running || !currentStep) return;

    const el = document.querySelector(currentStep.selector);
    if (el) {
      const newRect = el.getBoundingClientRect();
      setRect(newRect);
    }
  }, [running, currentStep]);
  const executeStepAction = React.useCallback(() => {
    if (!currentStep?.action || !currentStep.selector) return;

    const element = document.querySelector(currentStep.selector);
    if (!(element instanceof HTMLElement)) return;

    switch (currentStep.action.action) {
      case "click":
        element.click();
        break;
      case "right-click":
        const rect = element.getBoundingClientRect();

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const rightClickEvent = new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 2,
          clientX: x,
          clientY: y,
        });

        element.dispatchEvent(rightClickEvent);
        break;
      case "typing":
        if (currentStep.action.typingValue) {
          element.innerText = currentStep.action.typingValue;
        }
        break;
    }
  }, [currentStep]);
  const finishTour = React.useCallback(() => {
    setRunning(false);
    onFinish?.();
  }, [onFinish]);
  const advanceStep = React.useCallback(() => {
    if (isLastStep) {
      finishTour();
    } else {
      setStepIndex((prev) => prev + 1);
    }
  }, [isLastStep, finishTour]);
  const handleNext = React.useCallback(() => {
    executeStepAction();

    if (!currentStep?.delayed) {
      advanceStep();
      return;
    }

    const delayTime =
      typeof currentStep.delayed === "string"
        ? DELAY_TIMES[currentStep.delayed]
        : currentStep.delayed;

    setTimeout(advanceStep, delayTime);
  }, [currentStep, executeStepAction, advanceStep]);
  const handlePrev = React.useCallback(() => {
    if (!isFirstStep) {
      setStepIndex((prev) => prev - 1);
    }
  }, [isFirstStep]);

  React.useEffect(() => {
    if (tooltipRef.current) {
      const height = tooltipRef.current.offsetHeight;
      setTooltipHeight(height);
    }
  }, [stepIndex, currentStep]);
  React.useEffect(() => {
    if (!running || !currentStep) return;

    const el = document.querySelector(currentStep.selector);
    if (!el) return;

    const newRect = el.getBoundingClientRect();
    setRect(newRect);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [stepIndex, currentStep, running]);
  React.useEffect(() => {
    if (!running) return;

    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [running, updateRect]);

  if (!running || !rect) return null;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        style={{
          inset: 0,
          pointerEvents: "auto",
          position: "fixed",
          zIndex: 9999,
        }}
      >
        <svg
          style={{
            height: "100%",
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
            width: "100%",
          }}
        >
          <defs>
            <mask id="spotlight-mask">
              <rect fill="white" height="100%" width="100%" />
              <rect
                fill="black"
                height={rect.height + HIGHLIGHT_PADDING * 2}
                rx={HIGHLIGHT_BORDER_RADIUS + 3}
                ry={HIGHLIGHT_BORDER_RADIUS + 3}
                width={rect.width + HIGHLIGHT_PADDING * 2}
                x={rect.left - HIGHLIGHT_PADDING}
                y={rect.top - HIGHLIGHT_PADDING}
              />
            </mask>
          </defs>
          <rect
            fill="rgba(0, 0, 0, 0.6)"
            height="100%"
            mask="url(#spotlight-mask)"
            style={{ pointerEvents: "auto" }}
            width="100%"
          />
        </svg>

        <motion.div
          animate={{
            height: rect.height + HIGHLIGHT_PADDING * 2,
            left: rect.left - HIGHLIGHT_PADDING,
            opacity: 1,
            scale: 1,
            top: rect.top - HIGHLIGHT_PADDING,
            width: rect.width + HIGHLIGHT_PADDING * 2,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          style={{
            border: `4px solid ${color}`,
            borderRadius: `${HIGHLIGHT_BORDER_RADIUS}px`,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            pointerEvents: "none",
            position: "absolute",
          }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        />

        <motion.div
          ref={tooltipRef}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0, y: 20 }}
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            color: "#1f2937",
            padding: "20px",
            position: "absolute",
            width: `${SIZED.tooltipWidth[size]}px`,
            ...getTooltipStyle(),
          }}
          transition={{ duration: 0.3 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: SIZED.helper[size], margin: 0 }}>
              Step {stepIndex + 1} of {steps.length}
            </p>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                fontSize: SIZED.helper[size],
                padding: 0,
              }}
              onClick={finishTour}
              onMouseOut={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
              onMouseOver={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
            >
              Skip
            </button>
          </div>

          <h3
            style={{
              fontSize: SIZED.title[size],
              fontWeight: 600,
              margin: 0,
              marginTop: "4px",
            }}
          >
            {currentStep.title}
          </h3>

          <p
            style={{
              color: "#4b5563",
              fontSize: SIZED.content[size],
              margin: 0,
              marginTop: "8px",
            }}
          >
            {currentStep.content}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px",
              gap: "8px",
            }}
          >
            <button
              type="button"
              disabled={isFirstStep}
              style={{
                backgroundColor: "#e5e7eb",
                border: "none",
                borderRadius: "8px",
                cursor: isFirstStep ? "not-allowed" : "pointer",
                fontSize: SIZED.content[size],
                opacity: isFirstStep ? 0.5 : 1,
                padding: "6px 12px",
                transition: "background-color 0.15s",
              }}
              onClick={handlePrev}
              onMouseOut={(e) => {
                if (!isFirstStep)
                  e.currentTarget.style.backgroundColor = "#e5e7eb";
              }}
              onMouseOver={(e) => {
                if (!isFirstStep)
                  e.currentTarget.style.backgroundColor = "#d1d5db";
              }}
            >
              Back
            </button>
            <button
              type="button"
              style={{
                backgroundColor: `${color}E6`,
                border: "none",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: SIZED.content[size],
                padding: "6px 12px",
                transition: "background-color 0.15s",
              }}
              onClick={handleNext}
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = `${color}E6`)
              }
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = color)
              }
            >
              {isLastStep ? "Finish" : "Next"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
