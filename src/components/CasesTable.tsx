"use client";

import { api } from "~/trpc/react";
import { LiveTimer } from "./LiveTimer";

export function CasesTable() {
  const { data: cases, isLoading } = api.case.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading cases...</div>
      </div>
    );
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">No cases found</div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "text-red-500 bg-red-500/10";
      case "HIGH":
        return "text-orange-500 bg-orange-500/10";
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-500/10";
      case "LOW":
        return "text-blue-500 bg-blue-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-500 bg-green-500/10";
      case "ASSIGNED":
        return "text-blue-500 bg-blue-500/10";
      case "OPEN":
        return "text-gray-500 bg-gray-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full">
        <thead className="bg-gray-900/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Time to SLA Breach
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Call Out
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {cases.map((caseItem) => (
            <tr
              key={caseItem.id}
              className={`transition-colors ${
                caseItem.isCallOutTriggered
                  ? "bg-red-500/5 animate-pulse-glow"
                  : "hover:bg-gray-900/30"
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                {caseItem.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                    caseItem.priority
                  )}`}
                >
                  {caseItem.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    caseItem.status
                  )}`}
                >
                  {caseItem.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <LiveTimer
                  createdAt={caseItem.createdAt}
                  priority={caseItem.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"}
                  status={caseItem.status}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {new Date(caseItem.createdAt).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {caseItem.isCallOutTriggered ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-500 bg-red-500/20">
                    TRIGGERED
                  </span>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
