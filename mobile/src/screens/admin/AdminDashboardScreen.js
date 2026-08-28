import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();

  const metrics = {
    totalStudents: 480,
    totalFaculty: 34,
    deptPassRate: "94.2%",
    activeAIAlerts: 18,
    modelAccuracy: "96.8%",
  };

  return (
    <View style={styles.container}>
      <Header
        title={user?.name || "Institution Admin"}
        subtitle="Department Head & System Analytics"
        role="Admin"
        rightIcon="notifications-outline"
        onRightPress={() => navigation.navigate("Notifications")}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* System KPIs */}
        <View style={styles.metricRow}>
          <MetricCard
            title="Total Enrolled"
            value={metrics.totalStudents.toString()}
            subtitle="Undergraduate CS"
            icon="school"
            color={colors.primary}
          />
          <MetricCard
            title="Faculty Strength"
            value={metrics.totalFaculty.toString()}
            subtitle="Teaching & Mentors"
            icon="people"
            color={colors.secondary}
          />
        </View>

        <View style={[styles.metricRow, { marginTop: -4 }]}>
          <MetricCard
            title="Dept Pass %"
            value={metrics.deptPassRate}
            subtitle="Sem 6 Benchmark"
            icon="trophy"
            color={colors.success}
          />
          <MetricCard
            title="AI Early Alerts"
            value={metrics.activeAIAlerts.toString()}
            subtitle="Under Remediation"
            icon="warning"
            color={colors.warning}
          />
        </View>

        {/* AI Random Forest Model Health */}
        <Card style={styles.aiHealthCard} glowColor={`${colors.primary}44`}>
          <View style={styles.aiHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="hardware-chip" size={18} color={colors.primaryLight} />
              <Text style={styles.aiTitle}>Random Forest ML Predictor</Text>
            </View>
            <Badge label="Online" size="sm" color={colors.success} />
          </View>

          <Text style={styles.aiDesc}>
            Ensemble Decision Trees (13-step algorithm) actively scoring student academic risk ($RI$) across Marks, Attendance, Assignments, and Quizzes.
          </Text>

          <ProgressBar
            progress={96.8}
            label="Prediction Accuracy (Validation Subset)"
            showLabel
            color={colors.primary}
            style={{ marginTop: 10 }}
          />
        </Card>

        {/* Quick Management Links */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Administrative Management</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("UserManagement")}
        >
          <Card style={styles.navCard}>
            <View style={styles.navRow}>
              <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}22` }]}>
                <Ionicons name="people" size={20} color={colors.primaryLight} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.navTitle}>User & Role Management</Text>
                <Text style={styles.navSub}>Manage Students, Faculty, Mentors, Parents</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDark} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Settings")}
        >
          <Card style={styles.navCard}>
            <View style={styles.navRow}>
              <View style={[styles.iconWrap, { backgroundColor: `${colors.secondary}22` }]}>
                <Ionicons name="settings" size={20} color={colors.secondaryLight} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.navTitle}>System Configuration</Text>
                <Text style={styles.navSub}>API Endpoints, Server Connectivity, Database</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDark} />
            </View>
          </Card>
        </TouchableOpacity>
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
  aiHealthCard: {
    padding: 16,
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  aiTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  aiDesc: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  navCard: {
    padding: 14,
    marginBottom: 10,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  navSub: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
