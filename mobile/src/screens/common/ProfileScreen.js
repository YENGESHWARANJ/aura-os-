import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(user?.name || "Alex Johnson");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState("AI & Distributed Systems enthusiast | Capstone Lead");

  const handleSaveProfile = async () => {
    await updateUser({ name });
    Alert.alert("Success", "Profile updated successfully!");
    setShowEditModal(false);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "mentor":
        return colors.mentor;
      case "faculty":
        return colors.faculty;
      case "parent":
        return colors.parent;
      case "admin":
        return colors.admin;
      default:
        return colors.student;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Profile"
        subtitle="Identity & Role Credentials"
        rightIcon="create-outline"
        onRightPress={() => setShowEditModal(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard} glowColor={`${getRoleColor(user?.role)}44`}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: `${getRoleColor(user?.role)}22`, borderColor: `${getRoleColor(user?.role)}66` },
              ]}
            >
              <Text style={[styles.avatarText, { color: getRoleColor(user?.role) }]}>
                {user?.name ? user.name.charAt(0) : "A"}
              </Text>
            </View>
            <Badge label={user?.role || "Student"} color={getRoleColor(user?.role)} />
          </View>

          <Text style={styles.profileName}>{user?.name || "Alex Johnson"}</Text>
          <Text style={styles.profileEmail}>{user?.email || "student@aura.edu"}</Text>
          <Text style={styles.profileBio}>{bio}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Register / ID</Text>
              <Text style={styles.detailVal}>21CS101</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailVal}>Computer Science</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Semester</Text>
              <Text style={styles.detailVal}>Semester 6</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Contact</Text>
              <Text style={styles.detailVal}>{phone}</Text>
            </View>
          </View>
        </Card>

        {/* Security & Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Options</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowEditModal(true)}
        >
          <Card style={styles.menuCard}>
            <View style={styles.menuRow}>
              <Ionicons name="person-outline" size={20} color={colors.primaryLight} />
              <Text style={styles.menuText}>Edit Profile Information</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textDark} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Settings")}
        >
          <Card style={styles.menuCard}>
            <View style={styles.menuRow}>
              <Ionicons name="settings-outline" size={20} color={colors.secondaryLight} />
              <Text style={styles.menuText}>System Settings & Server Host</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textDark} />
            </View>
          </Card>
        </TouchableOpacity>

        <Button
          title="Sign Out of AURA OS"
          variant="danger"
          icon="log-out-outline"
          onPress={logout}
          style={{ marginTop: 12, marginBottom: 20 }}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              icon="person-outline"
            />

            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              icon="call-outline"
            />

            <Input
              label="Bio / Academic Headline"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              icon="document-text-outline"
            />

            <Button
              title="Save Changes"
              onPress={handleSaveProfile}
              icon="checkmark-outline"
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
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
  profileCard: {
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: colors.surfaceCard,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 26,
    fontWeight: typography.weights.extrabold,
  },
  profileName: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  profileEmail: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  profileBio: {
    color: colors.textDark,
    fontSize: typography.sizes.xs,
    textAlign: "center",
    lineHeight: 16,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  detailsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 12,
    marginTop: 6,
    gap: 12,
  },
  detailItem: {
    width: "46%",
  },
  detailLabel: {
    color: colors.textDark,
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  detailVal: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  menuCard: {
    padding: 14,
    marginBottom: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});
