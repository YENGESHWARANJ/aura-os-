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
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const INITIAL_ASSIGNMENTS = [
  {
    id: "asg-1",
    title: "Raft Consensus Algorithm Implementation",
    subject: "Distributed Systems",
    code: "CS601",
    dueDate: "Aug 30, 2026",
    daysLeft: 2,
    maxMarks: 50,
    status: "Pending",
    description: "Implement leader election and log replication module using Python/Node.js.",
  },
  {
    id: "asg-2",
    title: "Transformer Attention Visualization",
    subject: "Deep Learning",
    code: "CS602",
    dueDate: "Sep 02, 2026",
    daysLeft: 5,
    maxMarks: 50,
    status: "Pending",
    description: "Visualize multi-head self-attention heatmaps on BERT embeddings.",
  },
  {
    id: "asg-3",
    title: "Microservices Architecture Document",
    subject: "Software Architecture",
    code: "CS603",
    dueDate: "Aug 24, 2026",
    daysLeft: 0,
    maxMarks: 40,
    status: "Submitted",
    grade: "38/40",
    description: "C4 model diagrams for e-commerce microservices.",
  },
  {
    id: "asg-4",
    title: "Smart Contract Vulnerability Audit",
    subject: "Cybersecurity",
    code: "CS604",
    dueDate: "Aug 18, 2026",
    daysLeft: 0,
    maxMarks: 50,
    status: "Graded",
    grade: "48/50",
    feedback: "Excellent re-entrancy attack mitigation analysis.",
  },
];

const TABS = ["All", "Pending", "Submitted", "Graded"];

export default function StudentAssignmentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("All");
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [selectedAsg, setSelectedAsg] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");

  const filteredAssignments = assignments.filter((asg) => {
    if (activeTab === "All") return true;
    return asg.status === activeTab;
  });

  const handleOpenSubmit = (asg) => {
    setSelectedAsg(asg);
    setSubmissionLink("");
    setSubmissionNotes("");
  };

  const handleConfirmSubmit = () => {
    if (!submissionLink.trim()) {
      Alert.alert("Error", "Please provide a GitHub repository link or document URL.");
      return;
    }

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAsg.id
          ? { ...a, status: "Submitted", submissionLink, submissionNotes }
          : a
      )
    );

    Alert.alert("Success", "Assignment submitted successfully!");
    setSelectedAsg(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Assignments & Tasks"
        subtitle="Deadlines, Rubrics & Submissions"
        onBack={() => navigation.goBack()}
      />

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === tab && styles.tabBtnTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredAssignments.map((asg) => {
          const isPending = asg.status === "Pending";
          const isGraded = asg.status === "Graded";

          return (
            <Card key={asg.id} style={styles.asgCard}>
              <View style={styles.asgHeader}>
                <Badge label={asg.code} size="sm" color={colors.primary} />
                <Badge
                  label={asg.status}
                  size="sm"
                  color={
                    isPending
                      ? colors.warning
                      : isGraded
                      ? colors.success
                      : colors.info
                  }
                  icon={
                    isPending
                      ? "time-outline"
                      : isGraded
                      ? "ribbon-outline"
                      : "checkmark-done-outline"
                  }
                />
              </View>

              <Text style={styles.asgTitle}>{asg.title}</Text>
              <Text style={styles.asgSubject}>{asg.subject}</Text>
              <Text style={styles.asgDesc}>{asg.description}</Text>

              <View style={styles.asgFooter}>
                <View style={styles.dueRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.dueText}>
                    {isPending
                      ? `Due: ${asg.dueDate} (${asg.daysLeft}d left)`
                      : `Submitted: ${asg.dueDate}`}
                  </Text>
                </View>

                {asg.grade ? (
                  <View style={styles.gradeWrap}>
                    <Text style={styles.gradeLabel}>Score: </Text>
                    <Text style={styles.gradeScore}>{asg.grade}</Text>
                  </View>
                ) : (
                  <Text style={styles.maxMarks}>Max: {asg.maxMarks} pts</Text>
                )}
              </View>

              {asg.feedback && (
                <View style={styles.feedbackBox}>
                  <Ionicons name="chatbox-ellipses-outline" size={14} color={colors.success} />
                  <Text style={styles.feedbackText}>{asg.feedback}</Text>
                </View>
              )}

              {isPending && (
                <Button
                  title="Submit Solution"
                  size="sm"
                  icon="cloud-upload-outline"
                  onPress={() => handleOpenSubmit(asg)}
                  style={{ marginTop: 12 }}
                />
              )}
            </Card>
          );
        })}
      </ScrollView>

      {/* Submission Modal */}
      <Modal visible={!!selectedAsg} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Assignment</Text>
              <TouchableOpacity onPress={() => setSelectedAsg(null)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>{selectedAsg?.title}</Text>

            <Input
              label="GitHub / Drive Link"
              value={submissionLink}
              onChangeText={setSubmissionLink}
              placeholder="https://github.com/..."
              icon="link-outline"
            />

            <Input
              label="Submission Notes (Optional)"
              value={submissionNotes}
              onChangeText={setSubmissionNotes}
              placeholder="Comments or instructions for the instructor"
              multiline
              numberOfLines={3}
              icon="document-text-outline"
            />

            <Button
              title="Confirm Submission"
              onPress={handleConfirmSubmit}
              icon="checkmark-circle-outline"
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabBtnText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  tabBtnTextActive: {
    color: "#FFFFFF",
    fontWeight: typography.weights.bold,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  asgCard: {
    padding: 16,
    marginBottom: 14,
  },
  asgHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  asgTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  asgSubject: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    marginTop: 2,
    marginBottom: 6,
  },
  asgDesc: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginBottom: 12,
  },
  asgFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dueText: {
    color: colors.textDark,
    fontSize: typography.sizes.xs,
  },
  gradeWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  gradeLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  gradeScore: {
    color: colors.success,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  maxMarks: {
    color: colors.textDark,
    fontSize: typography.sizes.xs,
  },
  feedbackBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successGlow,
    borderColor: `${colors.success}44`,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  feedbackText: {
    color: colors.success,
    fontSize: typography.sizes.xs,
    flex: 1,
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
    marginBottom: 6,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  modalSub: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginBottom: 16,
  },
});
