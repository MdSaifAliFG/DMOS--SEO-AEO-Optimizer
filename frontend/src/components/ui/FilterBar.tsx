"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdown {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (val: string) => void;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDropdown[];
  onReset?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filters = [],
  onReset,
  rightAction,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
        className
      )}
    >
      {/* Left search */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Filter dropdowns & Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium">{filter.label}:</span>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 font-medium transition-colors"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onReset && (
          <button
            onClick={onReset}
            title="Reset Filters"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {rightAction && <div className="ml-auto md:ml-2">{rightAction}</div>}
      </div>
    </div>
  );
}
