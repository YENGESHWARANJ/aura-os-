const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const studentsCount = await User.countDocuments({ role: "student" });
    const facultyCount = await User.countDocuments({ role: "faculty" });
    const mentorCount = await User.countDocuments({ role: "mentor" });
    const parentCount = await User.countDocuments({ role: "parent" });

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers || 1420,
        studentsCount: studentsCount || 1200,
        facultyCount: facultyCount || 85,
        mentorCount: mentorCount || 45,
        parentCount: parentCount || 90,
        departmentsCount: 8,
        activeCourses: 34,
        systemHealth: "99.98% Operational",
        serverUptime: "14 days, 6 hours",
        storageUsage: "42.8 GB / 500 GB",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role && role !== "all") query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    const users = await User.find(query).select("-password").lean();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User email already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "student",
      department: department || "Artificial Intelligence & Data Science",
    });

    await user.save();
    res.status(201).json({ success: true, message: "User created successfully", data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User updated", data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getDepartments = async (req, res) => {
  res.json({
    success: true,
    data: [
      { id: "dept_1", name: "Artificial Intelligence & Data Science", code: "AI&DS", studentsCount: 320, facultyCount: 14, hod: "Dr. Ramesh Sharma" },
      { id: "dept_2", name: "Computer Science & Engineering", code: "CSE", studentsCount: 450, facultyCount: 22, hod: "Dr. Anitha V" },
      { id: "dept_3", name: "Information Technology", code: "IT", studentsCount: 280, facultyCount: 16, hod: "Prof. Suresh Kumar" },
      { id: "dept_4", name: "Electronics & Communication", code: "ECE", studentsCount: 250, facultyCount: 18, hod: "Dr. Meenakshi Sundaram" },
    ],
  });
};

exports.getSystemLogs = async (req, res) => {
  res.json({
    success: true,
    data: [
      { id: "log_1", action: "User Role Updated", actor: "Admin System", target: "faculty@aura.edu", timestamp: new Date().toISOString() },
      { id: "log_2", action: "Database Backup Completed", actor: "System Cron", target: "MongoDB Cluster", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "log_3", action: "New Mentor Assigned", actor: "Dr. Ramesh Sharma", target: "24 Students", timestamp: new Date(Date.now() - 7200000).toISOString() },
    ],
  });
};
