"use client";

import { CaseStatusDistributionChart } from "~/components/DashboardCharts";
import Link from "next/link";

export default function StatusWidgetPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Case Status Distribution</h1>
        </div>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <CaseStatusDistributionChart />
      </div>
    </div>
  );
}
