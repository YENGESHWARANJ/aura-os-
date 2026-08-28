import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MentorDashboard from "../pages/mentor/Dashboard";
import AssignedStudents from "../pages/mentor/AssignedStudents";
import StudentProgress from "../pages/mentor/StudentProgress";
import RiskStudents from "../pages/mentor/RiskStudents";
import MentorMeetings from "../pages/mentor/Meetings";
import MentorNotes from "../pages/mentor/Notes";
import MentorGoals from "../pages/mentor/Goals";
import MentorRecommendations from "../pages/mentor/Recommendations";
import MentorReports from "../pages/mentor/Reports";

export default function MentorRouter() {
  return (
    <Routes>
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MentorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/assigned-students"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AssignedStudents />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/student/:studentId"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentProgress />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/risk-students"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RiskStudents />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/meetings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MentorMeetings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/notes"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MentorNotes />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/goals"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MentorGoals />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/recommendations"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MentorRecommendations />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MentorReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
