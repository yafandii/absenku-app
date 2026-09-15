import { useState, useEffect } from "react";

interface UseActiveShiftProps {
  timestamp?: string;
  photoUrl?: string;
  targetHours?: number;
}

export function useActiveShift({
  timestamp,
  photoUrl,
  targetHours = 8,
}: UseActiveShiftProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);
  const [isPhotoExpanded, setIsPhotoExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (!timestamp) return;

    const calculateElapsed = () => {
      const startTime = new Date(timestamp).getTime();
      const now = Date.now();
      const diffMinutes = Math.max(0, Math.floor((now - startTime) / (1000 * 60)));
      setElapsedMinutes(diffMinutes);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 30000);
    return () => clearInterval(interval);
  }, [timestamp]);

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const remainingMinutes = elapsedMinutes % 60;
  const targetMinutes = targetHours * 60;
  const progressPercent = Math.min(100, Math.round((elapsedMinutes / targetMinutes) * 100));
  const isTargetCompleted = elapsedMinutes >= targetMinutes;

  const photoSrc = photoUrl?.startsWith("data:")
    ? photoUrl
    : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${photoUrl || ""}`;

  return {
    elapsedHours,
    remainingMinutes,
    progressPercent,
    isTargetCompleted,
    isPhotoExpanded,
    togglePhotoExpanded: () => setIsPhotoExpanded((prev) => !prev),
    photoSrc,
  };
}
