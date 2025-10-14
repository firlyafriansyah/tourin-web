export interface TourinStep {
  selector: string;
  title: string;
  content: string;
}

export interface TourinProps {
  steps: TourinStep[];
  start?: boolean;
  onFinish?: () => void;
}
