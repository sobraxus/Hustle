"use client";

import { CasesTable } from "~/components/CasesTable";
import { MetricCard } from "~/components/MetricCard";
import {
  BreachesByPriorityChart,
  ResponseTimeTrendChart,
  CaseStatusDistributionChart,
} from "~/components/DashboardCharts";
import { api } from "~/trpc/react";
import { useEffect } from "react";

export default function DashboardPage() {
  const utils = api.useUtils();
  const { data: cases } = api.case.getAll.useQuery();
  const { mutate: checkSlaBreach } = api.case.checkSlaBreach.useMutation({
    onSuccess: () => {
      void utils.case.getAll.invalidate();
    },
  });

  // Check SLA breaches every minute
  useEffect(() => {
    checkSlaBreach();
    const interval = setInterval(() => {
      checkSlaBreach();
    }, 60000);
    return () => clearInterval(interval);
  }, [checkSlaBreach]);

  // Calculate metrics
  const activeCases = cases?.filter((c) => c.status !== "RESOLVED").length || 0;
  const criticalBreaches =
    cases?.filter((c) => c.isCallOutTriggered && c.priority === "CRITICAL")
      .length || 0;
  const totalBreaches = cases?.filter((c) => c.isCallOutTriggered).length || 0;

  // Calculate average resolution SLI
  const completedCases = cases?.filter((c) => c.status === "RESOLVED") || [];
  const avgResolutionSli =
    completedCases.length > 0
      ? completedCases.reduce((sum, c) => {
          const sli = c.resolutionSli || 0;
          return sum + sli;
        }, 0) / completedCases.length
      : 0;

  // Calculate SLA compliance
  const casesWithinSla =
    completedCases.filter((c) => (c.resolutionSli || 0) <= 100).length || 0;
  const slaCompliance =
    completedCases.length > 0
      ? (casesWithinSla / completedCases.length) * 100
      : 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select 
            className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white"
            onChange={(e) => {
              // Time period filter - can be implemented later
              console.log("Time period:", e.target.value);
            }}
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last year</option>
          </select>
          <button 
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => {
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: "Hustle Dashboard",
                  text: "Check out my SLA/SLO dashboard",
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            title="Share dashboard"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button 
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => {
              // Export functionality - could export as CSV or PDF
              alert("Export functionality coming soon!");
            }}
            title="Export data"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button 
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            onClick={() => {
              alert("AI Assistant coming soon!");
            }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            AI Assistant
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Cases"
          value={activeCases}
          trend={{
            value: `${cases?.length || 0} total`,
            isPositive: true,
          }}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <MetricCard
          title="Critical Breaches"
          value={criticalBreaches}
          trend={{
            value: `${totalBreaches} total breaches`,
            isPositive: false,
          }}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <MetricCard
          title="Avg. Resolution (SLI)"
          value={`${avgResolutionSli.toFixed(1)}%`}
          trend={{
            value: "vs target",
            isPositive: avgResolutionSli <= 100,
          }}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <MetricCard
          title="SLA Compliance %"
          value={`${slaCompliance.toFixed(1)}%`}
          trend={{
            value: `${casesWithinSla}/${completedCases.length} cases`,
            isPositive: slaCompliance >= 95,
          }}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart - SLA Breaches by Priority */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">SLA Breaches by Priority</h2>
            <a 
              href="/widgets/breaches"
              className="text-slate-400 hover:text-white transition-colors"
              title="View full page"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <BreachesByPriorityChart />
        </div>

        {/* Donut Chart - Case Status Distribution */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Case Status Distribution</h2>
            <a 
              href="/widgets/status"
              className="text-slate-400 hover:text-white transition-colors"
              title="View full page"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <CaseStatusDistributionChart />
        </div>
      </div>

      {/* Line Chart - Full Width */}
      <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Average Response Time Trend</h2>
          <a 
            href="/widgets/response-time"
            className="text-slate-400 hover:text-white transition-colors"
            title="View full page"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <ResponseTimeTrendChart />
      </div>

      {/* Active Cases Table */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Active Cases</h2>
            <p className="text-sm text-slate-400">
              Cases with red pulsing glow indicate call-out triggered
            </p>
          </div>
        </div>
        <CasesTable />
      </div>
    </div>
  );
}
