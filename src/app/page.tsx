"use client";

import { CasesTable } from "~/components/CasesTable";
import { SLIAnalytics } from "~/components/SLIAnalytics";
import { api } from "~/trpc/react";
import { useEffect } from "react";

export default function HomePage() {
  const utils = api.useUtils();
  const { mutate: checkSlaBreach } = api.case.checkSlaBreach.useMutation({
    onSuccess: () => {
      // Refetch cases after checking breaches
      void utils.case.getAll.invalidate();
    },
  });

  // Check SLA breaches every minute
  useEffect(() => {
    // Check immediately on mount
    checkSlaBreach();

    // Then check every minute
    const interval = setInterval(() => {
      checkSlaBreach();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [checkSlaBreach]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Hustle</h1>
          <p className="text-gray-400">24/7 SLA/SLO Tracker</p>
        </div>

        {/* SLI Analytics Section */}
        <div className="mb-8">
          <SLIAnalytics />
        </div>

        {/* Cases Table */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white mb-2">Active Cases</h2>
            <p className="text-sm text-gray-400">
              Cases with red pulsing glow indicate call-out triggered
            </p>
          </div>
          <CasesTable />
        </div>
      </div>
    </main>
  );
}
