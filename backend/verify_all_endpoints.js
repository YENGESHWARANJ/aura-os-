const axios = require("axios");

async function testEndpoints() {
  const token = "demo-jwt-token"; // demo token
  const headers = { Authorization: `Bearer ${token}` };
  const base = "http://localhost:5000/api/v1";

  const endpoints = [
    "/dashboard/overview",
    "/profile",
    "/notifications/unread-count",
    "/skills/overview",
    "/skills",
    "/skills/matrix",
    "/skills/gaps?careerRole=Full+Stack+Developer",
    "/skills/readiness?careerRole=Full+Stack+Developer",
    "/skills/roadmap?careerRole=Full+Stack+Developer",
    "/skills/goals",
    "/skills/evidence",
    "/skills/assessments",
    "/skills/recommendations?careerRole=Full+Stack+Developer",
    "/skills/activity",
  ];

  console.log("Checking API endpoints against running server...");
  let allPass = true;

  for (const ep of endpoints) {
    try {
      const res = await axios.get(`${base}${ep}`, { headers, timeout: 5000 });
      console.log(`✅ ${ep} -> Status ${res.status}, Success: ${res.data?.success}`);
    } catch (err) {
      allPass = false;
      console.error(`❌ ${ep} -> Failed: ${err.response?.status || err.message}`);
      if (err.response?.data) {
        console.error("   Data:", JSON.stringify(err.response.data));
      }
    }
  }

  if (allPass) {
    console.log("\n🎉 ALL 14 ENDPOINTS RETURNED 200 OK!");
  }
}

testEndpoints();
