"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Main Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-purple-500 to-blue-500" />
              <span className="text-xl font-bold text-white">Hustle</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "text-white border-b-2 border-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/cases"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/cases")
                    ? "text-white border-b-2 border-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Cases
              </Link>
              <Link
                href="/team"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/team")
                    ? "text-white border-b-2 border-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Team
              </Link>
              <Link
                href="/reports"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/reports")
                    ? "text-white border-b-2 border-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Reports
              </Link>
              <Link
                href="/test"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/test")
                    ? "text-white border-b-2 border-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Dev
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="text-slate-400 hover:text-white transition-colors">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Help Icon */}
            <button className="text-slate-400 hover:text-white transition-colors">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {/* Notifications Bell */}
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-white">User</div>
                <div className="text-xs text-slate-400">Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
