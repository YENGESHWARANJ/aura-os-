import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import ProgressBar from "../../components/common/ProgressBar";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const SUBJECT_ATTENDANCE = [
  {
    code: "CS601",
    name: "Distributed Systems & Cloud",
    attended: 46,
    total: 50,
    percentage: 92,
    faculty: "Prof. Nithya K",
  },
  {
    code: "CS602",
    name: "Deep Learning & NLP",
    attended: 39,
    total: 46,
    percentage: 85,
    faculty: "Dr. Suresh R",
  },
  {
    code: "CS603",
    name: "Software Architecture",
    attended: 32,
    total: 41,
    percentage: 78,
    faculty: "Prof. Ananth V",
  },
  {
    code: "CS604",
    name: "Cybersecurity Lab",
    attended: 28,
    total: 30,
    percentage: 93.3,
    faculty: "Dr. Meera P",
  },
];

const RECENT_ATTENDANCE_LOGS = [
  { date: "Aug 28, 2026", time: "09:00 AM", subject: "Distributed Systems", status: "Present" },
  { date: "Aug 28, 2026", time: "11:00 AM", subject: "Deep Learning", status: "Present" },
  { date: "Aug 27, 2026", time: "02:00 PM", subject: "Software Architecture", status: "Present" },
  { date: "Aug 26, 2026", time: "10:00 AM", subject: "Cybersecurity Lab", status: "Present" },
  { date: "Aug 25, 2026", time: "11:00 AM", subject: "Software Architecture", status: "Absent" },
];

export default function StudentAttendanceScreen({ navigation }) {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveDate, setLeaveDate] = useState("2026-08-30");

  const totalAttended = 145;
  const totalHeld = 167;
  const overallPercentage = ((totalAttended / totalHeld) * 100).toFixed(1);

  const handleApplyLeave = () => {
    if (!leaveReason.trim()) {
      Alert.alert("Error", "Please provide a reason for leave");
      return;
    }
    Alert.alert("Success", "Leave application submitted to your Faculty Mentor for review.");
    setShowLeaveModal(false);
    setLeaveReason("");
  };

  return (
    <View style={styles.container}>
      <Header
        title="Attendance Tracker"
        subtitle="Live Biometric & Session Logs"
        onBack={() => navigation.goBack()}
        rightIcon="calendar-outline"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overall Attendance Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>Overall Attendance</Text>
              <Text style={styles.summaryClasses}>
                {totalAttended} of {totalHeld} Classes Attended
              </Text>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentNumber}>{overallPercentage}%</Text>
            </View>
          </View>

          <ProgressBar
            progress={parseFloat(overallPercentage)}
            color={parseFloat(overallPercentage) >= 80 ? colors.success : colors.warning}
            height={10}
            style={{ marginVertical: 12 }}
          />

          <View style={styles.summaryFooter}>
            <View style={styles.statusIndicator}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.statusText}>Safe Above 75% Statutory Rule</Text>
            </View>

            <TouchableOpacity
              style={styles.leaveBtn}
              onPress={() => setShowLeaveModal(true)}
            >
              <Ionicons name="document-text-outline" size={14} color={colors.primaryLight} />
              <Text style={styles.leaveBtnText}>Apply Leave</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Subject Breakdown */}
        <Text style={styles.sectionTitle}>Course-wise Attendance Breakdown</Text>

        {SUBJECT_ATTENDANCE.map((sub) => {
          const isAtRisk = sub.percentage < 80;
          return (
            <Card key={sub.code} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Badge label={sub.code} size="sm" color={colors.primary} />
                    {isAtRisk && <Badge label="Borderline" size="sm" color={colors.warning} />}
                  </View>
                  <Text style={styles.subjectName}>{sub.name}</Text>
                  <Text style={styles.facultyName}>Faculty: {sub.faculty}</Text>
                </View>
                <View style={styles.subjectScore}>
                  <Text style={[styles.subPercent, { color: sub.percentage >= 85 ? colors.success : colors.warning }]}>
                    {sub.percentage}%
                  </Text>
                  <Text style={styles.subClasses}>
                    {sub.attended}/{sub.total} classes
                  </Text>
                </View>
              </View>

              <ProgressBar
                progress={sub.percentage}
                color={sub.percentage >= 85 ? colors.success : colors.warning}
                style={{ marginTop: 8 }}
              />
            </Card>
          );
        })}

        {/* Recent Attendance Session Logs */}
        <Text style={styles.sectionTitle}>Recent Session History</Text>
        <Card style={styles.logCard}>
          {RECENT_ATTENDANCE_LOGS.map((log, idx) => (
            <View
              key={idx}
              style={[
                styles.logItem,
                idx === RECENT_ATTENDANCE_LOGS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.logSubject}>{log.subject}</Text>
                <Text style={styles.logDate}>{log.date} • {log.time}</Text>
              </View>
              <Badge
                label={log.status}
                color={log.status === "Present" ? colors.success : colors.danger}
                size="sm"
                icon={log.status === "Present" ? "checkmark-circle" : "close-circle"}
              />
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Apply Leave Modal */}
      <Modal visible={showLeaveModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Leave Exemption</Text>
              <TouchableOpacity onPress={() => setShowLeaveModal(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Input
              label="Leave Date"
              value={leaveDate}
              onChangeText={setLeaveDate}
              placeholder="YYYY-MM-DD"
              icon="calendar-outline"
            />

            <Input
              label="Reason for Absence"
              value={leaveReason}
              onChangeText={setLeaveReason}
              placeholder="e.g. Medical emergency / Hackathon participation"
              multiline
              numberOfLines={3}
              icon="document-outline"
            />

            <Button
              title="Submit Leave Request"
              onPress={handleApplyLeave}
              icon="send-outline"
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
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
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  summaryClasses: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  percentBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  percentNumber: {
    color: colors.primaryLight,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
  },
  summaryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  leaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${colors.primary}44`,
  },
  leaveBtnText: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
  subjectCard: {
    padding: 14,
    marginBottom: 12,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  subjectName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: 4,
  },
  facultyName: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
  subjectScore: {
    alignItems: "flex-end",
  },
  subPercent: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
  },
  subClasses: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
  logCard: {
    padding: 14,
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  logSubject: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  logDate: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});
