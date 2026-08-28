import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";

// Mentor Screens
import MentorDashboardScreen from "../screens/mentor/MentorDashboardScreen";
import AssignedStudentsScreen from "../screens/mentor/AssignedStudentsScreen";
import MenteeProgressScreen from "../screens/mentor/MenteeProgressScreen";
import MentorMeetingsScreen from "../screens/mentor/MentorMeetingsScreen";

// Common Screens
import NotificationsScreen from "../screens/common/NotificationsScreen";
import ProfileScreen from "../screens/common/ProfileScreen";
import SettingsScreen from "../screens/common/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MentorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MentorDashboardMain" component={MentorDashboardScreen} />
      <Stack.Screen name="AssignedStudents" component={AssignedStudentsScreen} />
      <Stack.Screen name="MenteeProgress" component={MenteeProgressScreen} />
      <Stack.Screen name="MentorMeetings" component={MentorMeetingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function MentorNavigator() {
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
        tabBarActiveTintColor: colors.secondaryLight,
        tabBarInactiveTintColor: colors.textDark,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "MentorHomeTab") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "MenteesTab") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "MeetingsTab") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="MentorHomeTab"
        component={MentorStack}
        options={{ tabBarLabel: "Dashboard" }}
      />
      <Tab.Screen
        name="MenteesTab"
        component={AssignedStudentsScreen}
        options={{ tabBarLabel: "Mentees" }}
      />
      <Tab.Screen
        name="MeetingsTab"
        component={MentorMeetingsScreen}
        options={{ tabBarLabel: "Meetings" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}
