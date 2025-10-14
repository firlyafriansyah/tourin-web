import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  title: string;
  content: string;
  selector: string;
}

interface TourinProps {
  steps: Step[];
  start?: boolean;
  onFinish?: () => void;
}

export function TourinWeb({ steps, start = false, onFinish }: TourinProps) {
  const [running, setRunning] = React.useState(start);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  const step = steps[stepIndex];

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
    else {
      setRunning(false);
      onFinish?.();
    }
  };
  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  React.useEffect(() => {
    if (running && step) {
      const el = document.querySelector(step.selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect(r);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [stepIndex, step, running]);

  if (!running) return null;

  return (
    <AnimatePresence>
      {rect && (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{
            inset: 0,
            pointerEvents: 'auto',
            position: 'fixed',
            zIndex: 9999,
          }}
        >
          <svg
            style={{
              height: '100%',
              inset: 0,
              pointerEvents: 'none',
              position: 'absolute',
              width: '100%',
            }}
          >
            <defs>
              <mask id="spotlight-mask">
                <rect fill="white" height="100%" width="100%" />
                <rect
                  fill="black"
                  height={rect.height + 16}
                  rx="15"
                  ry="15"
                  width={rect.width + 16}
                  x={rect.left - 8}
                  y={rect.top - 8}
                />
              </mask>
            </defs>
            <rect
              fill="rgba(0, 0, 0, 0.6)"
              height="100%"
              mask="url(#spotlight-mask)"
              style={{ pointerEvents: 'auto' }}
              width="100%"
            />
          </svg>

          <motion.div
            animate={{
              height: rect.height + 16,
              left: rect.left - 8,
              opacity: 1,
              scale: 1,
              top: rect.top - 8,
              width: rect.width + 16,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            style={{
              border: '4px solid #3b82f6',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              pointerEvents: 'none',
              position: 'absolute',
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: 20 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              color: '#1f2937',
              left: rect.left + rect.width / 2 - 160,
              padding: '20px',
              position: 'absolute',
              top: rect.bottom + 20,
              width: '320px',
            }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '12px' }}>
                Step {stepIndex + 1} of {steps.length}
              </p>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: 0,
                }}
                onClick={() => {
                  setRunning(false);
                  onFinish?.();
                }}
                onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              >
                Skip
              </button>
            </div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                marginTop: '4px',
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                color: '#4b5563',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              {step.content}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '16px',
              }}
            >
              <button
                disabled={stepIndex === 0}
                style={{
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: stepIndex === 0 ? 0.5 : 1,
                  padding: '6px 12px',
                  transition: 'background-color 0.15s',
                }}
                onClick={handlePrev}
                onMouseOut={(e) => {
                  if (stepIndex !== 0) e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseOver={(e) => {
                  if (stepIndex !== 0) e.currentTarget.style.backgroundColor = '#d1d5db';
                }}
              >
                Back
              </button>
              <button
                style={{
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '6px 12px',
                  transition: 'background-color 0.15s',
                }}
                onClick={handleNext}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              >
                {stepIndex < steps.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
