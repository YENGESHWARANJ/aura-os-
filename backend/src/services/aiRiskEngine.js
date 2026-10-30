/**
 * AURA OS - AI Academic Risk Engine
 * Implements deterministic multi-factor risk assessment:
 * Risk Score = (Attendance Risk * 0.35) + (Academic Risk * 0.30) +
 *              (Assignment Risk * 0.15) + (Quiz Risk * 0.10) +
 *              (Engagement Risk * 0.10)
 *
 * Risk Levels:
 *  0 - 24 : LOW
 * 25 - 49 : MODERATE
 * 50 - 74 : HIGH
 * 75 - 100: CRITICAL
 */

function calculateAIRisk({
  attendance = 100,
  cgpa = 10.0,
  assignments = { total: 6, completed: 6, pending: 0, overdue: 0 },
  quizMarks = 100,
  completedModules = 10,
  totalModules = 10,
  subjectMarks = [],
}) {
  // 1. Attendance Risk (0 - 100) — Weight 0.35
  let attendanceRisk = 0;
  if (attendance >= 90) {
    attendanceRisk = Math.max(0, Math.round((100 - attendance) * 0.8));
  } else if (attendance >= 80) {
    attendanceRisk = Math.round(10 + (90 - attendance) * 1.5);
  } else if (attendance >= 75) {
    attendanceRisk = Math.round(25 + (80 - attendance) * 3.5);
  } else if (attendance >= 65) {
    attendanceRisk = Math.round(45 + (75 - attendance) * 2.8);
  } else {
    attendanceRisk = Math.min(100, Math.round(73 + (65 - attendance) * 1.8));
  }

  // 2. Academic Risk (0 - 100) — Weight 0.30
  let academicRisk = 0;
  if (cgpa >= 9.0) {
    academicRisk = Math.max(0, Math.round((10.0 - cgpa) * 6));
  } else if (cgpa >= 8.0) {
    academicRisk = Math.round(8 + (9.0 - cgpa) * 17);
  } else if (cgpa >= 7.0) {
    academicRisk = Math.round(28 + (8.0 - cgpa) * 27);
  } else if (cgpa >= 6.0) {
    academicRisk = Math.round(55 + (7.0 - cgpa) * 25);
  } else {
    academicRisk = Math.min(100, Math.round(80 + (6.0 - cgpa) * 35));
  }

  // 3. Assignment Risk (0 - 100) — Weight 0.15
  const overdue = Number(assignments?.overdue || 0);
  const pending = Number(assignments?.pending || 0);
  let assignmentRisk = 0;
  if (overdue > 0) {
    assignmentRisk = Math.min(100, overdue * 35 + pending * 10);
  } else if (pending > 0) {
    assignmentRisk = Math.min(100, pending * 15);
  } else {
    assignmentRisk = 0;
  }

  // 4. Quiz Risk (0 - 100) — Weight 0.10
  const normalizedQuiz = Math.max(0, Math.min(100, Number(quizMarks) || 80));
  const quizRisk = Math.max(0, Math.min(100, Math.round(100 - normalizedQuiz)));

  // 5. Engagement Risk (0 - 100) — Weight 0.10
  const totMod = totalModules > 0 ? totalModules : 10;
  const compMod = Math.min(totMod, Math.max(0, completedModules));
  const moduleCompletionPercent = Math.round((compMod / totMod) * 100);
  const engagementRisk = Math.max(0, Math.min(100, 100 - moduleCompletionPercent));

  // Weighted calculation
  const weightedScore =
    attendanceRisk * 0.35 +
    academicRisk * 0.30 +
    assignmentRisk * 0.15 +
    quizRisk * 0.10 +
    engagementRisk * 0.10;

  const score = Math.max(0, Math.min(100, Math.round(weightedScore)));

  // Risk Level Classification
  let level = "LOW";
  if (score >= 75) {
    level = "CRITICAL";
  } else if (score >= 50) {
    level = "HIGH";
  } else if (score >= 25) {
    level = "MODERATE";
  } else {
    level = "LOW";
  }

  // Factors identification
  const factors = [];
  if (attendance < 75) {
    factors.push(`Attendance below mandatory threshold (${attendance}%)`);
  } else if (attendance < 80) {
    factors.push(`Attendance near warning threshold (${attendance}%)`);
  }

  if (overdue > 0) {
    factors.push(`${overdue} overdue assignment${overdue > 1 ? "s" : ""}`);
  } else if (pending >= 3) {
    factors.push(`${pending} pending coursework assignments`);
  }

  if (cgpa < 6.5) {
    factors.push(`CGPA is below departmental benchmark (${cgpa.toFixed(2)} / 10.0)`);
  } else if (cgpa < 7.5) {
    factors.push(`CGPA requires academic improvement (${cgpa.toFixed(2)} / 10.0)`);
  }

  if (normalizedQuiz < 65) {
    factors.push(`Concept retention quiz score is low (${normalizedQuiz}%)`);
  }

  if (engagementRisk > 40) {
    factors.push(`Low study module engagement (${compMod}/${totMod} modules completed)`);
  }

  // Check weak subjects
  const weakSubjects = subjectMarks.filter((s) => (s.totalMarks || s.internalMarks || 100) < 60);
  if (weakSubjects.length > 0) {
    factors.push(`Academic lag in: ${weakSubjects.map((s) => s.subjectName || s.subjectId).join(", ")}`);
  }

  if (factors.length === 0) {
    factors.push("Consistent attendance and on-track coursework submission");
    factors.push("Strong academic standing across all enrolled subjects");
  }

  // Explanation generation
  let explanation = "";
  if (level === "CRITICAL") {
    explanation = `Critical academic risk detected (${score}%). Urgent intervention required due to ${factors.slice(0, 2).join(" and ")}.`;
  } else if (level === "HIGH") {
    explanation = `High academic risk score (${score}%). Risk increased primarily due to ${factors.slice(0, 2).join(" and ")}.`;
  } else if (level === "MODERATE") {
    explanation = `Moderate academic risk (${score}%). Maintain attendance and clear coursework to return to low risk status.`;
  } else {
    explanation = `Student is in good academic standing (${score}%). Progress is on-track across attendance, grades, and assignments.`;
  }

  return {
    score,
    level,
    factors,
    explanation,
    calculatedAt: new Date(),
    components: {
      attendanceRisk,
      academicRisk,
      assignmentRisk,
      quizRisk,
      engagementRisk,
    },
  };
}

module.exports = {
  calculateAIRisk,
};
