import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import facultyApi from "../../api/services/facultyApi";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import MetricCard from "../../components/common/MetricCard";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

export default function FacultyDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const stats = {
    totalStudents: 128,
    activeClasses: 3,
    avgAttendance: "86.4%",
    atRiskStudents: 6,
    pendingGrading: 14,
  };

  const schedule = [
    { time: "09:00 - 10:30 AM", course: "CS601: Distributed Systems", section: "CSE-A (62 Students)", room: "Hall A" },
    { time: "11:00 - 12:30 PM", course: "CS603: Software Architecture", section: "CSE-B (66 Students)", room: "Room 304" },
    { time: "02:00 - 04:00 PM", course: "CS601 Lab: Cloud Cluster Setup", section: "Batch 1", room: "Lab 2" },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={user?.name || "Prof. Nithya K"}
        subtitle="Department of Computer Science & Eng"
        role="Faculty"
        rightIcon="notifications-outline"
        onRightPress={() => navigation.navigate("Notifications")}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(false)}
            tintColor={colors.faculty}
            colors={[colors.faculty]}
          />
        }
      >
        {/* Quick KPI Cards */}
        <View style={styles.metricRow}>
          <MetricCard
            title="Assigned Students"
            value={stats.totalStudents.toString()}
            subtitle="Across 3 Sections"
            icon="people"
            color={colors.faculty}
          />
          <MetricCard
            title="Class Attendance"
            value={stats.avgAttendance}
            subtitle="Monthly Average"
            icon="calendar"
            color={colors.success}
          />
        </View>

        <View style={[styles.metricRow, { marginTop: -4 }]}>
          <MetricCard
            title="At-Risk Alerts"
            value={stats.atRiskStudents.toString()}
            subtitle="Require Remedial"
            icon="alert-circle"
            color={colors.danger}
          />
          <MetricCard
            title="Pending Grading"
            value={stats.pendingGrading.toString()}
            subtitle="Assignments"
            icon="document-text"
            color={colors.warning}
          />
        </View>

        {/* Quick Action Navigation Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("FacultyAttendance")}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: `${colors.faculty}22` }]}>
              <Ionicons name="checkbox" size={20} color={colors.faculty} />
            </View>
            <Text style={styles.actionTitle}>Mark Attendance</Text>
            <Text style={styles.actionSub}>Daily Session Log</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("FacultyRiskStudents")}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: `${colors.danger}22` }]}>
              <Ionicons name="warning" size={20} color={colors.danger} />
            </View>
            <Text style={styles.actionTitle}>At-Risk Students</Text>
            <Text style={styles.actionSub}>6 Flags Detected</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Teaching Schedule */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Lecture Schedule</Text>
          <Badge label="3 Lectures" size="sm" color={colors.faculty} />
        </View>

        <Card style={styles.scheduleCard}>
          {schedule.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.scheduleItem,
                idx === schedule.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.timeWrap}>
                <Ionicons name="time-outline" size={14} color={colors.faculty} />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleSubject}>{item.course}</Text>
                <Text style={styles.scheduleSection}>{item.section} • {item.room}</Text>
              </View>
            </View>
          ))}
        </Card>
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
  metricRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  actionGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 14,
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionTitle: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  actionSub: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
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
  scheduleCard: {
    padding: 14,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  timeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 130,
  },
  timeText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleSubject: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  scheduleSection: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
});
