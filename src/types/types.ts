export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type Sized = "xs" | "sm" | "md" | "lg" | "xl";

export interface TourinStep {
  selector: string;
  title: string;
  content: string;
  action?: "click" | "right-click";
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
