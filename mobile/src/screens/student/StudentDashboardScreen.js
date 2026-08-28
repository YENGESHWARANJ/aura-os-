import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import studentApi from "../../api/services/studentApi";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import MetricCard from "../../components/common/MetricCard";
import ProgressBar from "../../components/common/ProgressBar";
import Badge, { RiskBadge } from "../../components/common/Badge";
import Button from "../../components/common/Button";

export default function StudentDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await studentApi.getOverview();
      const raw = res?.data || res || {};

      setOverview({
        name: user?.name || "Balasubramaniam",
        rollNumber: user?.rollNumber || "22AI012",
        department: "Artificial Intelligence & Data Science",
        semester: 6,
        cgpa: raw.cgpa || 8.84,
        attendance: raw.attendance || 86.5,
        riskIndex: 14.2,
        riskLevel: raw.attendance < 75 ? "Medium" : "Low",
        pendingTasks: raw.pendingAssignments || 3,
        activeProjects: raw.completedProjects || 1,
        nextClass: {
          subject: "Deep Learning & Neural Networks",
          room: "LH-302",
          time: "10:30 AM",
          faculty: "Dr. K. Raghavan",
        },
        riskBreakdown: {
          marksComponent: 88,
          attendanceComponent: raw.attendance || 86.5,
          assignmentComponent: 92,
          quizComponent: 85,
        },
      });
    } catch (err) {
      // Fallback data if offline
      setOverview({
        name: user?.name || "Balasubramaniam",
        rollNumber: user?.rollNumber || "22AI012",
        department: "Artificial Intelligence & Data Science",
        semester: 6,
        cgpa: 8.84,
        attendance: 86.5,
        riskIndex: 14.2,
        riskLevel: "Low",
        pendingTasks: 3,
        activeProjects: 1,
        nextClass: {
          subject: "Deep Learning & Neural Networks",
          room: "LH-302",
          time: "10:30 AM",
          faculty: "Dr. K. Raghavan",
        },
        riskBreakdown: {
          marksComponent: 88,
          attendanceComponent: 86.5,
          assignmentComponent: 92,
          quizComponent: 85,
        },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={styles.container}>
      <Header
        title="Student Portal"
        subtitle={`${overview?.department || "AI & Data Science"} • Sem ${overview?.semester || 6}`}
        role="STUDENT"
        showNotification
        notificationCount={2}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryLight}
          />
        }
      >
        {/* User Hero Banner */}
        <LinearGradient
          colors={colors.gradientHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroTextCol}>
              <Text style={styles.greetingText}>{getGreeting()} 👋</Text>
              <Text style={styles.userName}>{overview?.name || user?.name || "Student"}</Text>
              <Text style={styles.userRoll}>Roll No: {overview?.rollNumber || "22AI012"}</Text>
            </View>
            <View style={styles.avatarRing}>
              <Ionicons name="person" size={28} color={colors.primaryLight} />
            </View>
          </View>
        </LinearGradient>

        {/* Holographic AI Risk Monitor Card */}
        <Card
          style={styles.riskCard}
          glowColor={
            overview?.riskLevel === "High"
              ? colors.riskHigh
              : overview?.riskLevel === "Medium"
              ? colors.riskMedium
              : colors.riskLow
          }
        >
          <View style={styles.riskHeader}>
            <View style={styles.riskTitleRow}>
              <Ionicons name="sparkles" size={18} color={colors.primaryLight} />
              <Text style={styles.riskTitle}>AURA AI Early Warning Risk Index</Text>
            </View>
            <RiskBadge
              level={overview?.riskLevel || "Low"}
              score={overview?.riskIndex || 14.2}
            />
          </View>

          <Text style={styles.riskExplanation}>
            Calculated via weighted academic score: $S = w_1 M + w_2 A + w_3 AS + w_4 Q$
          </Text>

          {/* Metric Bar Row */}
          <View style={styles.riskMetricsRow}>
            <View style={styles.riskMiniItem}>
              <Text style={styles.riskMiniVal}>88%</Text>
              <Text style={styles.riskMiniLabel}>Marks (M)</Text>
            </View>
            <View style={styles.riskMiniItem}>
              <Text style={styles.riskMiniVal}>{overview?.attendance || 86.5}%</Text>
              <Text style={styles.riskMiniLabel}>Attendance (A)</Text>
            </View>
            <View style={styles.riskMiniItem}>
              <Text style={styles.riskMiniVal}>92%</Text>
              <Text style={styles.riskMiniLabel}>Tasks (AS)</Text>
            </View>
            <View style={styles.riskMiniItem}>
              <Text style={styles.riskMiniVal}>85%</Text>
              <Text style={styles.riskMiniLabel}>Quizzes (Q)</Text>
            </View>
          </View>

          <ProgressBar
            progress={100 - (overview?.riskIndex || 14.2)}
            height={6}
            style={{ marginTop: 12 }}
          />
        </Card>

        {/* 2x2 Gradient KPI Grid */}
        <View style={styles.kpiGrid}>
          <MetricCard
            title="Current CGPA"
            value={overview?.cgpa || "8.84"}
            icon="school-outline"
            gradient={colors.gradientPrimary}
            trend="+0.14"
            trendPositive={true}
            onPress={() => navigation.navigate("Academics")}
          />
          <MetricCard
            title="Attendance"
            value={overview?.attendance || "86.5"}
            unit="%"
            icon="calendar-outline"
            gradient={colors.gradientCyan}
            trend="Safe >75%"
            trendPositive={true}
            onPress={() => navigation.navigate("Attendance")}
          />
        </View>

        <View style={styles.kpiGrid}>
          <MetricCard
            title="Pending Tasks"
            value={overview?.pendingTasks || "3"}
            icon="document-text-outline"
            gradient={colors.gradientAmber}
            subtitle="1 Due Tomorrow"
            onPress={() => navigation.navigate("AssignmentsTab")}
          />
          <MetricCard
            title="Active Capstone"
            value={overview?.activeProjects || "1"}
            icon="rocket-outline"
            gradient={colors.gradientViolet}
            subtitle="Phase 2 In Review"
            onPress={() => navigation.navigate("Projects")}
          />
        </View>

        {/* Next Class Timeline Card */}
        <Card style={styles.scheduleCard} glowColor={colors.accent}>
          <View style={styles.scheduleHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="time-outline" size={16} color={colors.accentLight} />
              <Text style={styles.scheduleTitle}>Next Scheduled Lecture</Text>
            </View>
            <Badge label="IN 45 MIN" variant="info" size="xs" />
          </View>

          <View style={styles.classDetailsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subjectName}>
                {overview?.nextClass?.subject || "Deep Learning & Neural Networks"}
              </Text>
              <Text style={styles.facultyName}>
                {overview?.nextClass?.faculty || "Dr. K. Raghavan"} • {overview?.nextClass?.room || "LH-302"}
              </Text>
            </View>
            <View style={styles.timePill}>
              <Text style={styles.timeText}>{overview?.nextClass?.time || "10:30 AM"}</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions Bar */}
        <View style={styles.actionsRow}>
          <Button
            title="AI Study Planner"
            variant="primary"
            icon="calendar"
            size="sm"
            onPress={() => navigation.navigate("StudyPlanner")}
            style={{ flex: 1 }}
          />
          <Button
            title="Ask AI Tutor"
            variant="secondary"
            icon="sparkles"
            size="sm"
            onPress={() => navigation.navigate("AITutorTab")}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTextCol: {
    flex: 1,
  },
  greetingText: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  userName: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    marginTop: 2,
  },
  userRoll: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    borderWidth: 2,
    borderColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  riskCard: {
    padding: 16,
    marginBottom: 14,
  },
  riskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  riskTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  riskTitle: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  riskExplanation: {
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 12,
  },
  riskMetricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    padding: 10,
  },
  riskMiniItem: {
    alignItems: "center",
  },
  riskMiniVal: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  riskMiniLabel: {
    color: colors.textDark,
    fontSize: 9,
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  scheduleCard: {
    padding: 16,
    marginBottom: 14,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scheduleTitle: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  classDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subjectName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  facultyName: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 3,
  },
  timePill: {
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.35)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeText: {
    color: colors.accentLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
});
