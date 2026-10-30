/**
 * AURA OS - Demo Activity Simulator
 * In development, when DEMO_MODE=true:
 * Every 35 seconds, simulates ONE realistic academic event for a random demo student:
 * 1. Student submits assignment
 * 2. Attendance session logged
 * 3. Quiz score evaluated
 * 4. Mentor feedback message
 * 5. Certificate verified
 * 6. Skill verified by faculty
 * 7. Academic risk recalculation & alert
 *
 * Controlled: Exactly ONE event per interval. Updates MongoDB and emits Socket.IO events.
 */

const User = require("../models/User");
const eventBus = require("../events/eventBus");
const { calculateAIRisk } = require("./aiRiskEngine");

let simulationInterval = null;

const startDemoSimulation = () => {
  const isEnabled = process.env.DEMO_MODE === "true";

  if (!isEnabled) {
    console.log("ℹ️  [DemoSimulator] DEMO_MODE is false. Real-time simulation disabled.");
    return null;
  }

  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  console.log("⚡ [DemoSimulator] DEMO_MODE=true. Starting real-time activity simulator (every 35s)...");

  // Run first simulation after 10 seconds, then every 35 seconds
  setTimeout(runSimulationCycle, 10000);
  simulationInterval = setInterval(runSimulationCycle, 35000);

  return simulationInterval;
};

const stopDemoSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("⏹️  [DemoSimulator] Real-time simulation stopped.");
  }
};

async function runSimulationCycle() {
  try {
    // 1. Pick a random demo student
    const sample = await User.aggregate([
      { $match: { isDemoData: true, role: "student" } },
      { $sample: { size: 1 } },
    ]);

    if (!sample || sample.length === 0) return;
    const student = sample[0];
    const studentId = student.studentId;
    const now = new Date();

    // Select 1 of 7 event types (round-robin or random)
    const eventType = Math.floor(Math.random() * 7) + 1;

    switch (eventType) {
      case 1: {
        // Event 1: Student submits assignment
        const assignmentsList = student.assignments?.list || [];
        const pendingItem = assignmentsList.find(
          (a) => a.status === "PENDING" || a.status === "OVERDUE"
        );

        if (pendingItem) {
          const prevStatus = pendingItem.status;
          pendingItem.status = "COMPLETED";
          pendingItem.submittedAt = now;
          pendingItem.marks = Math.floor(Math.random() * 15 + 85);

          const completed = (student.assignments?.completed || 0) + 1;
          const pending = Math.max(
            0,
            (student.assignments?.pending || 0) - (prevStatus === "PENDING" ? 1 : 0)
          );
          const overdue = Math.max(
            0,
            (student.assignments?.overdue || 0) - (prevStatus === "OVERDUE" ? 1 : 0)
          );

          // Recalculate AI Risk
          const newRisk = calculateAIRisk({
            attendance: student.attendance,
            cgpa: student.cgpa,
            assignments: {
              total: student.assignments?.total || 6,
              completed,
              pending,
              overdue,
            },
            quizMarks: student.academic?.quizMarks || 80,
            completedModules: student.studyProgress?.completedModules || 8,
            totalModules: student.studyProgress?.totalModules || 10,
            subjectMarks: student.subjects || [],
          });

          const notification = {
            id: `SIM-NOTIF-${Date.now()}`,
            type: "ASSIGNMENT",
            title: "Assignment Submitted",
            message: `Submission confirmed for "${pendingItem.title}". Evaluation in progress.`,
            priority: "MEDIUM",
            read: false,
            createdAt: now,
          };

          await User.updateOne(
            { _id: student._id },
            {
              $set: {
                "assignments.completed": completed,
                "assignments.pending": pending,
                "assignments.overdue": overdue,
                "assignments.list": assignmentsList,
                assignmentsPending: pending + overdue,
                aiRisk: newRisk,
                lastActivityAt: now,
              },
              $push: {
                notificationsList: {
                  $each: [notification],
                  $position: 0,
                  $slice: 15,
                },
              },
            }
          );

          console.log(
            `🚀 [DemoSimulator] Student ${studentId} (${student.name}) completed assignment "${pendingItem.title}".`
          );

          eventBus.emit("assignment.completed", {
            studentId,
            assignmentId: pendingItem.id,
            title: pendingItem.title,
            completed,
            pending,
          });

          eventBus.emit("risk.updated", {
            studentId,
            aiRisk: newRisk,
          });

          eventBus.emit("notification.created", {
            studentId,
            ...notification,
          });
        }
        break;
      }

      case 2: {
        // Event 2: Attendance session recorded
        const currentPresent = student.attendanceDetails?.presentDays || student.attendance || 80;
        const totalWorking = student.attendanceDetails?.totalWorkingDays || 100;
        // Minor variation: +1 attendance
        const newPresent = Math.min(totalWorking, currentPresent + 1);
        const newAbsent = totalWorking - newPresent;
        const newAttendance = Math.round((newPresent / totalWorking) * 100);

        const newRisk = calculateAIRisk({
          attendance: newAttendance,
          cgpa: student.cgpa,
          assignments: student.assignments,
          quizMarks: student.academic?.quizMarks || 80,
          completedModules: student.studyProgress?.completedModules || 8,
          totalModules: student.studyProgress?.totalModules || 10,
          subjectMarks: student.subjects || [],
        });

        await User.updateOne(
          { _id: student._id },
          {
            $set: {
              attendance: newAttendance,
              "attendanceDetails.overall": newAttendance,
              "attendanceDetails.presentDays": newPresent,
              "attendanceDetails.absentDays": newAbsent,
              aiRisk: newRisk,
              lastActivityAt: now,
            },
          }
        );

        console.log(
          `📅 [DemoSimulator] Attendance logged for ${studentId} (${student.name}): ${newAttendance}% (${newPresent}/${totalWorking} days).`
        );

        eventBus.emit("attendance.updated", {
          studentId,
          attendance: newAttendance,
          presentDays: newPresent,
          absentDays: newAbsent,
          totalWorkingDays: totalWorking,
        });

        eventBus.emit("risk.updated", {
          studentId,
          aiRisk: newRisk,
        });
        break;
      }

      case 3: {
        // Event 3: Quiz score added
        const subjects = student.subjects || [];
        if (subjects.length > 0) {
          const subIdx = Math.floor(Math.random() * subjects.length);
          const targetSub = subjects[subIdx];
          const newQuizMark = Math.min(100, Math.max(50, targetSub.quizMarks + Math.floor(Math.random() * 10 - 3)));
          targetSub.quizMarks = newQuizMark;
          targetSub.totalMarks = Math.round(
            targetSub.internalMarks * 0.3 +
              targetSub.assignmentMarks * 0.2 +
              targetSub.quizMarks * 0.1 +
              targetSub.semesterMarks * 0.4
          );

          const newRisk = calculateAIRisk({
            attendance: student.attendance,
            cgpa: student.cgpa,
            assignments: student.assignments,
            quizMarks: newQuizMark,
            completedModules: student.studyProgress?.completedModules || 8,
            totalModules: student.studyProgress?.totalModules || 10,
            subjectMarks: subjects,
          });

          await User.updateOne(
            { _id: student._id },
            {
              $set: {
                subjects,
                aiRisk: newRisk,
                lastActivityAt: now,
              },
            }
          );

          console.log(
            `📊 [DemoSimulator] Quiz score updated for ${studentId} in ${targetSub.subjectName}: ${newQuizMark}%.`
          );

          eventBus.emit("performance.updated", {
            studentId,
            subject: targetSub.subjectName,
            quizMarks: newQuizMark,
            totalMarks: targetSub.totalMarks,
          });

          eventBus.emit("risk.updated", {
            studentId,
            aiRisk: newRisk,
          });
        }
        break;
      }

      case 4: {
        // Event 4: Mentor sends guidance message
        const mentorName = student.mentorInfo?.mentorName || "Dr. Suresh R";
        const messages = [
          "Great effort on the Machine Learning sprint! Continue with the regular practice quizzes.",
          "Keep your attendance above 85% this month to ensure top placement eligibility.",
          "Please review the feedback on your Deep Learning architecture diagram.",
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];

        const notification = {
          id: `NOTIF-MENTOR-${Date.now()}`,
          type: "MENTOR",
          title: `Mentor Note from ${mentorName}`,
          message: msg,
          priority: "MEDIUM",
          read: false,
          createdAt: now,
        };

        await User.updateOne(
          { _id: student._id },
          {
            $push: {
              notificationsList: {
                $each: [notification],
                $position: 0,
                $slice: 15,
              },
            },
            $set: { lastActivityAt: now },
          }
        );

        console.log(`💬 [DemoSimulator] Mentor message delivered to ${studentId}: "${msg.slice(0, 40)}..."`);

        eventBus.emit("mentor.message", {
          studentId,
          mentorName,
          message: msg,
        });

        eventBus.emit("notification.created", {
          studentId,
          ...notification,
        });
        break;
      }

      case 5: {
        // Event 5: Certificate verified
        const certs = student.certifications || [];
        const pendingCert = certs.find((c) => c.status === "PENDING");

        if (pendingCert) {
          pendingCert.status = "VERIFIED";

          const alert = {
            id: `ALT-CERT-${Date.now()}`,
            type: "CERTIFICATE_VERIFIED",
            title: "Certification Approved",
            message: `Your "${pendingCert.name}" certification has been formally verified.`,
            priority: "LOW",
            createdAt: now,
          };

          await User.updateOne(
            { _id: student._id },
            {
              $set: { certifications: certs, lastActivityAt: now },
              $push: {
                alerts: {
                  $each: [alert],
                  $position: 0,
                  $slice: 10,
                },
              },
            }
          );

          console.log(`🏅 [DemoSimulator] Certificate "${pendingCert.name}" verified for ${studentId}.`);

          eventBus.emit("certificate.verified", {
            studentId,
            certificateName: pendingCert.name,
          });

          eventBus.emit("alert.created", {
            studentId,
            ...alert,
          });
        }
        break;
      }

      case 6: {
        // Event 6: Skill verified by faculty
        const skills = student.skillsList || [];
        const unverifiedSkill = skills.find((s) => !s.verified);

        if (unverifiedSkill) {
          unverifiedSkill.verified = true;

          const notification = {
            id: `NOTIF-SKILL-${Date.now()}`,
            type: "SKILL",
            title: "Skill Competency Verified",
            message: `Faculty verified your competency in ${unverifiedSkill.skillName} (${unverifiedSkill.level}).`,
            priority: "LOW",
            read: false,
            createdAt: now,
          };

          await User.updateOne(
            { _id: student._id },
            {
              $set: { skillsList: skills, lastActivityAt: now },
              $push: {
                notificationsList: {
                  $each: [notification],
                  $position: 0,
                  $slice: 15,
                },
              },
            }
          );

          console.log(`⭐ [DemoSimulator] Skill ${unverifiedSkill.skillName} verified for ${studentId}.`);

          eventBus.emit("skill.verified", {
            studentId,
            skillName: unverifiedSkill.skillName,
            level: unverifiedSkill.level,
          });

          eventBus.emit("notification.created", {
            studentId,
            ...notification,
          });
        }
        break;
      }

      case 7: {
        // Event 7: New Academic Alert generated
        const alert = {
          id: `ALT-ACAD-${Date.now()}`,
          type: "ACADEMIC_ALERT",
          title: "Upcoming Project Milestone",
          message: "Sprint 3 deliverables for B.Tech Capstone Project are due this Friday.",
          priority: "MEDIUM",
          createdAt: now,
        };

        await User.updateOne(
          { _id: student._id },
          {
            $push: {
              alerts: {
                $each: [alert],
                $position: 0,
                $slice: 10,
              },
            },
            $set: { lastActivityAt: now },
          }
        );

        console.log(`🔔 [DemoSimulator] Milestone alert generated for ${studentId}.`);

        eventBus.emit("alert.created", {
          studentId,
          ...alert,
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.warn("⚠️ [DemoSimulator] Error during simulation cycle:", err.message);
  }
}

module.exports = {
  startDemoSimulation,
  stopDemoSimulation,
};
