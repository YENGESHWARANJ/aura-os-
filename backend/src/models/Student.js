const mongoose = require("mongoose");
const User = require("./User");

// In AURA-OS, Student records are managed through the User collection with role: 'student'
module.exports = User;
