import React, { useState } from "react";
import { UserCheck, Shield, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";

const ATTENDANCE_SUMMARY = {
  overallPct: 84,
  totalPresent: 185,
  totalAbsent: 35,
  totalClasses: 220,
};

const SUBJECT_ATTENDANCE = [
  { code: "22AI701", name: "Data Visualisation", type: "Theory", present: 40, total: 45, pct: 88, status: "Safe" },
  { code: "22AI702", name: "Natural Language Processing", type: "Theory", present: 37, total: 40, pct: 92, status: "Safe" },
  { code: "22AI703", name: "Computer Vision", type: "Theory", present: 30, total: 38, pct: 78, status: "Safe" },
  { code: "22AI704", name: "Reinforcement Learning", type: "Theory", present: 29, total: 35, pct: 82, status: "Safe" },
  { code: "22AI705", name: "Big Data Analytics", type: "Theory", present: 30, total: 42, pct: 71, status: "Warning" },
  { code: "22AI706", name: "IoT & Embedded Systems", type: "Lab", present: 22, total: 30, pct: 73, status: "Warning" },
];

export default function ParentAttendance() {
  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Parent Portal"
        title="Student Attendance Report"
        description="Detailed attendance tracking, subject-level breakdowns, and biometric verification logs."
      />

      {/* Warning Banner if any subject <75% */}
      <div className="attendance-warning mb-6">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-amber-400">Attendance Attention Required</p>
          <p className="text-xs text-slate-300">
            Big Data Analytics (71%) and IoT & Embedded Systems (73%) are below the recommended 75% attendance threshold.
          </p>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="attendance-stats mb-6">
        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Overall Attendance</span>
          <p className="text-3xl font-extrabold text-white mt-2">{ATTENDANCE_SUMMARY.overallPct}%</p>
          <p className="text-xs text-emerald-400 mt-1">Sufficient for Exam Eligibility</p>
        </div>

        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Total Classes Attended</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{ATTENDANCE_SUMMARY.totalPresent}</p>
          <p className="text-xs text-slate-400 mt-1">Out of {ATTENDANCE_SUMMARY.totalClasses} sessions</p>
        </div>

        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Total Classes Missed</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{ATTENDANCE_SUMMARY.totalAbsent}</p>
          <p className="text-xs text-slate-400 mt-1">Absence Days logged</p>
        </div>

        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Biometric Verification</span>
          <p className="text-3xl font-extrabold text-cyan-400 mt-2">100%</p>
          <p className="text-xs text-slate-400 mt-1">Biometric scans verified</p>
        </div>
      </div>

      {/* Subject Attendance Table */}
      <div className="aura-card">
        <h3 className="text-base font-bold text-white mb-4">Subject Attendance Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Attended / Total</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {SUBJECT_ATTENDANCE.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{sub.code}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{sub.name}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">{sub.type}</td>
                  <td className="py-3.5 px-4 text-slate-300">{sub.present} / {sub.total}</td>
                  <td className="py-3.5 px-4 font-extrabold">
                    <span className={sub.pct < 75 ? "text-rose-400" : "text-emerald-400"}>
                      {sub.pct}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`aura-badge ${sub.status === "Safe" ? "aura-badge-success" : "aura-badge-warning"}`}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
