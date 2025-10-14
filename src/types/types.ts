export interface TourinStep {
  selector: string;
  title: string;
  content: string;
}

export interface TourinProps {
  color?: string;
  start?: boolean;
  steps: TourinStep[];
  onFinish?: () => void;
}
