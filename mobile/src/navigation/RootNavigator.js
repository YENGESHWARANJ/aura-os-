import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import colors from "../theme/colors";
import typography from "../theme/typography";

import AuthNavigator from "./AuthNavigator";
import StudentNavigator from "./StudentNavigator";
import FacultyNavigator from "./FacultyNavigator";
import MentorNavigator from "./MentorNavigator";
import ParentNavigator from "./ParentNavigator";
import AdminNavigator from "./AdminNavigator";
import { setupNotificationListeners } from "../services/pushNotificationService";

export default function RootNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigationRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !navigationRef.current) return;

    const unsubscribe = setupNotificationListeners({
      navigate: (screenName, params) => {
        navigationRef.current?.navigate(screenName, params);
      },
    }, user?.role);

    return unsubscribe;
  }, [isAuthenticated, user?.role]);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashLogo}>
          <Ionicons name="shield-checkmark" size={40} color={colors.primaryLight} />
        </View>
        <Text style={styles.splashTitle}>AURA OS</Text>
        <Text style={styles.splashSub}>AI Academic Performance & Mentoring</Text>
        <ActivityIndicator color={colors.primaryLight} style={{ marginTop: 24 }} size="large" />
      </View>
    );
  }

  const renderRoleNavigator = () => {
    switch (user?.role?.toLowerCase()) {
      case "mentor":
        return <MentorNavigator />;
      case "faculty":
        return <FacultyNavigator />;
      case "parent":
        return <ParentNavigator />;
      case "admin":
      case "hod":
      case "superadmin":
        return <AdminNavigator />;
      default:
        return <StudentNavigator />;
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? renderRoleNavigator() : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  splashLogo: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: `${colors.primary}66`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  splashTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 1,
  },
  splashSub: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 4,
    textAlign: "center",
  },
});
