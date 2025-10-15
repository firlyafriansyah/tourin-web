import * as React from "react";

export function useTourinWeb() {
  const [isRunning, setIsRunning] = React.useState(false);

  const startTour = () => setIsRunning(true);
  const stopTour = () => setIsRunning(false);

  return { isRunning, startTour, stopTour };
}
