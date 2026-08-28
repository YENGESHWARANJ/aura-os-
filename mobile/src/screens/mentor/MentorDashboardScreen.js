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
import mentorApi from "../../api/services/mentorApi";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import MetricCard from "../../components/common/MetricCard";
import { RiskBadge, Badge } from "../../components/common/Badge";
import Button from "../../components/common/Button";

export default function MentorDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const stats = {
    totalMentees: 22,
    highRisk: 3,
    mediumRisk: 5,
    lowRisk: 14,
    upcomingMeetings: 2,
  };

  const priorityMentees = [
    { id: "m-1", roll: "21CS103", name: "Deepak Kumar", risk: "High", gpa: "6.2", attendance: "64%", remark: "Low attendance in Distributed Systems" },
    { id: "m-2", roll: "21CS108", name: "Rahul Varma", risk: "High", gpa: "5.8", attendance: "61%", remark: "Missed Internal 2 examination" },
    { id: "m-3", roll: "21CS106", name: "Manoj Sundar", risk: "Medium", gpa: "7.1", attendance: "72%", remark: "Borderline attendance; requires motivation" },
    { id: "m-4", roll: "21CS101", name: "Alex Johnson", risk: "Low", gpa: "8.64", attendance: "88%", remark: "Excellent performance, Capstone lead" },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={user?.name || "Dr. Suresh R"}
        subtitle="Faculty Mentor • 22 Assigned Mentees"
        role="Mentor"
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
            tintColor={colors.secondary}
            colors={[colors.secondary]}
          />
        }
      >
        {/* Risk Distribution Overview */}
        <Card style={styles.riskDistCard} glowColor={`${colors.secondary}44`}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="pie-chart" size={18} color={colors.secondaryLight} />
              <Text style={styles.cardTitle}>Mentee Academic Health</Text>
            </View>
            <Badge label="22 Mentees" size="sm" color={colors.secondary} />
          </View>

          <View style={styles.riskBreakdown}>
            <View style={[styles.riskBox, { borderColor: colors.danger, backgroundColor: colors.dangerGlow }]}>
              <Text style={[styles.riskNum, { color: colors.danger }]}>{stats.highRisk}</Text>
              <Text style={styles.riskLabel}>High Risk</Text>
            </View>

            <View style={[styles.riskBox, { borderColor: colors.warning, backgroundColor: colors.warningGlow }]}>
              <Text style={[styles.riskNum, { color: colors.warning }]}>{stats.mediumRisk}</Text>
              <Text style={styles.riskLabel}>Medium Risk</Text>
            </View>

            <View style={[styles.riskBox, { borderColor: colors.success, backgroundColor: colors.successGlow }]}>
              <Text style={[styles.riskNum, { color: colors.success }]}>{stats.lowRisk}</Text>
              <Text style={styles.riskLabel}>Low Risk</Text>
            </View>
          </View>
        </Card>

        {/* Quick Action Navigation Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("AssignedStudents")}
          >
            <Ionicons name="people" size={20} color={colors.secondaryLight} />
            <Text style={styles.actionTitle}>All Mentees</Text>
            <Text style={styles.actionSub}>22 Profiles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("MentorMeetings")}
          >
            <Ionicons name="calendar" size={20} color={colors.primaryLight} />
            <Text style={styles.actionTitle}>Meetings</Text>
            <Text style={styles.actionSub}>2 Scheduled</Text>
          </TouchableOpacity>
        </View>

        {/* Priority Mentees List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mentees Requiring Attention</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AssignedStudents")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {priorityMentees.map((mentee) => (
          <TouchableOpacity
            key={mentee.id}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("MenteeProgress", { student: mentee })}
          >
            <Card style={styles.menteeCard}>
              <View style={styles.menteeHeader}>
                <View>
                  <Text style={styles.menteeRoll}>{mentee.roll}</Text>
                  <Text style={styles.menteeName}>{mentee.name}</Text>
                </View>
                <RiskBadge level={mentee.risk} />
              </View>

              <Text style={styles.menteeRemark}>{mentee.remark}</Text>

              <View style={styles.menteeFooter}>
                <View style={styles.statPill}>
                  <Text style={styles.statPillLabel}>GPA: </Text>
                  <Text style={styles.statPillVal}>{mentee.gpa}</Text>
                </View>
                <View style={styles.statPill}>
                  <Text style={styles.statPillLabel}>Attendance: </Text>
                  <Text style={styles.statPillVal}>{mentee.attendance}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textDark} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
  riskDistCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  riskBreakdown: {
    flexDirection: "row",
    gap: 10,
  },
  riskBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 12,
  },
  riskNum: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
  },
  riskLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    fontWeight: typography.weights.semibold,
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
  actionTitle: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    marginTop: 8,
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
  viewAllText: {
    color: colors.secondaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  menteeCard: {
    padding: 14,
    marginBottom: 10,
  },
  menteeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  menteeRoll: {
    color: colors.secondaryLight,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  menteeName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  menteeRemark: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginVertical: 8,
  },
  menteeFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: 8,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
  },
  statPillLabel: {
    color: colors.textDark,
    fontSize: 10,
  },
  statPillVal: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});
