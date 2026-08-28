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

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Capstone Phase 2 Submission Window Open",
    message: "Batch 2026 submission window is open. Final deliverables due by Aug 31, 2026.",
    time: "10 min ago",
    category: "Academic",
    read: false,
    urgent: true,
  },
  {
    id: "notif-2",
    title: "1-on-1 Mentoring Meeting Scheduled",
    message: "Dr. Suresh R scheduled a counseling session for Aug 30 at 03:30 PM in Cabin 204.",
    time: "2 hours ago",
    category: "Mentorship",
    read: false,
    urgent: false,
  },
  {
    id: "notif-3",
    title: "Internal 1 Examination Marks Published",
    message: "Distributed Systems (CS601) Internal 1 evaluation has been posted. Score: 24/25.",
    time: "1 day ago",
    category: "Exam",
    read: true,
    urgent: false,
  },
  {
    id: "notif-4",
    title: "Statutory Attendance Safe Standing",
    message: "Your monthly attendance stands at 88.0%, comfortably above the 75% institutional threshold.",
    time: "2 days ago",
    category: "Attendance",
    read: true,
    urgent: false,
  },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notifications & Alerts"
        subtitle="Academic Broadcasts & Warnings"
        onBack={() => navigation.goBack()}
        rightIcon="checkmark-done-outline"
        onRightPress={markAllRead}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topActionRow}>
          <Text style={styles.unreadCount}>
            {notifications.filter((n) => !n.read).length} Unread Alerts
          </Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {notifications.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            activeOpacity={0.8}
            onPress={() => toggleRead(notif.id)}
          >
            <Card
              style={[
                styles.notifCard,
                !notif.read && styles.notifUnread,
              ]}
            >
              <View style={styles.notifHeader}>
                <View style={styles.categoryRow}>
                  <Badge
                    label={notif.category}
                    size="sm"
                    color={notif.urgent ? colors.danger : colors.primary}
                  />
                  {notif.urgent && (
                    <Badge label="Urgent" size="sm" color={colors.danger} icon="alert" />
                  )}
                </View>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>

              <Text style={[styles.notifTitle, !notif.read && styles.titleUnread]}>
                {notif.title}
              </Text>
              <Text style={styles.notifMessage}>{notif.message}</Text>
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
  topActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  unreadCount: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  markReadText: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  notifCard: {
    padding: 14,
    marginBottom: 10,
  },
  notifUnread: {
    borderColor: `${colors.primary}55`,
    backgroundColor: `${colors.primary}0D`,
  },
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notifTime: {
    color: colors.textDark,
    fontSize: 10,
  },
  notifTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  titleUnread: {
    color: colors.primaryLight,
  },
  notifMessage: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
  },
});
