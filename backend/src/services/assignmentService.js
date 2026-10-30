const Assignment = require("../models/Assignment");
const { createAlertNotification } = require("./alertEngine");
const User = require("../models/User");

// Seed realistic sample assignments if database has zero assignments
const seedDefaultAssignmentsIfEmpty = async () => {
  const count = await Assignment.countDocuments();
  if (count === 0) {
    const now = new Date();
    
    const sampleAssignments = [
      {
        title: "DBMS Database Design & Schema Normalization Report",
        description: "Design an ER diagram and normalized 3NF schema for an e-commerce platform including User, Order, Payment, and Catalog domains.",
        instructions: "Submit a single PDF document containing your ER Diagram, DDL SQL queries, and normalization proofs.",
        subject: "Database Management Systems",
        subjectCode: "CS401",
        faculty: "Dr. Ramesh Sharma",
        semester: 4,
        assignedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
        maxMarks: 50,
        priority: "High",
        allowLateSubmission: true,
        allowResubmission: true,
        attachments: [
          { name: "DBMS_Assignment_Specification.pdf", path: "/uploads/sample_dbms_spec.pdf", size: 1048576 }
        ]
      },
      {
        title: "Artificial Intelligence - Search Algorithms & Heuristics Case Study",
        description: "Implement A* Search and minimax with Alpha-Beta Pruning for a game environment. Compare time & space complexities.",
        instructions: "Zip your source code files (.py or .cpp) along with a summary PDF analysis.",
        subject: "Artificial Intelligence",
        subjectCode: "CS402",
        faculty: "Prof. Ananya Sen",
        semester: 4,
        assignedDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
        maxMarks: 100,
        priority: "Urgent",
        allowLateSubmission: true,
        allowResubmission: true,
        attachments: [
          { name: "AI_Lab_Problem_Statement.pdf", path: "/uploads/sample_ai_spec.pdf", size: 524288 }
        ]
      },
      {
        title: "Operating Systems - Process Scheduling & Memory Allocation Lab",
        description: "Write code to simulate Round Robin, SJF, and Priority Scheduling algorithms, and analyze turnaround time.",
        instructions: "Submit executable code along with screenshots of execution output.",
        subject: "Operating Systems",
        subjectCode: "CS403",
        faculty: "Dr. Vikram Seth",
        semester: 4,
        assignedDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Overdue by 1 day if not submitted
        maxMarks: 30,
        priority: "Medium",
        allowLateSubmission: true,
        allowResubmission: false,
        attachments: []
      },
      {
        title: "Java OOP Mini Project - Student Registration Module",
        description: "Develop a multi-threaded Swing/JavaFX app with File I/O for persistent student record management.",
        instructions: "Submit source zip file with README documentation.",
        subject: "Object Oriented Programming",
        subjectCode: "CS404",
        faculty: "Prof. Sunita Rao",
        semester: 4,
        assignedDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        maxMarks: 20,
        priority: "Low",
        allowLateSubmission: false,
        allowResubmission: true,
        attachments: []
      }
    ];

    await Assignment.insertMany(sampleAssignments);
    console.log("✅ Seeded default sample assignments into local MongoDB");
  }
};

const getStudentAssignments = async (studentId, filters = {}) => {
  await seedDefaultAssignmentsIfEmpty();

  const { search, subject, status, priority, deadlineFilter, semester, sortBy } = filters;

  let query = { status: "active" };

  if (subject) {
    query.subject = subject;
  }

  if (priority) {
    query.priority = priority;
  }

  if (semester) {
    query.semester = Number(semester);
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { title: searchRegex },
      { subject: searchRegex },
      { subjectCode: searchRegex },
      { faculty: searchRegex }
    ];
  }

  const rawAssignments = await Assignment.find(query).sort({ createdAt: -1 });

  const now = new Date();

  // Process status per assignment for current student
  let processed = rawAssignments.map((asm) => {
    const asmObj = asm.toObject();
    const studentSub = asmObj.submissions?.find(
      (sub) => sub.student?.toString() === studentId?.toString()
    );

    let calculatedStatus = "PENDING";
    const isPastDeadline = new Date(asmObj.deadline) < now;

    if (studentSub) {
      if (studentSub.status === "GRADED" || studentSub.marksObtained !== null) {
        calculatedStatus = "GRADED";
      } else {
        calculatedStatus = "SUBMITTED";
      }
    } else if (isPastDeadline) {
      calculatedStatus = "OVERDUE";
    }

    return {
      ...asmObj,
      studentSubmission: studentSub || null,
      computedStatus: calculatedStatus
    };
  });

  // Filter by computed status if requested
  if (status) {
    processed = processed.filter((item) => item.computedStatus.toUpperCase() === status.toUpperCase());
  }

  // Filter by deadlineFilter if requested
  if (deadlineFilter) {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const tomorrowEnd = new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000);

    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);

    const monthEnd = new Date();
    monthEnd.setDate(monthEnd.getDate() + 30);

    processed = processed.filter((item) => {
      const d = new Date(item.deadline);
      if (deadlineFilter === "Today") return d <= todayEnd && d >= new Date();
      if (deadlineFilter === "Tomorrow") return d > todayEnd && d <= tomorrowEnd;
      if (deadlineFilter === "This Week") return d <= weekEnd && d >= new Date();
      if (deadlineFilter === "This Month") return d <= monthEnd && d >= new Date();
      return true;
    });
  }

  // Sort
  if (sortBy) {
    if (sortBy === "Newest") {
      processed.sort((a, b) => new Date(b.assignedDate || b.createdAt) - new Date(a.assignedDate || a.createdAt));
    } else if (sortBy === "Oldest") {
      processed.sort((a, b) => new Date(a.assignedDate || a.createdAt) - new Date(b.assignedDate || b.createdAt));
    } else if (sortBy === "Deadline Soonest") {
      processed.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === "Deadline Latest") {
      processed.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else if (sortBy === "Highest Marks") {
      processed.sort((a, b) => (b.maxMarks || 0) - (a.maxMarks || 0));
    } else if (sortBy === "Subject A-Z") {
      processed.sort((a, b) => a.subject.localeCompare(b.subject));
    }
  }

  return processed;
};

const getStudentStats = async (studentId) => {
  await seedDefaultAssignmentsIfEmpty();
  const allAssignments = await Assignment.find({ status: "active" });
  const now = new Date();

  let total = allAssignments.length;
  let pending = 0;
  let submitted = 0;
  let graded = 0;
  let overdue = 0;
  let dueThisWeek = 0;

  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);

  let totalMarksObtained = 0;
  let totalMaxPossible = 0;
  let totalOnTimeSubmissions = 0;
  let subjectScores = {}; // subject -> { sumPct, count }

  allAssignments.forEach((asm) => {
    const studentSub = asm.submissions?.find(
      (sub) => sub.student?.toString() === studentId?.toString()
    );
    const isPastDeadline = new Date(asm.deadline) < now;
    const isDueThisWeek = new Date(asm.deadline) >= now && new Date(asm.deadline) <= weekEnd;

    if (isDueThisWeek && !studentSub) {
      dueThisWeek++;
    }

    if (studentSub) {
      if (studentSub.status === "GRADED" || studentSub.marksObtained !== null) {
        graded++;
        if (studentSub.marksObtained !== null && asm.maxMarks) {
          const pct = (studentSub.marksObtained / asm.maxMarks) * 100;
          totalMarksObtained += studentSub.marksObtained;
          totalMaxPossible += asm.maxMarks;

          if (!subjectScores[asm.subject]) {
            subjectScores[asm.subject] = { sumPct: 0, count: 0 };
          }
          subjectScores[asm.subject].sumPct += pct;
          subjectScores[asm.subject].count += 1;
        }
      } else {
        submitted++;
      }

      if (!studentSub.isLate) {
        totalOnTimeSubmissions++;
      }
    } else if (isPastDeadline) {
      overdue++;
    } else {
      pending++;
    }
  });

  const submissionRate = total > 0 ? Math.round(((submitted + graded) / total) * 100) : 0;
  const onTimeRate = (submitted + graded) > 0 ? Math.round((totalOnTimeSubmissions / (submitted + graded)) * 100) : 100;
  const avgScore = totalMaxPossible > 0 ? Math.round((totalMarksObtained / totalMaxPossible) * 100) : 0;

  const subjectPerformance = Object.keys(subjectScores).map((sub) => ({
    subject: sub,
    averagePercentage: Math.round(subjectScores[sub].sumPct / subjectScores[sub].count)
  }));

  return {
    total,
    pending,
    submitted,
    graded,
    overdue,
    dueThisWeek,
    submissionRate,
    onTimeRate,
    avgScore,
    subjectPerformance
  };
};

const getUpcomingDeadlines = async (studentId) => {
  await seedDefaultAssignmentsIfEmpty();
  const now = new Date();
  const allAssignments = await Assignment.find({ status: "active", deadline: { $gte: now } }).sort({ deadline: 1 });

  // Filter out already submitted ones
  const upcoming = allAssignments.filter((asm) => {
    const studentSub = asm.submissions?.find(
      (sub) => sub.student?.toString() === studentId?.toString()
    );
    return !studentSub;
  }).slice(0, 5);

  return upcoming;
};

const getAssignmentById = async (studentId, assignmentId) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const asmObj = assignment.toObject();
  const studentSub = asmObj.submissions?.find(
    (sub) => sub.student?.toString() === studentId?.toString()
  );

  const now = new Date();
  let computedStatus = "PENDING";
  if (studentSub) {
    computedStatus = studentSub.status === "GRADED" || studentSub.marksObtained !== null ? "GRADED" : "SUBMITTED";
  } else if (new Date(asmObj.deadline) < now) {
    computedStatus = "OVERDUE";
  }

  return {
    ...asmObj,
    studentSubmission: studentSub || null,
    computedStatus
  };
};

const submitAssignment = async (studentId, assignmentId, fileData, notes) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const now = new Date();
  const isLate = now > new Date(assignment.deadline);

  if (isLate && !assignment.allowLateSubmission) {
    throw new Error("Deadline has passed and late submissions are not allowed for this assignment.");
  }

  const existingSubIndex = assignment.submissions.findIndex(
    (sub) => sub.student?.toString() === studentId?.toString()
  );

  if (existingSubIndex >= 0) {
    if (!assignment.allowResubmission && !isLate) {
      throw new Error("Resubmissions are not permitted for this assignment.");
    }
    // Update submission
    assignment.submissions[existingSubIndex].file = fileData;
    assignment.submissions[existingSubIndex].notes = notes || "";
    assignment.submissions[existingSubIndex].submittedAt = now;
    assignment.submissions[existingSubIndex].isLate = isLate;
    assignment.submissions[existingSubIndex].status = "SUBMITTED";
  } else {
    // New submission
    assignment.submissions.push({
      student: studentId,
      file: fileData,
      notes: notes || "",
      submittedAt: now,
      isLate,
      status: "SUBMITTED"
    });
  }

  await assignment.save();

  createAlertNotification({
    recipient: studentId,
    type: "ASSIGNMENT_SUBMISSION",
    title: "Assignment submitted successfully",
    message: `Your submission for ${assignment.title} was received${isLate ? " after the deadline" : ""}.`,
    targetRoute: `/dashboard/assignments/${assignmentId}`,
    priority: isLate ? "high" : "medium",
    data: {
      assignmentId: String(assignmentId),
      submittedAt: now.toISOString(),
      isLate,
    },
    idempotencyKey: `assignment-submission:${assignmentId}:${studentId}:${now.getTime()}`,
  }).catch((error) => {
    console.warn("[AssignmentService] Submission notification failed:", error.message || error);
  });

  if (assignment.facultyId) {
    createAlertNotification({
      recipient: assignment.facultyId,
      type: "ASSIGNMENT_SUBMISSION",
      title: "New assignment submission",
      message: `A student submitted ${assignment.title} for review.`,
      targetRoute: `/dashboard/assignments/${assignmentId}`,
      priority: "medium",
      data: {
        assignmentId: String(assignmentId),
        studentId: String(studentId),
      },
      idempotencyKey: `assignment-submission-faculty:${assignmentId}:${studentId}:${now.getTime()}`,
    }).catch((error) => {
      console.warn("[AssignmentService] Faculty notification failed:", error.message || error);
    });
  }

  return getAssignmentById(studentId, assignmentId);
};

module.exports = {
  getStudentAssignments,
  getStudentStats,
  getUpcomingDeadlines,
  getAssignmentById,
  submitAssignment
};
