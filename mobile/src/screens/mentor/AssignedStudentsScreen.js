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
import { RiskBadge, Badge } from "../../components/common/Badge";

const ALL_MENTEES = [
  { id: "m-1", roll: "21CS101", name: "Alex Johnson", risk: "Low", gpa: "8.64", attendance: "88%", dept: "CSE - Sec A" },
  { id: "m-2", roll: "21CS102", name: "Ananya Sharma", risk: "Low", gpa: "9.12", attendance: "94%", dept: "CSE - Sec A" },
  { id: "m-3", roll: "21CS103", name: "Deepak Kumar", risk: "High", gpa: "6.20", attendance: "64%", dept: "CSE - Sec A" },
  { id: "m-4", roll: "21CS104", name: "Harish Venkat", risk: "Medium", gpa: "7.40", attendance: "82%", dept: "CSE - Sec A" },
  { id: "m-5", roll: "21CS105", name: "Kavitha Mohan", risk: "Low", gpa: "8.90", attendance: "91%", dept: "CSE - Sec A" },
  { id: "m-6", roll: "21CS106", name: "Manoj Sundar", risk: "Medium", gpa: "7.10", attendance: "72%", dept: "CSE - Sec A" },
  { id: "m-7", roll: "21CS107", name: "Priya Rajan", risk: "Low", gpa: "9.30", attendance: "96%", dept: "CSE - Sec A" },
  { id: "m-8", roll: "21CS108", name: "Rahul Varma", risk: "High", gpa: "5.80", attendance: "61%", dept: "CSE - Sec A" },
  { id: "m-9", roll: "21CS109", name: "Sneha Balan", risk: "Low", gpa: "8.10", attendance: "85%", dept: "CSE - Sec A" },
  { id: "m-10", roll: "21CS110", name: "Vikas Reddy", risk: "High", gpa: "6.05", attendance: "66%", dept: "CSE - Sec A" },
];

const FILTERS = ["All", "High Risk", "Medium Risk", "Low Risk"];

export default function AssignedStudentsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredMentees = ALL_MENTEES.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.roll.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "High Risk") return m.risk === "High";
    if (activeFilter === "Medium Risk") return m.risk === "Medium";
    if (activeFilter === "Low Risk") return m.risk === "Low";
    return true;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Assigned Mentees"
        subtitle="Mentorship Roster & Academic Tracking"
        onBack={() => navigation.goBack()}
        role="Mentor"
      />

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textDark} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or register number..."
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

      {/* Risk Filter Chips */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredMentees.map((mentee) => (
          <TouchableOpacity
            key={mentee.id}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("MenteeProgress", { student: mentee })}
          >
            <Card style={styles.menteeCard}>
              <View style={styles.cardTop}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarLetter}>{mentee.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.roll}>{mentee.roll}</Text>
                  <Text style={styles.name}>{mentee.name}</Text>
                  <Text style={styles.dept}>{mentee.dept}</Text>
                </View>
                <RiskBadge level={mentee.risk} />
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.badgeWrap}>
                  <Text style={styles.statLabel}>CGPA: </Text>
                  <Text style={styles.statVal}>{mentee.gpa}</Text>
                </View>

                <View style={styles.badgeWrap}>
                  <Text style={styles.statLabel}>Attendance: </Text>
                  <Text
                    style={[
                      styles.statVal,
                      {
                        color:
                          parseFloat(mentee.attendance) >= 80
                            ? colors.success
                            : parseFloat(mentee.attendance) >= 75
                            ? colors.warning
                            : colors.danger,
                      },
                    ]}
                  >
                    {mentee.attendance}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color={colors.secondaryLight} />
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
    borderColor: colors.secondary,
    backgroundColor: `${colors.secondary}22`,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  filterTextActive: {
    color: colors.secondaryLight,
    fontWeight: typography.weights.bold,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  menteeCard: {
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.secondary}22`,
    borderWidth: 1,
    borderColor: `${colors.secondary}55`,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: colors.secondaryLight,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  roll: {
    color: colors.secondaryLight,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  name: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  dept: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 1,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: 8,
  },
  badgeWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    color: colors.textDark,
    fontSize: 10,
  },
  statVal: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});
