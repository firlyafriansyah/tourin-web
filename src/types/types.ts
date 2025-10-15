export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface ActionProps {
  action: "click" | "typing";
  typingValue?: string;
}

export interface TourinStep {
  selector: string;
  title: string;
  content: string;
  action?: ActionProps;
  tooltipPosition?: TooltipPosition;
  delayed?: "short" | "medium" | "long" | number;
}

export interface TourinProps {
  color?: string;
  start?: boolean;
  steps: TourinStep[];
  onFinish?: () => void;
}
