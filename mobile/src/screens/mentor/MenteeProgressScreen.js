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
import { RiskBadge, Badge } from "../../components/common/Badge";
import ProgressBar from "../../components/common/ProgressBar";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function MenteeProgressScreen({ route, navigation }) {
  const student = route.params?.student || {
    id: "m-1",
    roll: "21CS103",
    name: "Deepak Kumar",
    risk: "High",
    gpa: "6.20",
    attendance: "64%",
    dept: "CSE - Sec A",
  };

  const [notes, setNotes] = useState([
    {
      id: "n-1",
      date: "Aug 15, 2026",
      mentor: "Dr. Suresh R",
      note: "Met with student regarding low attendance (64%). Student cited health issues earlier in semester. Advised to submit medical certificates and attend remedial classes in Distributed Systems.",
      actionItem: "Improve attendance to 75% before next review.",
    },
    {
      id: "n-2",
      date: "Jul 22, 2026",
      mentor: "Dr. Suresh R",
      note: "Semester 5 review meeting. Student showed good progress in practicals but struggles with theoretical algorithms.",
      actionItem: "Assigned peer tutor Alex Johnson for DSA coaching.",
    },
  ]);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newActionItem, setNewActionItem] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) {
      Alert.alert("Error", "Please enter session remarks");
      return;
    }

    const noteObj = {
      id: `n-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      mentor: "Dr. Suresh R",
      note: newNote.trim(),
      actionItem: newActionItem.trim() || "Regular monitoring",
    };

    setNotes([noteObj, ...notes]);
    Alert.alert("Success", "Mentoring session remarks recorded in student academic log.");
    setShowNoteModal(false);
    setNewNote("");
    setNewActionItem("");
  };

  return (
    <View style={styles.container}>
      <Header
        title={student.name}
        subtitle={`${student.roll} • ${student.dept}`}
        onBack={() => navigation.goBack()}
        role="Mentee Detail"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Summary Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentRoll}>{student.roll} • B.E Computer Science</Text>
            </View>
            <RiskBadge level={student.risk} />
          </View>

          {/* Academic Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>CGPA</Text>
              <Text style={styles.metricVal}>{student.gpa}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Attendance</Text>
              <Text
                style={[
                  styles.metricVal,
                  {
                    color:
                      parseFloat(student.attendance) >= 75
                        ? colors.success
                        : colors.danger,
                  },
                ]}
              >
                {student.attendance}
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Backlogs</Text>
              <Text style={[styles.metricVal, { color: colors.warning }]}>0</Text>
            </View>
          </View>

          <ProgressBar
            progress={parseFloat(student.attendance)}
            label={`Attendance Goal (Min 75% required)`}
            showLabel
            color={parseFloat(student.attendance) >= 75 ? colors.success : colors.danger}
            style={{ marginTop: 12 }}
          />

          <View style={styles.actionRow}>
            <Button
              title="Add Session Remarks"
              size="sm"
              icon="create-outline"
              onPress={() => setShowNoteModal(true)}
              style={{ flex: 1 }}
            />
            <Button
              title="Alert Parents"
              size="sm"
              variant="outline"
              icon="notifications-outline"
              onPress={() =>
                Alert.alert(
                  "Alert Sent",
                  `Official academic review summary sent to parent of ${student.name}.`
                )
              }
              style={{ flex: 1 }}
            />
          </View>
        </Card>

        {/* Mentoring Remarks History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mentoring Session Notes ({notes.length})</Text>
          <TouchableOpacity onPress={() => setShowNoteModal(true)}>
            <Ionicons name="add-circle" size={20} color={colors.secondaryLight} />
          </TouchableOpacity>
        </View>

        {notes.map((item) => (
          <Card key={item.id} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Badge label={item.date} size="sm" color={colors.secondary} />
              <Text style={styles.noteMentor}>{item.mentor}</Text>
            </View>

            <Text style={styles.noteBody}>{item.note}</Text>

            {item.actionItem && (
              <View style={styles.actionItemBox}>
                <Ionicons name="flag-outline" size={14} color={colors.primaryLight} />
                <Text style={styles.actionItemText}>Action: {item.actionItem}</Text>
              </View>
            )}
          </Card>
        ))}
      </ScrollView>

      {/* Add Note Modal */}
      <Modal visible={showNoteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Mentoring Remarks</Text>
              <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Input
              label="Session Remarks & Guidance"
              value={newNote}
              onChangeText={setNewNote}
              placeholder="e.g. Student advised on improving attendance & weekly revision..."
              multiline
              numberOfLines={4}
              icon="document-text-outline"
            />

            <Input
              label="Action Item / Target Goal"
              value={newActionItem}
              onChangeText={setNewActionItem}
              placeholder="e.g. Score 20+ in Internal 2"
              icon="flag-outline"
            />

            <Button
              title="Save Mentoring Log"
              onPress={handleAddNote}
              icon="save-outline"
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
  profileCard: {
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: `${colors.secondary}22`,
    borderWidth: 1,
    borderColor: `${colors.secondary}55`,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.secondaryLight,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  studentName: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  studentRoll: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingVertical: 10,
    marginVertical: 6,
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
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
  },
  metricDivider: {
    width: 1,
    backgroundColor: colors.surfaceBorder,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
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
  noteCard: {
    padding: 14,
    marginBottom: 10,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteMentor: {
    color: colors.textDark,
    fontSize: 10,
  },
  noteBody: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginBottom: 8,
  },
  actionItemBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    borderRadius: 8,
    padding: 8,
    gap: 6,
  },
  actionItemText: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: typography.weights.semibold,
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
