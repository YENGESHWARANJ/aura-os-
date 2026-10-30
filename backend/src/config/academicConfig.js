/**
 * AURA OS - Central Academic Configuration
 * Single source of truth for Academic Department, Semester, Program, and Subjects.
 */

const ACADEMIC_CONFIG = {
  ACADEMIC_YEAR: "2026-2027",
  SEMESTER: 6,
  BATCH: "2023 - 2027",
  GRADUATION_YEAR: 2027,
  DEPARTMENT: "Artificial Intelligence & Data Science",
  PROGRAM: "B.Tech AI & Data Science",
  DEGREE: "B.Tech",
  COLLEGE: "AURA Institute of Technology",
  TOTAL_WORKING_DAYS: 100,
  TOTAL_STUDENTS: 60,
  STUDENT_ID_PREFIX: "AURA2026AI",
  ROLL_PREFIX: "22AI7",

  // 6 Core Subjects for B.Tech AI & Data Science Semester 6
  SUBJECTS: [
    {
      subjectId: "AIDS601",
      code: "22AI601",
      subjectName: "Machine Learning",
      credits: 4,
      faculty: "Prof. Nithya K",
    },
    {
      subjectId: "AIDS602",
      code: "22AI602",
      subjectName: "Deep Learning",
      credits: 4,
      faculty: "Dr. Suresh R",
    },
    {
      subjectId: "AIDS603",
      code: "22AI603",
      subjectName: "Natural Language Processing",
      credits: 3,
      faculty: "Prof. Rajesh Rao",
    },
    {
      subjectId: "AIDS604",
      code: "22AI604",
      subjectName: "Data Mining",
      credits: 3,
      faculty: "Dr. Meenakshi S",
    },
    {
      subjectId: "AIDS605",
      code: "22AI605",
      subjectName: "Cloud Computing",
      credits: 3,
      faculty: "Prof. Arvind V",
    },
    {
      subjectId: "AIDS606",
      code: "22AI606",
      subjectName: "Professional Elective",
      credits: 3,
      faculty: "Dr. Ananya Sharma",
    },
  ],

  // Mentors list
  MENTORS: [
    { mentorId: "MEN001", mentorName: "Dr. Suresh R", email: "mentor@aura.edu" },
    { mentorId: "MEN002", mentorName: "Prof. Nithya K", email: "faculty@aura.edu" },
    { mentorId: "MEN003", mentorName: "Dr. Rajesh Rao", email: "rajesh.rao@aura.edu" },
    { mentorId: "MEN004", mentorName: "Dr. Meenakshi S", email: "meenakshi@aura.edu" },
  ],
};

module.exports = ACADEMIC_CONFIG;
