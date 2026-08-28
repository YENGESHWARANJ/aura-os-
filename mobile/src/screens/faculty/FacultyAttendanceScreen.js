import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const INITIAL_ROSTER = [
  { id: "s-1", roll: "21CS101", name: "Alex Johnson", status: "P", overall: "88%" },
  { id: "s-2", roll: "21CS102", name: "Ananya Sharma", status: "P", overall: "94%" },
  { id: "s-3", roll: "21CS103", name: "Deepak Kumar", status: "A", overall: "68%" },
  { id: "s-4", roll: "21CS104", name: "Harish Venkat", status: "P", overall: "82%" },
  { id: "s-5", roll: "21CS105", name: "Kavitha Mohan", status: "P", overall: "91%" },
  { id: "s-6", roll: "21CS106", name: "Manoj Sundar", status: "L", overall: "72%" },
  { id: "s-7", roll: "21CS107", name: "Priya Rajan", status: "P", overall: "96%" },
  { id: "s-8", roll: "21CS108", name: "Rahul Varma", status: "A", overall: "64%" },
];

export default function FacultyAttendanceScreen({ navigation }) {
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [selectedCourse, setSelectedCourse] = useState("CS601: Distributed Systems");
  const [isSaved, setIsSaved] = useState(false);

  const toggleStatus = (id, newStatus) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setIsSaved(false);
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((s) => ({ ...s, status: "P" })));
    setIsSaved(false);
  };

  const handleSaveAttendance = () => {
    setIsSaved(true);
    const presentCount = roster.filter((s) => s.status === "P").length;
    Alert.alert(
      "Attendance Recorded",
      `Successfully logged attendance for ${roster.length} students. (${presentCount} Present, ${roster.length - presentCount} Absent/Late).`
    );
  };

  const presentCount = roster.filter((s) => s.status === "P").length;
  const absentCount = roster.filter((s) => s.status === "A").length;
  const lateCount = roster.filter((s) => s.status === "L").length;

  return (
    <View style={styles.container}>
      <Header
        title="Mark Attendance"
        subtitle="Live Roster Session Logger"
        onBack={() => navigation.goBack()}
        role="Faculty"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Class Selection & Quick Stats Card */}
        <Card style={styles.headerCard}>
          <View style={styles.courseHeader}>
            <Ionicons name="book" size={16} color={colors.faculty} />
            <Text style={styles.courseTitle}>{selectedCourse}</Text>
          </View>
          <Text style={styles.sessionDate}>Session: Aug 28, 2026 • 09:00 AM - 10:30 AM</Text>

          {/* Quick Stats Counter */}
          <View style={styles.statsBar}>
            <View style={[styles.statBox, { borderColor: colors.success }]}>
              <Text style={[styles.statNum, { color: colors.success }]}>{presentCount}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
            <View style={[styles.statBox, { borderColor: colors.danger }]}>
              <Text style={[styles.statNum, { color: colors.danger }]}>{absentCount}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
            <View style={[styles.statBox, { borderColor: colors.warning }]}>
              <Text style={[styles.statNum, { color: colors.warning }]}>{lateCount}</Text>
              <Text style={styles.statLabel}>Late</Text>
            </View>
          </View>

          <View style={styles.headerActionRow}>
            <TouchableOpacity style={styles.allPresentBtn} onPress={markAllPresent}>
              <Ionicons name="checkmark-done" size={14} color={colors.faculty} />
              <Text style={styles.allPresentText}>Mark All Present</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Student Roster List */}
        <Text style={styles.sectionTitle}>Student Roster ({roster.length})</Text>

        {roster.map((student) => (
          <Card key={student.id} style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentRoll}>{student.roll}</Text>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.overallText}>Cumulative: {student.overall}</Text>
            </View>

            {/* 3-State Toggle Pills */}
            <View style={styles.pillGroup}>
              <TouchableOpacity
                style={[
                  styles.statusPill,
                  student.status === "P" && styles.pillPresent,
                ]}
                onPress={() => toggleStatus(student.id, "P")}
              >
                <Text
                  style={[
                    styles.pillText,
                    student.status === "P" && styles.pillTextActive,
                  ]}
                >
                  P
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusPill,
                  student.status === "A" && styles.pillAbsent,
                ]}
                onPress={() => toggleStatus(student.id, "A")}
              >
                <Text
                  style={[
                    styles.pillText,
                    student.status === "A" && styles.pillTextActive,
                  ]}
                >
                  A
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusPill,
                  student.status === "L" && styles.pillLate,
                ]}
                onPress={() => toggleStatus(student.id, "L")}
              >
                <Text
                  style={[
                    styles.pillText,
                    student.status === "L" && styles.pillTextActive,
                  ]}
                >
                  L
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <Button
          title={isSaved ? "Attendance Saved ✓" : "Submit & Lock Attendance"}
          onPress={handleSaveAttendance}
          icon="save-outline"
          style={{ marginTop: 8, marginBottom: 20 }}
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
  headerCard: {
    padding: 16,
    marginBottom: 16,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  courseTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  sessionDate: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 4,
    marginBottom: 12,
  },
  statsBar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 8,
  },
  statNum: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
  },
  statLabel: {
    color: colors.textDark,
    fontSize: 9,
    marginTop: 2,
    textTransform: "uppercase",
  },
  headerActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  allPresentBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${colors.faculty}1A`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${colors.faculty}44`,
  },
  allPresentText: {
    color: colors.faculty,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentRoll: {
    color: colors.faculty,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  studentName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  overallText: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
  pillGroup: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 3,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statusPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pillPresent: {
    backgroundColor: colors.success,
  },
  pillAbsent: {
    backgroundColor: colors.danger,
  },
  pillLate: {
    backgroundColor: colors.warning,
  },
  pillText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
});
