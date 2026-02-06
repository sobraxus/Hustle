"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

interface CaseManagementProps {
  caseId: string;
  currentStatus: string;
  onUpdate?: () => void;
}

export function CaseManagement({ caseId, currentStatus, onUpdate }: CaseManagementProps) {
  const utils = api.useUtils();
  const [isUpdating, setIsUpdating] = useState(false);

  const { mutate: updateCase } = api.case.update.useMutation({
    onSuccess: () => {
      void utils.case.getAll.invalidate();
      void utils.case.getCompletedWithSli.invalidate();
      setIsUpdating(false);
      onUpdate?.();
    },
    onError: () => {
      setIsUpdating(false);
    },
  });

  const handleAssign = () => {
    setIsUpdating(true);
    updateCase({
      id: caseId,
      assignedAt: new Date(),
      status: "ASSIGNED",
    });
  };

  const handleComplete = () => {
    setIsUpdating(true);
    updateCase({
      id: caseId,
      completedAt: new Date(),
      status: "RESOLVED",
    });
  };

  return (
    <div className="flex gap-2">
      {currentStatus === "OPEN" && (
        <button
          onClick={handleAssign}
          disabled={isUpdating}
          className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:opacity-50"
        >
          {isUpdating ? "Assigning..." : "Assign"}
        </button>
      )}
      {(currentStatus === "OPEN" || currentStatus === "ASSIGNED") && (
        <button
          onClick={handleComplete}
          disabled={isUpdating}
          className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 disabled:opacity-50"
        >
          {isUpdating ? "Completing..." : "Complete"}
        </button>
      )}
    </div>
  );
}
