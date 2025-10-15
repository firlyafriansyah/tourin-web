import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TourinProps } from "../types/types";

const TOOLTIP_WIDTH = 320;
const TOOLTIP_SPACING = 20;
const HIGHLIGHT_PADDING = 8;
const HIGHLIGHT_BORDER_RADIUS = 12;

const DELAY_TIMES = {
  short: 100,
  medium: 300,
  long: 500,
} as const;

export function TourinWeb({
  color = "#3b82f6",
  onFinish,
  start = false,
  steps,
}: TourinProps) {
  const [running, setRunning] = React.useState(start);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  const currentStep = steps[stepIndex];
  const tooltipPosition = currentStep?.tooltipPosition || "bottom";
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  const getTooltipStyle = React.useCallback(() => {
    if (!rect) return {};

    const centerX = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
    const centerY = rect.top + rect.height / 2;

    const positions = {
      bottom: {
        top: rect.bottom + TOOLTIP_SPACING,
        left: centerX,
      },
      top: {
        top: rect.top - TOOLTIP_SPACING,
        left: centerX,
        transform: "translateY(-100%)",
      },
      left: {
        top: centerY,
        left: rect.left - TOOLTIP_SPACING,
        transform: "translate(-100%, -50%)",
      },
      right: {
        top: centerY,
        left: rect.right + TOOLTIP_SPACING,
        transform: "translateY(-50%)",
      },
    };

    return positions[tooltipPosition];
  }, [rect, tooltipPosition]);

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

  // Update rect when step changes
  React.useEffect(() => {
    if (!running || !currentStep) return;

    const el = document.querySelector(currentStep.selector);
    if (!el) return;

    const newRect = el.getBoundingClientRect();
    setRect(newRect);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [stepIndex, currentStep, running]);

  // Handle window resize
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
        {/* Overlay with spotlight cutout */}
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

        {/* Highlight border */}
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

        {/* Tooltip */}
        <motion.div
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
            width: `${TOOLTIP_WIDTH}px`,
            ...getTooltipStyle(),
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "12px", margin: 0 }}>
              Step {stepIndex + 1} of {steps.length}
            </p>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                fontSize: "12px",
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

          {/* Title */}
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              margin: 0,
              marginTop: "4px",
            }}
          >
            {currentStep.title}
          </h3>

          {/* Content */}
          <p
            style={{
              color: "#4b5563",
              fontSize: "14px",
              margin: 0,
              marginTop: "8px",
            }}
          >
            {currentStep.content}
          </p>

          {/* Navigation buttons */}
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
                fontSize: "14px",
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
                fontSize: "14px",
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
