const fs = require("fs");
const path = require("path");

const studentsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../../datasets/students_50.json"), "utf8")
);

module.exports = studentsData;
