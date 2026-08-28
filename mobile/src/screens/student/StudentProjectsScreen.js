import React, { useState, useEffect } from "react";
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
import Button from "../../components/common/Button";

export default function StudentProjectsScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        return { ...prev, minutes: prev.minutes > 0 ? prev.minutes - 1 : 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Capstone Projects"
        subtitle="Batch 2026 Submission Portal"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner with Countdown Timer */}
        <Card style={styles.bannerCard} glowColor={`${colors.primary}44`}>
          <View style={styles.bannerHeader}>
            <View style={styles.bannerBadge}>
              <Ionicons name="rocket-outline" size={14} color={colors.primaryLight} />
              <Text style={styles.bannerBadgeText}>BATCH 2026 • PHASE 2</Text>
            </View>
            <Badge label="Active Window" size="sm" color={colors.success} />
          </View>

          <Text style={styles.bannerTitle}>Submission Window Closes In</Text>

          {/* Countdown Clock Grid */}
          <View style={styles.timerGrid}>
            <View style={styles.timerBox}>
              <Text style={styles.timerNumber}>{timeLeft.days}</Text>
              <Text style={styles.timerLabel}>DAYS</Text>
            </View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerNumber}>{timeLeft.hours}</Text>
              <Text style={styles.timerLabel}>HRS</Text>
            </View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerNumber}>{timeLeft.minutes}</Text>
              <Text style={styles.timerLabel}>MIN</Text>
            </View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerNumber}>{timeLeft.seconds}</Text>
              <Text style={styles.timerLabel}>SEC</Text>
            </View>
          </View>
        </Card>

        {/* Selected Project Card */}
        <Text style={styles.sectionTitle}>My Capstone Project</Text>
        <Card style={styles.projectCard}>
          <View style={styles.projHeader}>
            <Text style={styles.projTitle}>
              AURA OS: Autonomous Academic Monitoring via Machine Learning
            </Text>
            <Badge label="Phase 2 of 4" size="sm" color={colors.secondary} />
          </View>

          <Text style={styles.projAbstract}>
            An enterprise multi-input academic risk predictor and personalized study recommendation platform using Random Forest ensembles.
          </Text>

          <ProgressBar
            progress={55}
            label="Overall Project Completion"
            showLabel
            color={colors.primary}
            style={{ marginVertical: 12 }}
          />

          {/* Team Members */}
          <Text style={styles.subSectionTitle}>Team Members</Text>
          <View style={styles.teamRow}>
            <View style={styles.memberChip}>
              <Ionicons name="person-circle" size={20} color={colors.primaryLight} />
              <View>
                <Text style={styles.memberName}>Alex Johnson (Lead)</Text>
                <Text style={styles.memberRole}>Frontend & ML</Text>
              </View>
            </View>

            <View style={styles.memberChip}>
              <Ionicons name="person-circle" size={20} color={colors.secondaryLight} />
              <View>
                <Text style={styles.memberName}>Kavitha M</Text>
                <Text style={styles.memberRole}>Backend & DB</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Milestone Milestones Checklist */}
        <Text style={styles.sectionTitle}>Project Milestones</Text>
        <Card style={styles.milestoneCard}>
          <View style={styles.milestoneItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.mName}>1. Problem Formulation & Synopsis</Text>
              <Text style={styles.mDate}>Completed • Jul 15, 2026</Text>
            </View>
            <Badge label="Approved" size="sm" color={colors.success} />
          </View>

          <View style={styles.milestoneItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.mName}>2. Dataset Preprocessing & Algorithm</Text>
              <Text style={styles.mDate}>Completed • Aug 10, 2026</Text>
            </View>
            <Badge label="Approved" size="sm" color={colors.success} />
          </View>

          <View style={styles.milestoneItem}>
            <Ionicons name="time" size={20} color={colors.warning} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.mName}>3. Phase 2 Working Demo & Code Review</Text>
              <Text style={styles.mDate}>Due Aug 31, 2026</Text>
            </View>
            <Badge label="In Progress" size="sm" color={colors.warning} />
          </View>

          <View style={[styles.milestoneItem, { borderBottomWidth: 0 }]}>
            <Ionicons name="ellipse-outline" size={20} color={colors.textDark} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.mName}>4. Final Thesis & Viva Voce</Text>
              <Text style={styles.mDate}>Due Oct 15, 2026</Text>
            </View>
            <Badge label="Upcoming" size="sm" color={colors.textDark} />
          </View>
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
  bannerCard: {
    backgroundColor: colors.surfaceCard,
    borderColor: `${colors.primary}44`,
    padding: 18,
    marginBottom: 16,
  },
  bannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bannerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bannerBadgeText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginBottom: 14,
  },
  timerGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timerBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: "center",
    paddingVertical: 10,
    width: "20%",
  },
  timerNumber: {
    color: colors.primaryLight,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
  },
  timerLabel: {
    color: colors.textDark,
    fontSize: 9,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  timerColon: {
    color: colors.textMuted,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 10,
  },
  projectCard: {
    padding: 16,
    marginBottom: 16,
  },
  projHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  projTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    flex: 1,
  },
  projAbstract: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginTop: 8,
  },
  subSectionTitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  teamRow: {
    flexDirection: "row",
    gap: 10,
  },
  memberChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 8,
    gap: 8,
  },
  memberName: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  memberRole: {
    color: colors.textDark,
    fontSize: 9,
  },
  milestoneCard: {
    padding: 14,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  mName: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  mDate: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
});
