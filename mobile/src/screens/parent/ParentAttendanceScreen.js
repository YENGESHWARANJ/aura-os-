import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import ProgressBar from "../../components/common/ProgressBar";

const DAILY_LOGS = [
  { date: "Aug 28, 2026", status: "Present", classesAttended: "4 / 4", subjects: "Distributed Systems, Machine Learning, Cloud Computing" },
  { date: "Aug 27, 2026", status: "Present", classesAttended: "3 / 3", subjects: "Software Architecture, Compiler Design" },
  { date: "Aug 26, 2026", status: "Present", classesAttended: "4 / 4", subjects: "Distributed Systems Lab, Deep Learning" },
  { date: "Aug 25, 2026", status: "Absent", classesAttended: "0 / 3", subjects: "Software Architecture, Cloud Lab (Medical Leave submitted)" },
  { date: "Aug 24, 2026", status: "Present", classesAttended: "4 / 4", subjects: "Full Day Sessions" },
];

export default function ParentAttendanceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header
        title="Attendance Records"
        subtitle="Alex Johnson (21CS101)"
        onBack={() => navigation.goBack()}
        role="Parent View"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Month Stat Summary */}
        <Card style={styles.monthCard}>
          <View style={styles.monthHeader}>
            <View>
              <Text style={styles.monthTitle}>August 2026 Attendance</Text>
              <Text style={styles.monthSub}>21 Days Held • 20 Days Present • 1 Leave</Text>
            </View>
            <Badge label="95.2% Rate" color={colors.success} />
          </View>

          <ProgressBar
            progress={95.2}
            color={colors.success}
            style={{ marginTop: 10 }}
          />
        </Card>

        {/* Daily Attendance History */}
        <Text style={styles.sectionTitle}>Daily Attendance Logs</Text>

        {DAILY_LOGS.map((item, idx) => {
          const isPresent = item.status === "Present";

          return (
            <Card key={idx} style={styles.logCard}>
              <View style={styles.logRow}>
                <View style={styles.dateCol}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.classesText}>{item.classesAttended} Sessions</Text>
                </View>

                <Badge
                  label={item.status}
                  size="sm"
                  color={isPresent ? colors.success : colors.danger}
                  icon={isPresent ? "checkmark-circle" : "close-circle"}
                />
              </View>

              <Text style={styles.subjectsText}>{item.subjects}</Text>
            </Card>
          );
        })}
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
  monthCard: {
    padding: 16,
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  monthSub: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
  logCard: {
    padding: 14,
    marginBottom: 10,
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dateCol: {
    flex: 1,
  },
  dateText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  classesText: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 1,
  },
  subjectsText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 16,
  },
});
