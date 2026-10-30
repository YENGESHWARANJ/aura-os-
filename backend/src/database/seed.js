require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const dns = require("dns");
const User = require("../models/User");
const studentsData = require("./studentsData");

const seedDatabase = async () => {
  // Use reliable DNS servers for Atlas SRV resolution
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aura_os";
  console.log("Connecting to database for seeding...");

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log("✅ Connected to MongoDB successfully.");

    console.log(`📋 Found ${studentsData.length} student records to seed.`);

    let createdCount = 0;

    for (const student of studentsData) {
      const { email, ...studentFields } = student;
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            ...studentFields,
            email,
            role: "student",
            status: "active",
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      createdCount++;
    }

    console.log(`\n🎉 Successfully processed ${createdCount} student profiles into MongoDB!`);
    console.log("🎓 Cohort: 50 Students across AI & Data Science, CSE, IT, and ECE.");
    console.log("✅ Seed completed successfully.");
  } catch (error) {
    console.error("❌ Error while seeding database:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
    process.exit(0);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
