"use client";

import { useEffect, useState } from "react";
import { getSlaThreshold, getSloThreshold, type Priority } from "~/config/sla-slo";

interface LiveTimerProps {
  createdAt: Date;
  priority: Priority;
  status: string;
  assignedAt?: Date | null;
}

export function LiveTimer({ createdAt, priority, status, assignedAt }: LiveTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isBreached, setIsBreached] = useState(false);
  const [isSlo, setIsSlo] = useState(false);

  useEffect(() => {
    // Don't show timer for resolved cases
    if (status === "RESOLVED") {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const created = new Date(createdAt);
      
      // If assigned, use SLO (resolution time), otherwise use SLA (response time)
      if (assignedAt && status === "ASSIGNED") {
        const elapsed = Math.floor((now.getTime() - created.getTime()) / 1000); // seconds
        const sloThreshold = getSloThreshold(priority); // seconds
        const remaining = sloThreshold - elapsed;
        setTimeRemaining(remaining);
        setIsBreached(remaining < 0);
        setIsSlo(true);
      } else {
        const elapsed = Math.floor((now.getTime() - created.getTime()) / 1000); // seconds
        const slaThreshold = getSlaThreshold(priority); // seconds
        const remaining = slaThreshold - elapsed;
        setTimeRemaining(remaining);
        setIsBreached(remaining < 0);
        setIsSlo(false);
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [createdAt, priority, status, assignedAt]);

  if (timeRemaining === null) {
    return <span className="text-slate-400">—</span>;
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
    <div className="flex flex-col">
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
      <span className="text-xs text-slate-500 mt-0.5">
        {isSlo ? "SLO" : "SLA"}
      </span>
    </div>
  );
}
