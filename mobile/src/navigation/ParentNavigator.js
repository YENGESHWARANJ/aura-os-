import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";

// Parent Screens
import ParentDashboardScreen from "../screens/parent/ParentDashboardScreen";
import ParentAttendanceScreen from "../screens/parent/ParentAttendanceScreen";

// Common Screens
import NotificationsScreen from "../screens/common/NotificationsScreen";
import ProfileScreen from "../screens/common/ProfileScreen";
import SettingsScreen from "../screens/common/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ParentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ParentDashboardMain" component={ParentDashboardScreen} />
      <Stack.Screen name="ParentAttendance" component={ParentAttendanceScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function ParentNavigator() {
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
        tabBarActiveTintColor: colors.parent,
        tabBarInactiveTintColor: colors.textDark,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "ParentHomeTab") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "AttendanceTab") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "NotificationsTab") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="ParentHomeTab"
        component={ParentStack}
        options={{ tabBarLabel: "Child Overview" }}
      />
      <Tab.Screen
        name="AttendanceTab"
        component={ParentAttendanceScreen}
        options={{ tabBarLabel: "Attendance" }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{ tabBarLabel: "Alerts" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}
