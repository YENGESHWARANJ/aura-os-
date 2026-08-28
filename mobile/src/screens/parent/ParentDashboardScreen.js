import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import MetricCard from "../../components/common/MetricCard";
import { RiskBadge, Badge } from "../../components/common/Badge";
import ProgressBar from "../../components/common/ProgressBar";
import Button from "../../components/common/Button";

export default function ParentDashboardScreen({ navigation }) {
  const { user } = useAuth();

  const child = {
    name: "Alex Johnson",
    roll: "21CS101",
    department: "Computer Science & Engineering",
    semester: "Semester 6",
    cgpa: "8.64",
    attendance: "88.0%",
    riskLevel: "Low",
    mentor: "Dr. Suresh R",
    mentorContact: "+91 98401 23456",
  };

  const recentGrades = [
    { subject: "Distributed Systems", marks: "24/25", type: "Internal 1", grade: "A+" },
    { subject: "Deep Learning & NLP", marks: "22/25", type: "Internal 1", grade: "A" },
    { subject: "Cloud Computing", marks: "19/25", type: "Internal 1", grade: "B+" },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={user?.name || "Robert Johnson"}
        subtitle="Parent Portal • Student: Alex Johnson"
        role="Parent"
        rightIcon="notifications-outline"
        onRightPress={() => navigation.navigate("Notifications")}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Child Profile Card */}
        <Card style={styles.childCard} glowColor={`${colors.parent}44`}>
          <View style={styles.childHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="school" size={22} color={colors.parent} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childRoll}>{child.roll} • {child.semester}</Text>
              <Text style={styles.childDept}>{child.department}</Text>
            </View>
            <RiskBadge level={child.riskLevel} />
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Attendance</Text>
              <Text style={[styles.metricVal, { color: colors.success }]}>{child.attendance}</Text>
              <Text style={styles.metricSub}>Statutory rule met</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Cumulative GPA</Text>
              <Text style={[styles.metricVal, { color: colors.primaryLight }]}>{child.cgpa}</Text>
              <Text style={styles.metricSub}>Dean's List</Text>
            </View>
          </View>

          <ProgressBar
            progress={88}
            label="Semester Class Attendance"
            showLabel
            color={colors.success}
            style={{ marginTop: 14 }}
          />
        </Card>

        {/* Mentor Contact Box */}
        <Card style={styles.mentorCard}>
          <View style={styles.mentorHeader}>
            <Ionicons name="person-circle" size={24} color={colors.secondaryLight} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.mentorTitle}>Assigned Faculty Mentor</Text>
              <Text style={styles.mentorName}>{child.mentor}</Text>
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Alert.alert("Call Mentor", `Connecting to ${child.mentor} at ${child.mentorContact}`)}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.callBtnText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Exam Marks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Examination Marks</Text>
          <Badge label="Published" size="sm" color={colors.success} />
        </View>

        {recentGrades.map((g, idx) => (
          <Card key={idx} style={styles.gradeCard}>
            <View style={styles.gradeRow}>
              <View>
                <Text style={styles.gradeSubject}>{g.subject}</Text>
                <Text style={styles.gradeType}>{g.type}</Text>
              </View>
              <View style={styles.gradeScoreWrap}>
                <Text style={styles.gradeMarks}>{g.marks}</Text>
                <Badge label={g.grade} size="sm" color={colors.primary} />
              </View>
            </View>
          </Card>
        ))}

        {/* Quick Navigation to Attendance Log */}
        <Button
          title="View Day-by-Day Attendance History"
          variant="outline"
          icon="calendar-outline"
          onPress={() => navigation.navigate("ParentAttendance")}
          style={{ marginTop: 6 }}
        />
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
    paddingBottom: 32,
  },
  childCard: {
    padding: 16,
    backgroundColor: colors.surfaceCard,
    marginBottom: 14,
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${colors.parent}22`,
    borderWidth: 1,
    borderColor: `${colors.parent}55`,
    alignItems: "center",
    justifyContent: "center",
  },
  childName: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  childRoll: {
    color: colors.parent,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  childDept: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 1,
  },
  metricsRow: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingVertical: 12,
    marginVertical: 4,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    color: colors.textDark,
    fontSize: 10,
    marginBottom: 2,
  },
  metricVal: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
  },
  metricSub: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.surfaceBorder,
  },
  mentorCard: {
    padding: 14,
    marginBottom: 14,
  },
  mentorHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  mentorTitle: {
    color: colors.textDark,
    fontSize: 10,
    textTransform: "uppercase",
  },
  mentorName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.parent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  callBtnText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  gradeCard: {
    padding: 12,
    marginBottom: 10,
  },
  gradeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gradeSubject: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  gradeType: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
  gradeScoreWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gradeMarks: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});
