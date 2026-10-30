import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import notificationApi from "../../api/services/notificationApi";
import { subscribeToMobileNotifications } from "../../services/mobileSocketService";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

const normalizeNotification = (notification) => ({
  id: notification._id,
  title: notification.title || "AURA OS Notification",
  message: notification.message || "You have a new academic update.",
  time: formatTime(notification.createdAt),
  category: (notification.type || "System").replace(/_/g, " "),
  read: Boolean(notification.isRead),
  urgent: ["high", "critical"].includes(notification.priority),
  targetRoute: notification.targetRoute,
});

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await notificationApi.getNotifications({ page: 1, limit: 50 });
      const records = response?.data?.notifications || [];
      setNotifications(records.map(normalizeNotification));
    } catch (error) {
      console.warn("[NotificationsScreen] Unable to load notifications:", error.message || error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    subscribeToMobileNotifications((notification) => {
      if (!active || !notification?._id) return;

      setNotifications((current) => {
        if (current.some((item) => item.id === notification._id)) return current;
        return [normalizeNotification(notification), ...current];
      });
    }).then((cleanup) => {
      if (!active) cleanup?.();
      else unsubscribe = cleanup || unsubscribe;
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const markAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.warn("[NotificationsScreen] Unable to mark all read:", error.message || error);
    }
  };

  const markRead = async (id) => {
    const selected = notifications.find((notification) => notification.id === id);
    if (!selected || selected.read) return;

    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.warn("[NotificationsScreen] Unable to mark notification read:", error.message || error);
    }
  };

  const openNotification = async (notification) => {
    await markRead(notification.id);

    const route = String(notification.targetRoute || "").toLowerCase();
    const stackRoutes = navigation.getState?.()?.routeNames || [];
    const parentNavigation = navigation.getParent?.();
    const parentRoutes = parentNavigation?.getState?.()?.routeNames || [];

    const stackTarget = route.includes("attendance")
      ? "Attendance"
      : route.includes("project")
        ? "Projects"
        : route.includes("settings")
          ? "Settings"
          : null;

    if (stackTarget && stackRoutes.includes(stackTarget)) {
      navigation.navigate(stackTarget);
      return;
    }

    const tabTarget = route.includes("assignment")
      ? "AssignmentsTab"
      : route.includes("attendance")
        ? "AttendanceTab"
        : route.includes("profile") || route.includes("evidence") || route.includes("intervention")
          ? "ProfileTab"
          : null;

    if (tabTarget && parentRoutes.includes(tabTarget)) {
      parentNavigation.navigate(tabTarget);
    }
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} />}
      >
        <View style={styles.topActionRow}>
          <Text style={styles.unreadCount}>
            {notifications.filter((n) => !n.read).length} Unread Alerts
          </Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primaryLight} size="large" style={styles.loader} />
        ) : notifications.length === 0 ? (
          <Text style={styles.emptyText}>You are all caught up.</Text>
        ) : notifications.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            activeOpacity={0.8}
            onPress={() => openNotification(notif)}
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
  loader: {
    marginTop: 48,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    textAlign: "center",
    marginTop: 48,
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
