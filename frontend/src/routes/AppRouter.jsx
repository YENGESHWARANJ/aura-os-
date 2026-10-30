import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Student
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardNotifications from "../pages/dashboard/Notifications";
import Academics from "../pages/student/Academics";
import Attendance from "../pages/student/Attendance";
import Assignments from "../pages/student/Assignments";
import Projects from "../pages/student/Projects";
import Skills from "../pages/student/Skills";
import StudyPlanner from "../pages/student/StudyPlanner";
import AIAssistant from "../pages/student/AIAssistant";
import Profile from "../pages/student/Profile";

// Analytics
import AnalyticsDashboard from "../pages/analytics/AnalyticsDashboard";

// Settings
import Settings from "../pages/settings/Settings";

// Faculty
import FacultyDashboard from "../pages/faculty/Dashboard";
import FacultyClasses from "../pages/faculty/Classes";
import FacultyStudents from "../pages/faculty/Students";
import FacultyAttendance from "../pages/faculty/Attendance";
import FacultyAssignments from "../pages/faculty/Assignments";
import FacultyAssessments from "../pages/faculty/Assessments";
import FacultyMarks from "../pages/faculty/Marks";
import FacultyMaterials from "../pages/faculty/Materials";
import FacultyRiskStudents from "../pages/faculty/RiskStudents";
import FacultyFeedback from "../pages/faculty/Feedback";
import FacultyAnalytics from "../pages/faculty/Analytics";
import FacultyReports from "../pages/faculty/Reports";
import FacultyMessages from "../pages/faculty/Messages";
import FacultyNotifications from "../pages/faculty/Notifications";

// Mentor
import MentorDashboard from "../pages/mentor/Dashboard";
import AssignedStudents from "../pages/mentor/AssignedStudents";
import StudentProgress from "../pages/mentor/StudentProgress";
import RiskStudents from "../pages/mentor/RiskStudents";
import MentorMeetings from "../pages/mentor/Meetings";
import MentorNotes from "../pages/mentor/Notes";
import MentorGoals from "../pages/mentor/Goals";
import MentorRecommendations from "../pages/mentor/Recommendations";
import MentorNotifications from "../pages/mentor/Notifications";
import MentorReports from "../pages/mentor/Reports";

// Parent
import ParentDashboard from "../pages/parent/ParentDashboard";
import ParentAttendance from "../pages/parent/ParentAttendance";
import ParentNotifications from "../pages/parent/ParentNotifications";

// Novelty Advanced Modules
import InterventionSimulator from "../pages/interventions/InterventionSimulator";
import CurriculumIntelligence from "../pages/curriculum/CurriculumIntelligence";
import EvidenceWallet from "../pages/evidence/EvidenceWallet";
import EvidenceVerification from "../pages/evidence/EvidenceVerification";
import PublicEvidenceVerification from "../pages/evidence/PublicEvidenceVerification";

// Layout / Protection
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AppRouter() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isMentorOrAdmin =
    user?.role === "mentor" || user?.role === "admin";

  const isFacultyOrAdmin =
    user?.role === "faculty" || user?.role === "admin";

  const isParentOrAdmin =
    user?.role === "parent" || user?.role === "admin";

  return (
    <Routes>
      {/* =========================================================
          AUTH ROUTES
      ========================================================= */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Public Cryptographic Evidence Verification (No Login Required) */}
      <Route
        path="/verify/evidence/:verificationId"
        element={<PublicEvidenceVerification />}
      />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* =========================================================
          STUDENT DASHBOARD
      ========================================================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Academics */}
      <Route
        path="/dashboard/academics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Academics />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Attendance */}
      <Route
        path="/dashboard/attendance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Attendance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Assignments */}
      <Route
        path="/dashboard/assignments"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Assignments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Projects */}
      <Route
        path="/dashboard/projects"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Skills */}
      <Route
        path="/dashboard/skills"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Skills />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Study Planner */}
      <Route
        path="/dashboard/study-planner"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudyPlanner />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Notifications */}
      <Route
        path="/dashboard/notifications"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardNotifications />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* AI Assistant */}
      <Route
        path="/dashboard/ai"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AIAssistant />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Counterfactual Academic Intervention Simulator */}
      <Route
        path="/dashboard/intervention-simulator"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <InterventionSimulator />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Curriculum & Skill Gap Intelligence */}
      <Route
        path="/dashboard/curriculum-intelligence"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CurriculumIntelligence />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Verifiable Academic Evidence Wallet */}
      <Route
        path="/dashboard/evidence-wallet"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EvidenceWallet />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Evidence Verification Queue */}
      <Route
        path="/dashboard/evidence-verification"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EvidenceVerification />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          SETTINGS
      ========================================================= */}
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          FACULTY
      ========================================================= */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyDashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Classes */}
      <Route
        path="/faculty/classes"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyClasses />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Students */}
      <Route
        path="/faculty/students"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyStudents />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Attendance */}
      <Route
        path="/faculty/attendance"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyAttendance />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Assignments */}
      <Route
        path="/faculty/assignments"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyAssignments />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Assessments */}
      <Route
        path="/faculty/assessments"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyAssessments />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Marks */}
      <Route
        path="/faculty/marks"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyMarks />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Materials */}
      <Route
        path="/faculty/materials"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyMaterials />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Risk Students */}
      <Route
        path="/faculty/risk-students"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyRiskStudents />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Student Feedback */}
      <Route
        path="/faculty/feedback"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyFeedback />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Analytics */}
      <Route
        path="/faculty/analytics"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyAnalytics />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Reports */}
      <Route
        path="/faculty/reports"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyReports />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Messages */}
      <Route
        path="/faculty/messages"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyMessages />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Notifications */}
      <Route
        path="/faculty/notifications"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <FacultyNotifications />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Curriculum Intelligence */}
      <Route
        path="/faculty/curriculum-intelligence"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <CurriculumIntelligence />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Faculty - Evidence Verification */}
      <Route
        path="/faculty/evidence-verification"
        element={
          <ProtectedRoute>
            {isFacultyOrAdmin ? (
              <DashboardLayout>
                <EvidenceVerification />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          MENTOR DASHBOARD
      ========================================================= */}
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <MentorDashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Assigned Students */}
      <Route
        path="/mentor/assigned-students"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <AssignedStudents />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Student Progress */}
      <Route
        path="/mentor/student/:studentId"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <StudentProgress />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Risk Students */}
      <Route
        path="/mentor/risk-students"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <RiskStudents />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Meetings */}
      <Route
        path="/mentor/meetings"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <MentorMeetings />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Notes */}
      <Route
        path="/mentor/notes"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <MentorNotes />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Goals */}
      <Route
        path="/mentor/goals"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <MentorGoals />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Recommendations */}
      <Route
        path="/mentor/recommendations"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <MentorRecommendations />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Mentor Notifications */}
      <Route
        path="/mentor/notifications"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <MentorNotifications />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Mentor Reports */}
      <Route
        path="/mentor/reports"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <MentorReports />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Mentor - Intervention Simulator */}
      <Route
        path="/mentor/interventions"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <InterventionSimulator />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Mentor - Evidence Verification */}
      <Route
        path="/mentor/evidence-verification"
        element={
          <ProtectedRoute>
            {isMentorOrAdmin ? (
              <DashboardLayout>
                <EvidenceVerification />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          PARENT PORTAL
      ========================================================= */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute>
            {isParentOrAdmin ? (
              <DashboardLayout>
                <ParentDashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/parent/attendance"
        element={
          <ProtectedRoute>
            {isParentOrAdmin ? (
              <DashboardLayout>
                <ParentAttendance />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/parent/notifications"
        element={
          <ProtectedRoute>
            {isParentOrAdmin ? (
              <DashboardLayout>
                <ParentNotifications />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/parent/ai"
        element={
          <ProtectedRoute>
            {isParentOrAdmin ? (
              <DashboardLayout>
                <AIAssistant />
              </DashboardLayout>
            ) : (
              <Navigate to="/dashboard/ai" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          FALLBACK
      ========================================================= */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}