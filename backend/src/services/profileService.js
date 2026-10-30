const mongoose = require("mongoose");
const User = require("../models/User");
const Skill = require("../models/Skill");
const Project = require("../models/Project");

// ─── Resolve Target Student Helper ───────────────────────────
async function resolveStudent(userId, dataId = null) {
  let user = null;
  if (dataId && mongoose.isValidObjectId(dataId)) {
    user = await User.findById(dataId).select("-password -refreshToken").lean();
    if (user) return user;
  }
  if (userId && mongoose.isValidObjectId(userId)) {
    user = await User.findById(userId).select("-password -refreshToken").lean();
    if (user) return user;
  }
  user = await User.findOne({ role: "student" }).select("-password -refreshToken").lean();
  return user;
}

// ─── Calculate Profile Completion % ─────────────────────────
function calculateProfileCompletion(user, skillCount) {
  const checks = [
    { key: "name", label: "Add full name", value: !!user.name },
    { key: "email", label: "Add email", value: !!user.email },
    { key: "phone", label: "Add phone number", value: !!user.phone },
    { key: "avatar", label: "Add profile photo", value: !!user.avatar },
    { key: "bio", label: "Add short bio / about me", value: !!user.bio },
    { key: "department", label: "Add department", value: !!user.department },
    { key: "degree", label: "Add degree", value: !!user.degree },
    { key: "registerNumber", label: "Add register number", value: !!user.registerNumber },
    { key: "careerGoal", label: "Add career goal", value: !!user.careerGoal },
    { key: "preferredRole", label: "Add preferred role", value: !!user.preferredRole },
    { key: "linkedin", label: "Add LinkedIn link", value: !!user.socialLinks?.linkedin },
    { key: "github", label: "Add GitHub link", value: !!user.socialLinks?.github },
    { key: "skills", label: "Add at least one skill", value: skillCount > 0 },
    { key: "resume", label: "Upload resume", value: !!user.resume?.url },
  ];

  const completed = checks.filter((c) => c.value).length;
  const percentage = Math.round((completed / checks.length) * 100);

  let strength = "Beginner";
  if (percentage >= 81) strength = "Excellent";
  else if (percentage >= 51) strength = "Strong";
  else if (percentage >= 26) strength = "Intermediate";

  const missingChecklist = checks.filter((c) => !c.value).map((c) => c.label);

  return { percentage, strength, missingChecklist, completedCount: completed, totalCount: checks.length };
}

// ─── Get Student Profile Overview ────────────────────────────
exports.getProfileOverview = async (userId) => {
  let user = await resolveStudent(userId);
  if (!user) {
    user = {
      _id: userId,
      name: "Alex Johnson",
      email: "student@aura.edu",
      role: "student",
      department: "AI & Data Science",
      degree: "B.Tech",
      registerNumber: "AURA2024CS042",
      cgpa: 8.85,
      attendance: 92,
      skills: ["React", "Node.js", "Python", "MongoDB"],
      projects: [],
      assignmentsPending: 2,
    };
  }

  const effectiveUserId = user._id;

  // Filter skills and projects by THIS student only
  const skills = await Skill.find({ student: effectiveUserId })
    .sort({ proficiencyPercentage: -1 })
    .limit(6)
    .lean();

  const skillCount = await Skill.countDocuments({ student: effectiveUserId });

  // Projects: check if student is on a team — for now use User embedded projects or return empty
  const projects = [];

  const completion = calculateProfileCompletion(user, skillCount);

  // Career Readiness — deterministic from real data
  const skillScore = skillCount > 0 ? Math.min(100, Math.round((skillCount / 10) * 100)) : 0;
  const projectScore = (user.projects?.length || 0) > 0 ? Math.min(100, Math.round(((user.projects?.length || 0) / 5) * 100)) : 0;
  const cgpa = user.cgpa || 0;
  const academicScore = cgpa > 0 ? Math.round((cgpa / 10) * 100) : 0;
  const profileScore = completion.percentage;

  const allZero = skillScore === 0 && projectScore === 0 && academicScore === 0;

  const readiness = allZero
    ? null
    : {
        overall: Math.round(skillScore * 0.35 + projectScore * 0.25 + academicScore * 0.25 + profileScore * 0.15),
        technicalSkills: skillScore,
        projects: projectScore,
        academicPerformance: academicScore,
        profileCompletion: profileScore,
      };

  return {
    user,
    completion,
    readiness,
    skills,
    projects,
    skillCount,
  };
};

// ─── Update Profile (Allowlist Protected) ───────────────────
exports.updateProfile = async (userId, data = {}) => {
  const allowedFields = [
    "name",
    "phone",
    "bio",
    "dob",
    "gender",
    "city",
    "state",
    "country",
    "alternateEmail",
    "degree",
    "specialization",
    "registerNumber",
    "batch",
    "graduationYear",
    "careerGoal",
    "preferredRole",
    "interestedDomains",
    "preferredTechnologies",
    "socialLinks",
    "college",
    "department",
    "semester",
  ];

  const updatePayload = {};
  Object.keys(data).forEach((key) => {
    if (allowedFields.includes(key)) {
      if (key === "dob") {
        updatePayload[key] = data[key] ? new Date(data[key]) : null;
      } else if (key === "graduationYear" || key === "semester") {
        updatePayload[key] =
          data[key] !== "" && data[key] !== null && !isNaN(Number(data[key]))
            ? Number(data[key])
            : null;
      } else {
        updatePayload[key] = data[key];
      }
    }
  });

  const targetUser = await resolveStudent(userId, data._id);
  if (!targetUser) {
    throw new Error("Student profile record not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    targetUser._id,
    { $set: updatePayload },
    { new: true, runValidators: false }
  )
    .select("-password -refreshToken")
    .lean();

  return updatedUser;
};

// ─── Avatar & Resume Updates ────────────────────────────────
exports.updateAvatar = async (userId, avatarUrl, targetId = null) => {
  const targetUser = await resolveStudent(userId, targetId);
  if (!targetUser) throw new Error("Student profile record not found");
  return User.findByIdAndUpdate(targetUser._id, { avatar: avatarUrl }, { new: true })
    .select("-password -refreshToken")
    .lean();
};

exports.deleteAvatar = async (userId, targetId = null) => {
  const targetUser = await resolveStudent(userId, targetId);
  if (!targetUser) throw new Error("Student profile record not found");
  return User.findByIdAndUpdate(targetUser._id, { $unset: { avatar: 1 } }, { new: true })
    .select("-password -refreshToken")
    .lean();
};

exports.updateResume = async (userId, resumeData, targetId = null) => {
  const targetUser = await resolveStudent(userId, targetId);
  if (!targetUser) throw new Error("Student profile record not found");
  return User.findByIdAndUpdate(targetUser._id, { resume: resumeData }, { new: true })
    .select("-password -refreshToken")
    .lean();
};

exports.deleteResume = async (userId, targetId = null) => {
  const targetUser = await resolveStudent(userId, targetId);
  if (!targetUser) throw new Error("Student profile record not found");
  return User.findByIdAndUpdate(
    targetUser._id,
    { $unset: { resume: 1 } },
    { new: true }
  )
    .select("-password -refreshToken")
    .lean();
};
