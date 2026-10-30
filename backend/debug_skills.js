require("dotenv").config();
const connectDB = require("./src/config/database/mongodb");
const skillService = require("./src/services/skillService");

async function testSkill() {
  await connectDB();
  try {
    const res = await skillService.getSkillOverview("65e000000000000000000001");
    console.log("SUCCESS:", res);
  } catch (err) {
    console.error("ERROR IN SKILL OVERVIEW:", err);
  }
  process.exit(0);
}

testSkill();
