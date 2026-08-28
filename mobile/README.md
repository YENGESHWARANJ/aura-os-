# AURA OS Mobile Application (React Native / Expo)

A complete, production-ready Android & iOS mobile application for **AURA OS — AI-Driven Academic Performance Monitoring & Personalized Learning Platform**.

---

## 📱 Features by User Role

### 1. Student Portal
* **Live KPI Dashboard**: Real-time Attendance %, CGPA, Pending Tasks, and Active Capstone Projects.
* **AURA AI Academic Monitor**: Live Academic Risk Index ($RI = (100 - S) + \max(0, 75 - A) \times 1.5$) with proactive early intervention insights.
* **Academic Marks Breakdown**: Internal assessments (Internal 1, Internal 2, Model exams, Practicals) and credits tracker.
* **Attendance Tracking**: Course-wise attendance percentages, 75% minimum threshold warning, and instant leave application.
* **Assignments**: Filter by Pending, Submitted, and Graded with rubric preview and GitHub/Drive submission portal.
* **Capstone Projects**: Batch 2026 milestone tracking with live submission window countdown timer.
* **Skill Matrix**: Self-assessment and verified competency matrix with evidence submission.
* **AI Study Planner & Pomodoro Timer**: Adaptive 25-minute focus timer and personalized study schedule prioritizing weak subjects.
* **AI Academic Tutor**: 24/7 Context-aware conversational tutor for doubt resolution and risk reduction advice.

### 2. Faculty Portal
* **Faculty Dashboard**: Active sections, average class attendance, at-risk student count, and grading queue.
* **Fast Attendance Logger**: 1-tap toggle for Present ($P$), Absent ($A$), and Late ($L$) with bulk "Mark All Present" support.
* **At-Risk Early Warning**: List of students flagged by the AI model with 1-tap parent notification and remedial scheduling.

### 3. Mentor Portal
* **Mentee Academic Health**: Risk distribution (High, Medium, Low Risk) across all assigned mentees.
* **Mentee Search & Filter**: Instant search by roll number or name with risk level filter chips.
* **Mentee Progress Drilldown**: Academic history, test score trends, past remarks, and new counseling note logger.
* **1-on-1 Mentoring Meetings**: Schedule counseling sessions and send calendar invitations.

### 4. Parent Portal
* **Child Academic Overview**: Student GPA, attendance rate, and live risk index standing.
* **Direct Mentor Contact**: 1-tap call/contact link to the assigned faculty mentor.
* **Attendance History**: Daily attendance session log with absence alerts.

### 5. Admin / HOD Portal
* **Department KPIs**: Enrolled students, faculty workload, department pass percentage.
* **Random Forest ML Model Health**: Validation accuracy and active risk inference status.
* **User Management**: Filter and view accounts across Students, Faculty, Mentors, and Parents.

---

## 🚀 Getting Started

### 1. Start Backend API Server
Ensure the existing AURA OS Express backend is running on port `5000`:
```bash
cd backend
npm run dev
```

### 2. Start Mobile App Dev Server
In a new terminal window:
```bash
cd mobile
npm start
```

### 3. Run on Device / Emulator

* **Physical Android / iOS Phone**: Install **Expo Go** from Google Play Store / App Store, then scan the QR code displayed in your terminal.
* **Android Emulator**: Press `a` in the terminal or run `npm run android`.
* **iOS Simulator**: Press `i` in the terminal or run `npm run ios`.
* **Web Preview**: Press `w` in the terminal or run `npm run web`.

---

## ⚙️ Connecting Physical Devices to Localhost Backend

When running on a physical phone on your local Wi-Fi network:
1. Open the mobile app.
2. Go to **Profile** → **System Settings** (or Settings icon).
3. Update the **API Base URL** to your computer's local LAN IP:
   ```text
   http://192.168.x.x:5000/api/v1
   ```
4. Click **Save API Endpoint**.

*(Note: For Android Emulator, `http://10.0.2.2:5000/api/v1` is automatically configured as default).*

---

## 📦 Android Standalone APK Generation

To generate an installable Android APK:

### Option A: Cloud Build via EAS (Recommended)
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to Expo:
   ```bash
   eas login
   ```
3. Configure build profile:
   ```bash
   eas build:configure
   ```
4. Build standalone APK for testing:
   ```bash
   eas build -p android --profile preview
   ```

### Option B: Local Android Build (Prebuild)
1. Generate native Android project:
   ```bash
   npx expo prebuild
   ```
2. Build APK using Gradle:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   The APK will be generated at:
   `android/app/build/outputs/apk/release/app-release.apk`
