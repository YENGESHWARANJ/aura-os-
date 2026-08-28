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
import { RiskBadge, Badge } from "../../components/common/Badge";
import Button from "../../components/common/Button";

const RISK_STUDENTS = [
  {
    id: "rs-1",
    roll: "21CS103",
    name: "Deepak Kumar",
    riskLevel: "High",
    riskScore: 72.4,
    attendance: "64%",
    attendanceGap: "11% below statutory rule (75%)",
    weakSubject: "Distributed Systems (Internal: 11/25)",
    mentor: "Dr. Suresh R",
    alertSent: false,
  },
  {
    id: "rs-2",
    roll: "21CS108",
    name: "Rahul Varma",
    riskLevel: "High",
    riskScore: 68.0,
    attendance: "61%",
    attendanceGap: "14% below statutory rule (75%)",
    weakSubject: "Software Architecture (Internal: 09/25)",
    mentor: "Dr. Suresh R",
    alertSent: true,
  },
  {
    id: "rs-3",
    roll: "21CS106",
    name: "Manoj Sundar",
    riskLevel: "Medium",
    riskScore: 44.5,
    attendance: "72%",
    attendanceGap: "3% below statutory rule (75%)",
    weakSubject: "Cloud Computing Lab (Assignment missing)",
    mentor: "Prof. Ananth V",
    alertSent: false,
  },
];

export default function FacultyRiskStudentsScreen({ navigation }) {
  const [students, setStudents] = useState(RISK_STUDENTS);

  const handleSendAlert = (id, name) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, alertSent: true } : s))
    );
    Alert.alert(
      "Warning Dispatched",
      `Official low attendance & academic warning notification sent to ${name} and Parent portal.`
    );
  };

  const handleRemedialClass = (name) => {
    Alert.alert("Remedial Session Scheduled", `Invited ${name} to Wednesday 4:00 PM Special Remedial Tutoring.`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="At-Risk Early Warning"
        subtitle="AI Detected Academic Interventions"
        onBack={() => navigation.goBack()}
        role="Faculty"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Risk Algorithm Formula Banner */}
        <Card style={styles.formulaCard}>
          <View style={styles.formulaHeader}>
            <Ionicons name="calculator" size={16} color={colors.warning} />
            <Text style={styles.formulaTitle}>AURA Risk Formula (RI)</Text>
          </View>
          <Text style={styles.formulaEquation}>
            RI = (100 - S) + max(0, 75 - A) × 1.5
          </Text>
          <Text style={styles.formulaExplanation}>
            Students flagged here have low composite academic score (S) combined with attendance penalties below 75%.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Flagged Students ({students.length})</Text>

        {students.map((student) => (
          <Card key={student.id} style={styles.studentCard} glowColor={`${colors.danger}33`}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.rollText}>{student.roll}</Text>
                <Text style={styles.nameText}>{student.name}</Text>
                <Text style={styles.mentorText}>Mentor: {student.mentor}</Text>
              </View>
              <RiskBadge level={student.riskLevel} score={student.riskScore} />
            </View>

            {/* Risk Factor Badges */}
            <View style={styles.factorBox}>
              <View style={styles.factorItem}>
                <Ionicons name="alert-circle" size={14} color={colors.danger} />
                <Text style={styles.factorText}>Attendance: {student.attendance} ({student.attendanceGap})</Text>
              </View>
              <View style={styles.factorItem}>
                <Ionicons name="trending-down" size={14} color={colors.warning} />
                <Text style={styles.factorText}>Deficit: {student.weakSubject}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.alertBtn,
                  student.alertSent && styles.alertBtnDisabled,
                ]}
                onPress={() => handleSendAlert(student.id, student.name)}
                disabled={student.alertSent}
              >
                <Ionicons
                  name={student.alertSent ? "checkmark-done" : "notifications"}
                  size={14}
                  color={student.alertSent ? colors.success : colors.danger}
                />
                <Text style={[styles.alertBtnText, student.alertSent && { color: colors.success }]}>
                  {student.alertSent ? "Alert Sent" : "Alert Parent & Student"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.remedialBtn}
                onPress={() => handleRemedialClass(student.name)}
              >
                <Ionicons name="calendar-outline" size={14} color={colors.primaryLight} />
                <Text style={styles.remedialBtnText}>Remedial Class</Text>
              </TouchableOpacity>
            </View>
          </Card>
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
  formulaCard: {
    padding: 14,
    backgroundColor: `${colors.warning}10`,
    borderColor: `${colors.warning}44`,
    marginBottom: 16,
  },
  formulaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  formulaTitle: {
    color: colors.warning,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
  },
  formulaEquation: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    marginVertical: 4,
  },
  formulaExplanation: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
  studentCard: {
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  rollText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  nameText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  mentorText: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
  factorBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 10,
    gap: 6,
    marginBottom: 14,
  },
  factorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  factorText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  alertBtn: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerGlow,
    borderColor: `${colors.danger}55`,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  alertBtnDisabled: {
    backgroundColor: colors.successGlow,
    borderColor: `${colors.success}55`,
  },
  alertBtnText: {
    color: colors.danger,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  remedialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceLight,
    borderColor: `${colors.primary}44`,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  remedialBtnText: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});
