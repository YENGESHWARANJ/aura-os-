import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import ProgressBar from "../../components/common/ProgressBar";
import MetricCard from "../../components/common/MetricCard";

const SEMESTERS = ["Sem 6 (Current)", "Sem 5", "Sem 4", "Sem 3", "Sem 2", "Sem 1"];

const CURRENT_SEMESTER_COURSES = [
  {
    code: "CS601",
    name: "Distributed Systems & Cloud",
    credits: 4,
    internal1: 24,
    internal2: 23,
    model: 46,
    assignment: 10,
    totalInternal: 47, // out of 50
    targetGrade: "O",
    status: "On Track",
  },
  {
    code: "CS602",
    name: "Deep Learning & NLP",
    credits: 4,
    internal1: 22,
    internal2: 25,
    model: 48,
    assignment: 10,
    totalInternal: 48,
    targetGrade: "O",
    status: "On Track",
  },
  {
    code: "CS603",
    name: "Software Architecture & Design",
    credits: 3,
    internal1: 20,
    internal2: 19,
    model: 38,
    assignment: 9,
    totalInternal: 39,
    targetGrade: "A+",
    status: "Good",
  },
  {
    code: "CS604",
    name: "Cybersecurity & Blockchain",
    credits: 3,
    internal1: 18,
    internal2: 20,
    model: 42,
    assignment: 10,
    totalInternal: 41,
    targetGrade: "A+",
    status: "Good",
  },
];

export default function StudentAcademicsScreen({ navigation }) {
  const [selectedSem, setSelectedSem] = useState("Sem 6 (Current)");

  return (
    <View style={styles.container}>
      <Header
        title="Academic Performance"
        subtitle="Credits, Internal Marks & Grades"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* GPA Summary Cards */}
        <View style={styles.metricRow}>
          <MetricCard
            title="Cumulative GPA"
            value="8.64"
            subtitle="Dean's List"
            icon="ribbon"
            color={colors.primary}
          />
          <MetricCard
            title="Credits Earned"
            value="134 / 160"
            subtitle="83.7% Completed"
            icon="trophy"
            color={colors.success}
          />
        </View>

        {/* Semester Selection Horizontal Chips */}
        <Text style={styles.sectionLabel}>Select Semester</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.semChips}
        >
          {SEMESTERS.map((sem) => (
            <TouchableOpacity
              key={sem}
              style={[
                styles.semChip,
                selectedSem === sem && styles.semChipActive,
              ]}
              onPress={() => setSelectedSem(sem)}
            >
              <Text
                style={[
                  styles.semChipText,
                  selectedSem === sem && styles.semChipTextActive,
                ]}
              >
                {sem}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Current Semester Courses & Marks Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Course Evaluation & Internals</Text>
          <Badge label="4 Courses • 14 Credits" size="sm" color={colors.primary} />
        </View>

        {CURRENT_SEMESTER_COURSES.map((course) => (
          <Card key={course.code} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <View style={styles.courseTitleWrap}>
                <Badge label={course.code} size="sm" color={colors.primary} />
                <Text style={styles.courseName}>{course.name}</Text>
              </View>
              <View style={styles.creditsBadge}>
                <Text style={styles.creditsText}>{course.credits} Credits</Text>
              </View>
            </View>

            {/* Internal Marks Grid */}
            <View style={styles.marksGrid}>
              <View style={styles.markItem}>
                <Text style={styles.markLabel}>Internal 1</Text>
                <Text style={styles.markValue}>{course.internal1}/25</Text>
              </View>

              <View style={styles.markItem}>
                <Text style={styles.markLabel}>Internal 2</Text>
                <Text style={styles.markValue}>{course.internal2}/25</Text>
              </View>

              <View style={styles.markItem}>
                <Text style={styles.markLabel}>Model Exam</Text>
                <Text style={styles.markValue}>{course.model}/50</Text>
              </View>

              <View style={styles.markItem}>
                <Text style={styles.markLabel}>Assignment</Text>
                <Text style={styles.markValue}>{course.assignment}/10</Text>
              </View>
            </View>

            <ProgressBar
              progress={(course.totalInternal / 50) * 100}
              label={`Total Internal: ${course.totalInternal} / 50`}
              showLabel
              color={course.totalInternal >= 40 ? colors.success : colors.warning}
              style={{ marginTop: 10 }}
            />
          </Card>
        ))}

        {/* Academic Milestones */}
        <Card style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <Ionicons name="sparkles" size={18} color={colors.secondaryLight} />
            <Text style={styles.milestoneTitle}>Graduation Readiness</Text>
          </View>
          <Text style={styles.milestoneDesc}>
            You require 26 more credits and 1 Capstone Project submission to be eligible for Degree conferral.
          </Text>
          <ProgressBar
            progress={83.7}
            label="Degree Progress"
            showLabel
            color={colors.secondary}
          />
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
    marginBottom: 16,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  semChips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  semChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  semChipActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}22`,
  },
  semChipText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  semChipTextActive: {
    color: colors.primaryLight,
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
  courseCard: {
    padding: 14,
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  courseTitleWrap: {
    flex: 1,
    gap: 4,
    paddingRight: 10,
  },
  courseName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  creditsBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  creditsText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.weights.semibold,
  },
  marksGrid: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  markItem: {
    flex: 1,
    alignItems: "center",
  },
  markLabel: {
    color: colors.textDark,
    fontSize: 10,
    marginBottom: 2,
  },
  markValue: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  milestoneCard: {
    padding: 16,
    marginTop: 6,
    backgroundColor: `${colors.secondary}10`,
    borderColor: `${colors.secondary}44`,
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  milestoneTitle: {
    color: colors.secondaryLight,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  milestoneDesc: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginBottom: 10,
  },
});
