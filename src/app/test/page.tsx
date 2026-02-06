"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

export default function TestPage() {
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
  const utils = api.useUtils();

  const { mutate: createCase, isLoading: isCreating } = api.case.create.useMutation({
    onSuccess: (data) => {
      setCreatedCaseId(data.id);
      void utils.case.getAll.invalidate();
      void utils.case.getCompletedWithSli.invalidate();
    },
  });

  const { mutate: updateCase } = api.case.update.useMutation({
    onSuccess: () => {
      void utils.case.getAll.invalidate();
      void utils.case.getCompletedWithSli.invalidate();
    },
  });

  const { mutate: checkBreach } = api.case.checkSlaBreach.useMutation({
    onSuccess: (data) => {
      alert(`Checked ${data.checked} cases, triggered ${data.triggered} call-outs`);
      void utils.case.getAll.invalidate();
    },
  });

  const { mutate: deleteAll, isLoading: isDeleting } = api.case.deleteAll.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      setCreatedCaseId(null);
      void utils.case.getAll.invalidate();
      void utils.case.getCompletedWithSli.invalidate();
    },
  });

  const createTestCase = (priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") => {
    createCase({ priority, status: "OPEN" });
  };

  const assignCase = () => {
    if (!createdCaseId) return;
    updateCase({
      id: createdCaseId,
      assignedAt: new Date(),
      status: "ASSIGNED",
    });
  };

  const completeCase = () => {
    if (!createdCaseId) return;
    updateCase({
      id: createdCaseId,
      completedAt: new Date(),
      status: "RESOLVED",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Test Controls</h1>

        <div className="space-y-6">
          {/* Create Test Cases */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Create Test Cases</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => createTestCase("CRITICAL")}
                disabled={isCreating}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50"
              >
                Create CRITICAL
              </button>
              <button
                onClick={() => createTestCase("HIGH")}
                disabled={isCreating}
                className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 disabled:opacity-50"
              >
                Create HIGH
              </button>
              <button
                onClick={() => createTestCase("MEDIUM")}
                disabled={isCreating}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 disabled:opacity-50"
              >
                Create MEDIUM
              </button>
              <button
                onClick={() => createTestCase("LOW")}
                disabled={isCreating}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:opacity-50"
              >
                Create LOW
              </button>
            </div>
            {createdCaseId && (
              <div className="mt-4 text-sm text-gray-400">
                Last created: <code className="text-gray-300">{createdCaseId}</code>
              </div>
            )}
          </div>

          {/* Update Last Created Case */}
          {createdCaseId && (
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Update Last Created Case
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={assignCase}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                >
                  Assign Case
                </button>
                <button
                  onClick={completeCase}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                >
                  Complete Case
                </button>
              </div>
            </div>
          )}

          {/* Test SLA Breach Check */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test SLA Breach Check</h2>
            <button
              onClick={() => checkBreach()}
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30"
            >
              Run SLA Breach Check
            </button>
            <p className="mt-2 text-sm text-gray-400">
              This will check all OPEN cases and trigger call-outs if conditions are met.
            </p>
          </div>

          {/* Delete All Cases */}
          <div className="rounded-lg border border-red-800 bg-red-900/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Danger Zone</h2>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete ALL cases? This cannot be undone.")) {
                  deleteAll();
                }
              }}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete All Cases"}
            </button>
            <p className="mt-2 text-sm text-red-400">
              ⚠️ This will permanently delete all cases from the database.
            </p>
          </div>

          {/* Testing Instructions */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Testing Instructions</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <strong className="text-white">Test Call-Out Logic (CRITICAL):</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-gray-400 ml-4">
                  <li>Create a CRITICAL case</li>
                  <li>Wait 20+ minutes (or manually set createdAt to 21 minutes ago in database)</li>
                  <li>Click "Run SLA Breach Check"</li>
                  <li>Check main page - row should have red pulsing glow</li>
                </ol>
              </div>
              <div>
                <strong className="text-white">Test Call-Out Logic (HIGH):</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-gray-400 ml-4">
                  <li>Create a HIGH case</li>
                  <li>Ensure current time is outside 09:00-17:00 UK time</li>
                  <li>Wait 5+ minutes (or manually set createdAt to 6 minutes ago)</li>
                  <li>Click "Run SLA Breach Check"</li>
                  <li>Check main page - row should have red pulsing glow</li>
                </ol>
              </div>
              <div>
                <strong className="text-white">Test Live Timer:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-gray-400 ml-4">
                  <li>Create any priority case</li>
                  <li>Go to main page and watch "Time to SLA Breach" column</li>
                  <li>Timer should update every second</li>
                  <li>Color changes: Green → Yellow (&lt;5min) → Red (BREACHED)</li>
                </ol>
              </div>
              <div>
                <strong className="text-white">Test SLI Analytics:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-gray-400 ml-4">
                  <li>Create and complete several cases of different priorities</li>
                  <li>Go to main page and check SLI Analytics section</li>
                  <li>Should show bar charts with delta percentages</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
