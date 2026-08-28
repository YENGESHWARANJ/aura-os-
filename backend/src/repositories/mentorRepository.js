const Mentor = require("../models/Mentor");
const User = require("../models/User");

const findByUserId = (userId) => {
  return Mentor.findOne({ user: userId });
};

const createMentor = (userId) => {
  return Mentor.create({ user: userId });
};

const findOrCreateMentor = async (userId) => {
  let mentor = await findByUserId(userId);
  if (!mentor) {
    mentor = await createMentor(userId);
  }
  return mentor;
};

const getAssignedStudents = async (mentorId) => {
  const mentor = await Mentor.findById(mentorId).lean();
  if (!mentor) return [];
  return User.find({ _id: { $in: mentor.assignedStudents } }).select("name email role college department semester cgpa attendance").lean();
};

const getMentorById = (mentorId) => {
  return Mentor.findById(mentorId);
};

const addMeeting = (mentorId, meetingData) => {
  return Mentor.findByIdAndUpdate(
    mentorId,
    { $push: { meetings: meetingData } },
    { new: true, runValidators: true }
  );
};

const addNote = (mentorId, noteData) => {
  return Mentor.findByIdAndUpdate(
    mentorId,
    { $push: { notes: noteData } },
    { new: true, runValidators: true }
  );
};

const addGoal = (mentorId, goalData) => {
  return Mentor.findByIdAndUpdate(
    mentorId,
    { $push: { goals: goalData } },
    { new: true, runValidators: true }
  );
};

const updateGoal = (mentorId, goalId, updates) => {
  return Mentor.findOneAndUpdate(
    { _id: mentorId, "goals._id": goalId },
    {
      $set: Object.entries(updates).reduce((acc, [key, value]) => {
        acc[`goals.$.${key}`] = value;
        return acc;
      }, {}),
    },
    { new: true, runValidators: true }
  );
};

const findAssignedStudent = async (mentor, studentId) => {
  if (!mentor) return null;
  return mentor.assignedStudents.some((id) => id.toString() === studentId.toString());
};

module.exports = {
  findByUserId,
  createMentor,
  findOrCreateMentor,
  getAssignedStudents,
  getMentorById,
  addMeeting,
  addNote,
  addGoal,
  updateGoal,
  findAssignedStudent,
};
