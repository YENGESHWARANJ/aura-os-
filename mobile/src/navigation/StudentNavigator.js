import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";

// Student Screens
import StudentDashboardScreen from "../screens/student/StudentDashboardScreen";
import StudentAcademicsScreen from "../screens/student/StudentAcademicsScreen";
import StudentAttendanceScreen from "../screens/student/StudentAttendanceScreen";
import StudentAssignmentsScreen from "../screens/student/StudentAssignmentsScreen";
import StudentProjectsScreen from "../screens/student/StudentProjectsScreen";
import StudentSkillsScreen from "../screens/student/StudentSkillsScreen";
import StudyPlannerScreen from "../screens/student/StudyPlannerScreen";
import AIAssistantScreen from "../screens/student/AIAssistantScreen";

// Common Screens
import NotificationsScreen from "../screens/common/NotificationsScreen";
import ProfileScreen from "../screens/common/ProfileScreen";
import SettingsScreen from "../screens/common/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="StudentDashboardMain" component={StudentDashboardScreen} />
      <Stack.Screen name="Academics" component={StudentAcademicsScreen} />
      <Stack.Screen name="Attendance" component={StudentAttendanceScreen} />
      <Stack.Screen name="Projects" component={StudentProjectsScreen} />
      <Stack.Screen name="Skills" component={StudentSkillsScreen} />
      <Stack.Screen name="StudyPlanner" component={StudyPlannerScreen} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function StudentNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(15, 23, 42, 0.90)",
          borderTopColor: colors.surfaceBorder,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 72 : 62,
          paddingBottom: Platform.OS === "ios" ? 18 : 8,
          paddingTop: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textDark,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "AttendanceTab") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "AssignmentsTab") {
            iconName = focused ? "document-text" : "document-text-outline";
          } else if (route.name === "AITutorTab") {
            iconName = focused ? "sparkles" : "sparkles-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconFocused,
              ]}
            >
              <Ionicons
                name={iconName}
                size={20}
                color={focused ? colors.primaryLight : color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={DashboardStack}
        options={{ tabBarLabel: "Dashboard" }}
      />
      <Tab.Screen
        name="AttendanceTab"
        component={StudentAttendanceScreen}
        options={{ tabBarLabel: "Attendance" }}
      />
      <Tab.Screen
        name="AssignmentsTab"
        component={StudentAssignmentsScreen}
        options={{ tabBarLabel: "Tasks" }}
      />
      <Tab.Screen
        name="AITutorTab"
        component={AIAssistantScreen}
        options={{ tabBarLabel: "AI Tutor" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 38,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconFocused: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
  },
});
