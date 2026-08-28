import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";

// Faculty Screens
import FacultyDashboardScreen from "../screens/faculty/FacultyDashboardScreen";
import FacultyAttendanceScreen from "../screens/faculty/FacultyAttendanceScreen";
import FacultyRiskStudentsScreen from "../screens/faculty/FacultyRiskStudentsScreen";

// Common Screens
import NotificationsScreen from "../screens/common/NotificationsScreen";
import ProfileScreen from "../screens/common/ProfileScreen";
import SettingsScreen from "../screens/common/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FacultyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="FacultyDashboardMain" component={FacultyDashboardScreen} />
      <Stack.Screen name="FacultyAttendance" component={FacultyAttendanceScreen} />
      <Stack.Screen name="FacultyRiskStudents" component={FacultyRiskStudentsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function FacultyNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.faculty,
        tabBarInactiveTintColor: colors.textDark,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "FacultyHomeTab") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "AttendanceTab") {
            iconName = focused ? "checkbox" : "checkbox-outline";
          } else if (route.name === "RiskTab") {
            iconName = focused ? "warning" : "warning-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="FacultyHomeTab"
        component={FacultyStack}
        options={{ tabBarLabel: "Dashboard" }}
      />
      <Tab.Screen
        name="AttendanceTab"
        component={FacultyAttendanceScreen}
        options={{ tabBarLabel: "Attendance" }}
      />
      <Tab.Screen
        name="RiskTab"
        component={FacultyRiskStudentsScreen}
        options={{ tabBarLabel: "At-Risk" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}
