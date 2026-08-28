import React, { useState, useEffect } from "react";
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

const INITIAL_TASKS = [
  { id: "t-1", subject: "Cloud Computing", topic: "AWS Lambda & Serverless Patterns", duration: "45 min", done: false, priority: "High" },
  { id: "t-2", subject: "Distributed Systems", topic: "Raft Log Replication Simulation", duration: "30 min", done: true, priority: "High" },
  { id: "t-3", subject: "Deep Learning", topic: "Attention Mechanism Mathematical Derivation", duration: "40 min", done: false, priority: "Medium" },
  { id: "t-4", subject: "Software Architecture", topic: "Clean Architecture & CQRS", duration: "25 min", done: false, priority: "Low" },
];

export default function StudyPlannerScreen({ navigation }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(2);

  useEffect(() => {
    let interval = null;
    if (isActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsActive(false);
      Alert.alert("Pomodoro Complete! 🎉", "Great job! Take a 5-minute breather before starting your next session.");
      setSessionCount((prev) => prev + 1);
      setTimerSeconds(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timerSeconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimerSeconds(25 * 60);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Header
        title="AI Study Planner"
        subtitle="Adaptive Focus & Pomodoro Sessions"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Pomodoro Focus Card */}
        <Card style={styles.pomodoroCard} glowColor={`${colors.primary}44`}>
          <View style={styles.pomoHeader}>
            <View style={styles.pomoBadge}>
              <Ionicons name="flame" size={14} color={colors.warning} />
              <Text style={styles.pomoBadgeText}>FOCUS SESSION # {sessionCount + 1}</Text>
            </View>
            <Badge label="25m Focus" size="sm" color={colors.primary} />
          </View>

          <Text style={styles.timerDisplay}>{formatTime(timerSeconds)}</Text>
          <Text style={styles.timerSub}>
            {isActive ? "⚡ Focus deep on your current task" : "Ready to study? Press start"}
          </Text>

          <View style={styles.timerControls}>
            <Button
              title={isActive ? "Pause Timer" : "Start Focus Session"}
              variant={isActive ? "outline" : "primary"}
              icon={isActive ? "pause" : "play"}
              onPress={toggleTimer}
              style={{ flex: 1 }}
            />
            <TouchableOpacity style={styles.resetBtn} onPress={resetTimer}>
              <Ionicons name="refresh" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* AI Recommendations */}
        <Card style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={16} color={colors.primaryLight} />
            <Text style={styles.aiTitle}>AI Schedule Recommendation</Text>
          </View>
          <Text style={styles.aiText}>
            Cloud Computing has the lowest test score (74%). Allocating 45 minutes today to Serverless Architectures will raise your predicted Grade from B+ to A.
          </Text>
        </Card>

        {/* Daily Tasks Checklist */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Target Tasks</Text>
          <Text style={styles.taskCount}>
            {tasks.filter((t) => t.done).length}/{tasks.length} Done
          </Text>
        </View>

        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            activeOpacity={0.8}
            onPress={() => toggleTask(task.id)}
          >
            <Card
              style={[
                styles.taskCard,
                task.done && { opacity: 0.6, borderColor: colors.surfaceBorder },
              ]}
            >
              <View style={styles.taskRow}>
                <Ionicons
                  name={task.done ? "checkbox" : "square-outline"}
                  size={22}
                  color={task.done ? colors.success : colors.primaryLight}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={styles.taskSubject}>{task.subject}</Text>
                    <Badge
                      label={task.priority}
                      size="sm"
                      color={
                        task.priority === "High"
                          ? colors.danger
                          : task.priority === "Medium"
                          ? colors.warning
                          : colors.info
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.taskTopic,
                      task.done && { textDecorationLine: "line-through", color: colors.textDark },
                    ]}
                  >
                    {task.topic}
                  </Text>
                </View>
                <Text style={styles.taskDuration}>{task.duration}</Text>
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
  pomodoroCard: {
    padding: 20,
    alignItems: "center",
    backgroundColor: colors.surfaceCard,
    marginBottom: 16,
  },
  pomoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 14,
  },
  pomoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pomoBadgeText: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  timerDisplay: {
    color: colors.text,
    fontSize: 52,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 2,
    marginVertical: 4,
  },
  timerSub: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginBottom: 20,
  },
  timerControls: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  resetBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  aiCard: {
    backgroundColor: `${colors.primary}10`,
    borderColor: `${colors.primary}44`,
    padding: 14,
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  aiTitle: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  aiText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
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
  taskCount: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  taskCard: {
    padding: 14,
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskSubject: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
  },
  taskTopic: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  taskDuration: {
    color: colors.textDark,
    fontSize: 10,
    marginLeft: 6,
  },
});
