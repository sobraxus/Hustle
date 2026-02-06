"use client";

import { api } from "~/trpc/react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#a855f7", "#f97316", "#ec4899", "#3b82f6"];

export function BreachesByPriorityChart() {
  const { data: cases } = api.case.getAll.useQuery();

  if (!cases) return <div className="text-slate-400">Loading...</div>;

  // Calculate breaches by priority
  const breachesByPriority = cases
    .filter((c) => c.isCallOutTriggered)
    .reduce(
      (acc, c) => {
        acc[c.priority] = (acc[c.priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  const data = [
    { name: "CRITICAL", breaches: breachesByPriority.CRITICAL || 0 },
    { name: "HIGH", breaches: breachesByPriority.HIGH || 0 },
    { name: "MEDIUM", breaches: breachesByPriority.MEDIUM || 0 },
    { name: "LOW", breaches: breachesByPriority.LOW || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#fff",
          }}
          labelStyle={{ color: "#fff" }}
        />
        <Bar dataKey="breaches" fill="#a855f7" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ResponseTimeTrendChart() {
  const { data: cases } = api.case.getAll.useQuery();

  if (!cases) return <div className="text-slate-400">Loading...</div>;

  // Group by month and calculate average response time
  const monthlyData = cases
    .filter((c) => c.assignedAt)
    .reduce((acc, c) => {
      const date = new Date(c.createdAt);
      const month = date.toLocaleString("default", { month: "short" });
      const responseTime =
        (new Date(c.assignedAt!).getTime() - new Date(c.createdAt).getTime()) /
        (1000 * 60); // minutes

      if (!acc[month]) {
        acc[month] = { month, total: 0, count: 0 };
      }
      acc[month].total += responseTime;
      acc[month].count += 1;
      return acc;
    }, {} as Record<string, { month: string; total: number; count: number }>);

  const data = Object.values(monthlyData).map((d) => ({
    month: d.month,
    avgResponse: Math.round(d.total / d.count),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="avgResponse"
          stroke="#a855f7"
          strokeWidth={2}
          dot={{ fill: "#a855f7", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CaseStatusDistributionChart() {
  const { data: cases } = api.case.getAll.useQuery();

  if (!cases) return <div className="text-slate-400">Loading...</div>;

  const statusCounts = cases.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = [
    { name: "OPEN", value: statusCounts.OPEN || 0 },
    { name: "ASSIGNED", value: statusCounts.ASSIGNED || 0 },
    { name: "RESOLVED", value: statusCounts.RESOLVED || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value, percent }) => {
            if (value === 0) return "";
            return `${name}: ${value}`;
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#fff",
          }}
          labelStyle={{ color: "#fff" }}
          formatter={(value: number, name: string) => [
            `${value} cases`,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ color: "#94a3b8" }}
          formatter={(value) => (
            <span style={{ color: "#94a3b8" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
