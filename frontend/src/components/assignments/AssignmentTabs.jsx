import React from "react";

export default function AssignmentTabs({ activeTab, onTabChange, counts }) {
  const tabs = [
    { id: "ALL", label: "All", count: counts?.total ?? 0 },
    { id: "PENDING", label: "Pending", count: counts?.pending ?? 0 },
    { id: "SUBMITTED", label: "Submitted", count: counts?.submitted ?? 0 },
    { id: "GRADED", label: "Graded", count: counts?.graded ?? 0 },
    { id: "OVERDUE", label: "Overdue", count: counts?.overdue ?? 0 },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              isActive
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
