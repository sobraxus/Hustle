"use client";

import { CasesTable } from "~/components/CasesTable";

export default function CasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Cases</h1>
        <p className="text-slate-400">View and manage all cases</p>
      </div>
      <CasesTable />
    </div>
  );
}
