export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type Sized = "xs" | "sm" | "md" | "lg" | "xl";

export interface ActionProps {
  action: "click" | "right-click" | "typing";
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
  size?: Sized;
  onFinish?: () => void;
}
