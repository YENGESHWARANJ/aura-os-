import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

const USERS = [
  { id: "u-1", name: "Alex Johnson", email: "student@aura.edu", role: "student", dept: "Computer Science" },
  { id: "u-2", name: "Dr. Suresh R", email: "mentor@aura.edu", role: "mentor", dept: "Computer Science" },
  { id: "u-3", name: "Prof. Nithya K", email: "faculty@aura.edu", role: "faculty", dept: "Computer Science" },
  { id: "u-4", name: "Robert Johnson", email: "parent@aura.edu", role: "parent", dept: "Guardian" },
  { id: "u-5", name: "Ananya Sharma", email: "ananya@aura.edu", role: "student", dept: "Computer Science" },
  { id: "u-6", name: "Deepak Kumar", email: "deepak@aura.edu", role: "student", dept: "Computer Science" },
  { id: "u-7", name: "Prof. Ananth V", email: "ananth@aura.edu", role: "faculty", dept: "Information Tech" },
];

const ROLES = ["All", "student", "faculty", "mentor", "parent"];

export default function UserManagementScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const filteredUsers = USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedRole !== "All") {
      return u.role === selectedRole;
    }
    return true;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return colors.student;
      case "faculty":
        return colors.faculty;
      case "mentor":
        return colors.mentor;
      case "parent":
        return colors.parent;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="User Management"
        subtitle="Manage Role Access & Profiles"
        onBack={() => navigation.goBack()}
        role="Admin"
      />

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textDark} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by user name or email..."
          placeholderTextColor={colors.textDark}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.filterChip,
                selectedRole === r && styles.filterChipActive,
              ]}
              onPress={() => setSelectedRole(r)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedRole === r && styles.filterTextActive,
                ]}
              >
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredUsers.map((u) => (
          <Card key={u.id} style={styles.userCard}>
            <View style={styles.userRow}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: `${getRoleColor(u.role)}22`, borderColor: `${getRoleColor(u.role)}55` },
                ]}
              >
                <Text style={[styles.avatarText, { color: getRoleColor(u.role) }]}>
                  {u.name.charAt(0)}
                </Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.userName}>{u.name}</Text>
                <Text style={styles.userEmail}>{u.email}</Text>
                <Text style={styles.userDept}>{u.dept}</Text>
              </View>

              <Badge label={u.role} size="sm" color={getRoleColor(u.role)} />
            </View>
          </Card>
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.xs,
  },
  filterRow: {
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}22`,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  filterTextActive: {
    color: colors.primaryLight,
    fontWeight: typography.weights.bold,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  userCard: {
    padding: 14,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  userName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  userEmail: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 1,
  },
  userDept: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
});
