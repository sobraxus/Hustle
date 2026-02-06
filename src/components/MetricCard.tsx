"use client";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              {trend.isPositive ? (
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-slate-400 opacity-50">{icon}</div>
        )}
      </div>
    </div>
  );
}
