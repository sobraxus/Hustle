"use client";

import { api } from "~/trpc/react";
import { getSloThreshold, type Priority } from "~/config/sla-slo";
import { calculateResolutionSli } from "~/utils/sli";

export function SLIAnalytics() {
  const { data: completedCases, isLoading } = api.case.getCompletedWithSli.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  if (!completedCases || completedCases.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">SLI Analytics</h2>
        <div className="text-gray-400">No completed cases to analyze</div>
      </div>
    );
  }

  // Group by priority and calculate averages
  const priorityStats: Record<
    Priority,
    { count: number; totalSli: number; avgSli: number; avgDelta: number }
  > = {
    CRITICAL: { count: 0, totalSli: 0, avgSli: 0, avgDelta: 0 },
    HIGH: { count: 0, totalSli: 0, avgSli: 0, avgDelta: 0 },
    MEDIUM: { count: 0, totalSli: 0, avgSli: 0, avgDelta: 0 },
    LOW: { count: 0, totalSli: 0, avgSli: 0, avgDelta: 0 },
  };

  completedCases.forEach((caseItem) => {
    if (!caseItem.completedAt) return;

    const priority = caseItem.priority as Priority;
    // Use calculated SLI if available, otherwise calculate it
    const sli = caseItem.calculatedResolutionSli ?? calculateResolutionSli(
      caseItem.createdAt,
      caseItem.completedAt,
      priority
    );
    const sloTarget = getSloThreshold(priority);
    const actualTime = Math.floor(
      (caseItem.completedAt.getTime() - caseItem.createdAt.getTime()) / 1000
    );
    const delta = ((sloTarget - actualTime) / sloTarget) * 100; // Percentage faster/slower

    priorityStats[priority].count++;
    priorityStats[priority].totalSli += sli;
    priorityStats[priority].avgSli = priorityStats[priority].totalSli / priorityStats[priority].count;
    priorityStats[priority].avgDelta += delta;
  });

  // Calculate average delta
  Object.keys(priorityStats).forEach((priority) => {
    const p = priority as Priority;
    if (priorityStats[p].count > 0) {
      priorityStats[p].avgDelta = priorityStats[p].avgDelta / priorityStats[p].count;
    }
  });

  const priorities: Priority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">SLI Analytics</h2>
      <div className="space-y-6">
        {priorities.map((priority) => {
          const stats = priorityStats[priority];
          if (stats.count === 0) return null;

          const isPositive = stats.avgDelta > 0;
          const barWidth = Math.min(Math.abs(stats.avgDelta), 100);

          return (
            <div key={priority} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-300">{priority}</span>
                  <span className="text-xs text-gray-500">
                    ({stats.count} case{stats.count !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {isPositive ? (
                    <span className="text-green-500">
                      {stats.avgDelta.toFixed(1)}% faster than target
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {Math.abs(stats.avgDelta).toFixed(1)}% slower than target
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                    isPositive ? "bg-green-500/60" : "bg-red-500/60"
                  }`}
                  style={{ width: `${barWidth}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {stats.avgSli.toFixed(1)}% SLI
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-700" style={{ marginLeft: "50%" }} />
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Target: {getSloThreshold(priority) / 3600}h | Avg SLI: {stats.avgSli.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
