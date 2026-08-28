import { toast } from "react-hot-toast";

/**
 * Downloads data as a CSV file.
 * @param {string} filename Name of the file to save
 * @param {Array<string>} headers Column headers
 * @param {Array<Array<string|number>>} rows Data rows
 */
export const downloadCSV = (filename, headers, rows) => {
  try {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filename} successfully!`);
  } catch (error) {
    console.error("Export failed:", error);
    toast.error("Failed to export report. Please try again.");
  }
};

/**
 * Exports Student Attendance Data to CSV
 */
export const exportAttendanceReport = (subjects, studentName = "Student") => {
  const headers = ["Subject Code", "Subject Name", "Faculty", "Type", "Total Classes", "Present", "Absent", "Attendance %", "Status"];
  const rows = subjects.map((s) => {
    const pct = Math.round((s.present / (s.totalClasses || 1)) * 100);
    const status = pct >= 75 ? "Regular" : pct >= 60 ? "Warning" : "Critical Shortage";
    return [s.code, s.name, s.faculty || "Faculty", s.type || "Theory", s.totalClasses, s.present, s.absent, `${pct}%`, status];
  });

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCSV(`AURA_OS_Attendance_Report_${dateStr}`, headers, rows);
};

/**
 * Exports Academic Performance Data to CSV
 */
export const exportAcademicReport = (courses, cgpa = "8.6") => {
  const headers = ["Course Code", "Course Name", "Credits", "Internal Score", "EndSem Score", "Grade", "Status"];
  const rows = (courses || []).map((c) => [
    c.code || "AI101",
    c.name || c.title || "Course",
    c.credits || 4,
    c.internal || "85",
    c.endSem || "88",
    c.grade || "A+",
    c.status || "Passed",
  ]);

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCSV(`AURA_OS_Academic_Performance_${dateStr}`, headers, rows);
};

/**
 * Exports User Profile & Account Data
 */
export const exportUserData = (user) => {
  const headers = ["Field", "Value"];
  const rows = [
    ["Name", user?.name || "Yengeshwaran J"],
    ["Email", user?.email || "student@aura.edu"],
    ["Role", user?.role || "Student"],
    ["Institution", "Bannari Amman Institute of Technology"],
    ["Department", "Artificial Intelligence & Data Science"],
    ["CGPA", "8.6"],
    ["Export Date", new Date().toLocaleString()],
  ];

  downloadCSV(`AURA_OS_UserData_${user?.name || "Export"}`, headers, rows);
};
