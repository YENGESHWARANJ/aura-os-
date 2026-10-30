/**
 * AURA OS - Database Seed Runner for 60 Demo Students
 * Validates all records before insert, removes only { isDemoData: true },
 * and populates exactly 60 demo students.
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const dns = require("dns");
const User = require("../models/User");
const { generateDemoStudents } = require("./demoStudentsGenerator");

// Validation Function (Step 12)
function validateStudentRecords(students) {
  if (!Array.isArray(students)) {
    throw new Error("Validation Error: Students payload is not an array.");
  }

  if (students.length !== 60) {
    throw new Error(`Validation Error: Expected exactly 60 students, found ${students.length}.`);
  }

  const seenStudentIds = new Set();
  const seenRollNumbers = new Set();
  const seenEmails = new Set();
  const validRiskLevels = new Set(["LOW", "MODERATE", "HIGH", "CRITICAL"]);

  students.forEach((s, idx) => {
    const label = `Student #${idx + 1} (${s.studentId || "unknown"})`;

    // 1. Identity & Uniqueness
    if (!s.studentId) throw new Error(`${label}: Missing studentId.`);
    if (seenStudentIds.has(s.studentId)) throw new Error(`${label}: Duplicate studentId '${s.studentId}'.`);
    seenStudentIds.add(s.studentId);

    if (!s.rollNumber) throw new Error(`${label}: Missing rollNumber.`);
    if (seenRollNumbers.has(s.rollNumber)) throw new Error(`${label}: Duplicate rollNumber '${s.rollNumber}'.`);
    seenRollNumbers.add(s.rollNumber);

    if (!s.email) throw new Error(`${label}: Missing email.`);
    if (seenEmails.has(s.email)) throw new Error(`${label}: Duplicate email '${s.email}'.`);
    seenEmails.add(s.email);

    if (!s.name || typeof s.name !== "string" || s.name.trim().length === 0) {
      throw new Error(`${label}: Invalid name.`);
    }

    // 2. Attendance Validation
    if (typeof s.attendance !== "number" || s.attendance < 0 || s.attendance > 100) {
      throw new Error(`${label}: Attendance ${s.attendance} out of bounds (0-100).`);
    }

    const attDetails = s.attendanceDetails;
    if (!attDetails) throw new Error(`${label}: Missing attendanceDetails.`);
    if (attDetails.presentDays + attDetails.absentDays !== attDetails.totalWorkingDays) {
      throw new Error(
        `${label}: Mathematical invalidity: presentDays (${attDetails.presentDays}) + absentDays (${attDetails.absentDays}) != totalWorkingDays (${attDetails.totalWorkingDays}).`
      );
    }

    // 3. CGPA Validation
    if (typeof s.cgpa !== "number" || s.cgpa < 0 || s.cgpa > 10) {
      throw new Error(`${label}: CGPA ${s.cgpa} out of bounds (0-10).`);
    }

    // 4. Subjects & Marks Validation
    if (!Array.isArray(s.subjects) || s.subjects.length === 0) {
      throw new Error(`${label}: Missing or empty subjects array.`);
    }

    s.subjects.forEach((sub) => {
      ["internalMarks", "assignmentMarks", "quizMarks", "semesterMarks", "totalMarks"].forEach((mKey) => {
        const mark = sub[mKey];
        if (typeof mark !== "number" || mark < 0 || mark > 100) {
          throw new Error(`${label}: Subject '${sub.subjectName}' has invalid mark ${mKey} = ${mark}.`);
        }
      });
    });

    // 5. Assignment Totals
    const asg = s.assignments;
    if (!asg) throw new Error(`${label}: Missing assignments object.`);
    if (asg.completed + asg.pending + asg.overdue > asg.total) {
      throw new Error(
        `${label}: Invalid assignment totals: completed (${asg.completed}) + pending (${asg.pending}) + overdue (${asg.overdue}) > total (${asg.total}).`
      );
    }

    // 6. AI Risk Score & Level
    const risk = s.aiRisk;
    if (!risk) throw new Error(`${label}: Missing aiRisk object.`);
    if (typeof risk.score !== "number" || risk.score < 0 || risk.score > 100) {
      throw new Error(`${label}: Risk score ${risk.score} out of bounds (0-100).`);
    }
    if (!validRiskLevels.has(risk.level)) {
      throw new Error(`${label}: Invalid risk level '${risk.level}'. Must be LOW, MODERATE, HIGH, or CRITICAL.`);
    }

    // 7. Demo Data Flag
    if (s.isDemoData !== true) {
      throw new Error(`${label}: isDemoData must strictly be true.`);
    }
  });

  return true;
}

// Seed Runner
async function seedStudents() {
  console.log("==================================================");
  console.log("       AURA OS - 60 Demo Students Seeder          ");
  console.log("==================================================");

  // Use reliable DNS servers for Atlas SRV resolution
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error("❌ MONGODB_URI is not defined in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB Atlas...");
  await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  console.log("✅ MongoDB Connected Successfully.");

  try {
    console.log("⚙️  Generating 60 demo students with realistic distributions...");
    const students = await generateDemoStudents();

    console.log("🔍 Validating all 60 demo student records before insert...");
    validateStudentRecords(students);
    console.log("✅ All 60 records passed validation (Attendance, CGPA, Marks, Risk, Uniqueness).");

    // Remove ONLY demo data to preserve real users
    console.log("🧹 Purging ONLY existing demo students ({ isDemoData: true })...");
    const deleteResult = await User.deleteMany({ isDemoData: true });
    console.log(`🗑️  Removed ${deleteResult.deletedCount} old demo records. Real users preserved.`);

    // Insert 60 demo students
    console.log("💾 Inserting exactly 60 validated demo students...");
    const inserted = await User.insertMany(students);
    console.log(`✅ Successfully inserted ${inserted.length} demo students!`);

    // Distribution Summary
    const attendanceStats = {
      excellent: students.filter((s) => s.attendance >= 90).length,
      good: students.filter((s) => s.attendance >= 80 && s.attendance < 90).length,
      average: students.filter((s) => s.attendance >= 75 && s.attendance < 80).length,
      warning: students.filter((s) => s.attendance >= 65 && s.attendance < 75).length,
      critical: students.filter((s) => s.attendance < 65).length,
    };

    const riskStats = {
      low: students.filter((s) => s.aiRisk.level === "LOW").length,
      moderate: students.filter((s) => s.aiRisk.level === "MODERATE").length,
      high: students.filter((s) => s.aiRisk.level === "HIGH").length,
      critical: students.filter((s) => s.aiRisk.level === "CRITICAL").length,
    };

    const avgAttendance = (
      students.reduce((acc, s) => acc + s.attendance, 0) / students.length
    ).toFixed(1);

    const avgCGPA = (
      students.reduce((acc, s) => acc + s.cgpa, 0) / students.length
    ).toFixed(2);

    console.log("\n=================== SEED SUMMARY ===================");
    console.log(` Total Demo Students : ${inserted.length}`);
    console.log(` Academic Cohort     : B.Tech AI & Data Science (Sem 6, AY 2026-2027)`);
    console.log(` Average Attendance  : ${avgAttendance}%`);
    console.log(` Average CGPA        : ${avgCGPA} / 10.0`);
    console.log("---------------- Attendance Breakdown ----------------");
    console.log(`  - Excellent (90-98%) : ${attendanceStats.excellent} students`);
    console.log(`  - Good (80-89%)      : ${attendanceStats.good} students`);
    console.log(`  - Average (75-79%)   : ${attendanceStats.average} students`);
    console.log(`  - Warning (65-74%)   : ${attendanceStats.warning} students`);
    console.log(`  - Critical (<65%)    : ${attendanceStats.critical} students`);
    console.log("------------------ AI Risk Breakdown -----------------");
    console.log(`  - LOW (0-24)         : ${riskStats.low} students`);
    console.log(`  - MODERATE (25-49)   : ${riskStats.moderate} students`);
    console.log(`  - HIGH (50-74)       : ${riskStats.high} students`);
    console.log(`  - CRITICAL (75-100)  : ${riskStats.critical} students`);
    console.log("====================================================\n");

    return inserted;
  } catch (error) {
    console.error("\n❌ SEEDING FAILED - ABORTED WITHOUT CORRUPTING DATABASE:");
    console.error(error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected cleanly.");
  }
}

if (require.main === module) {
  seedStudents()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = {
  seedStudents,
  validateStudentRecords,
};
