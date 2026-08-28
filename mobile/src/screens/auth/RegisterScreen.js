import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/services/authApi";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const ROLES = [
  { key: "student", label: "Student", icon: "school" },
  { key: "faculty", label: "Faculty", icon: "book" },
  { key: "mentor", label: "Mentor", icon: "ribbon" },
  { key: "parent", label: "Parent", icon: "people" },
];

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [department, setDepartment] = useState("Computer Science");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        department,
      });

      if (data?.success) {
        Alert.alert("Success", "Account created successfully! Logging you in...");
        await login(email.trim(), password.trim());
      } else {
        setError(data?.message || "Registration failed");
      }
    } catch (err) {
      setError(err?.message || "Could not complete registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: Math.max(insets.top, 24) + 8, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={styles.backText}>Back to Sign In</Text>
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join AURA OS Academic Performance & Mentoring Network
          </Text>
        </View>

        <Card style={styles.formCard}>
          {/* Role Selection */}
          <Text style={styles.sectionLabel}>Select Your Role</Text>
          <View style={styles.roleGrid}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.key}
                activeOpacity={0.7}
                style={[
                  styles.roleBtn,
                  role === r.key && styles.roleBtnActive,
                ]}
                onPress={() => setRole(r.key)}
              >
                <Ionicons
                  name={r.icon}
                  size={18}
                  color={role === r.key ? colors.primaryLight : colors.textMuted}
                />
                <Text
                  style={[
                    styles.roleBtnText,
                    role === r.key && styles.roleBtnTextActive,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Full Name"
            placeholder="e.g. Alex Johnson"
            value={name}
            onChangeText={setName}
            icon="person-outline"
          />

          <Input
            label="College Email"
            placeholder="e.g. alex@aura.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <Input
            label="Department"
            placeholder="e.g. Computer Science"
            value={department}
            onChangeText={setDepartment}
            icon="business-outline"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            icon="person-add-outline"
            style={styles.submitBtn}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  backText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  brandContainer: {
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  formCard: {
    padding: 18,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
  },
  roleBtnActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}1A`,
  },
  roleBtnText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  roleBtnTextActive: {
    color: colors.primaryLight,
    fontWeight: typography.weights.bold,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dangerGlow,
    borderColor: `${colors.danger}55`,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.xs,
    flex: 1,
  },
  submitBtn: {
    marginTop: 4,
  },
});
