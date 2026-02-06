"use client";

import { useEffect, useState } from "react";
import { getSlaThreshold, type Priority } from "~/config/sla-slo";

interface LiveTimerProps {
  createdAt: Date;
  priority: Priority;
  status: string;
}

export function LiveTimer({ createdAt, priority, status }: LiveTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isBreached, setIsBreached] = useState(false);

  useEffect(() => {
    // Don't show timer for resolved cases
    if (status === "RESOLVED") {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const created = new Date(createdAt);
      const elapsed = Math.floor((now.getTime() - created.getTime()) / 1000); // seconds
      const slaThreshold = getSlaThreshold(priority); // seconds
      const remaining = slaThreshold - elapsed;

      setTimeRemaining(remaining);
      setIsBreached(remaining < 0);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [createdAt, priority, status]);

  if (timeRemaining === null) {
    return <span className="text-gray-400">—</span>;
  }

  const formatTime = (seconds: number): string => {
    const absSeconds = Math.abs(seconds);
    const hours = Math.floor(absSeconds / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const secs = absSeconds % 60;

    if (hours > 0) {
      return `${seconds < 0 ? "-" : ""}${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${seconds < 0 ? "-" : ""}${minutes}m ${secs}s`;
    }
    return `${seconds < 0 ? "-" : ""}${secs}s`;
  };

  return (
    <span
      className={`font-mono ${
        isBreached
          ? "text-red-500 font-semibold"
          : timeRemaining < 300 // Less than 5 minutes
          ? "text-yellow-500"
          : "text-green-500"
      }`}
    >
      {isBreached ? "BREACHED" : formatTime(timeRemaining)}
    </span>
  );
}
