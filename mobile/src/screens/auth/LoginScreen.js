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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

export default function LoginScreen({ navigation }) {
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  const handleDemoLogin = async (role) => {
    setError("");
    try {
      await demoLogin(role);
    } catch (err) {
      Alert.alert("Demo Login Error", err.message);
    }
  };

  const demoRoles = [
    { role: "student", label: "Student", icon: "school-outline", color: colors.gradientPrimary },
    { role: "faculty", label: "Faculty", icon: "briefcase-outline", color: colors.gradientCyan },
    { role: "mentor", label: "Mentor", icon: "people-outline", color: colors.gradientViolet },
    { role: "parent", label: "Parent", icon: "heart-outline", color: colors.gradientAmber },
    { role: "admin", label: "Admin", icon: "shield-outline", color: colors.gradientRose },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Background Deep Glow Highlights */}
      <View style={styles.glowOrbTop} />
      <View style={styles.glowOrbBottom} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Branding Header */}
        <View style={styles.brandHeader}>
          <LinearGradient
            colors={colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBadge}
          >
            <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.brandName}>AURA OS</Text>
          <Text style={styles.brandTagline}>
            AI Academic Performance & Mentoring Platform
          </Text>
        </View>

        {/* Glass Authentication Card */}
        <Card style={styles.loginCard} glowColor={colors.primary}>
          <Text style={styles.cardTitle}>Sign In to Portal</Text>
          <Text style={styles.cardSubtitle}>
            Enter your institutional credentials below
          </Text>

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Email or Roll Number"
            placeholder="student@aura.edu"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            icon="mail-outline"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError("");
            }}
            icon="lock-closed-outline"
            isPassword
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            variant="primary"
            size="md"
            iconRight="arrow-forward"
            style={styles.signInBtn}
          />

          <View style={styles.registerPrompt}>
            <Text style={styles.promptText}>New to AURA OS? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate("Register")}>
              <Text style={styles.registerLink}>Create an Account</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 1-Tap Quick Demo Portals */}
        <Card style={styles.demoCard}>
          <View style={styles.demoHeader}>
            <Ionicons name="flash" size={16} color={colors.warning} />
            <Text style={styles.demoTitle}>1-Tap Instant Demo Access</Text>
            <Badge label="TESTING" variant="warning" size="xs" />
          </View>
          <Text style={styles.demoDesc}>
            Test any user role immediately with simulated academic & risk data
          </Text>

          <View style={styles.demoGrid}>
            {demoRoles.map((item) => (
              <TouchableOpacity
                key={item.role}
                onPress={() => handleDemoLogin(item.role)}
                activeOpacity={0.8}
                style={styles.demoButton}
              >
                <LinearGradient
                  colors={item.color}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.demoBtnInner}
                >
                  <Ionicons name={item.icon} size={16} color="#FFFFFF" />
                  <Text style={styles.demoBtnText}>{item.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Footer Meta */}
        <Text style={styles.footerText}>
          Connected to AURA OS v1.0 Core • AI Model Ensemble Active
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowOrbTop: {
    position: "absolute",
    top: -80,
    left: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(99, 102, 241, 0.18)",
  },
  glowOrbBottom: {
    position: "absolute",
    bottom: 40,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(6, 182, 212, 0.12)",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  brandName: {
    color: colors.text,
    fontSize: 28,
    fontWeight: typography.weights.black,
    letterSpacing: 0.8,
  },
  brandTagline: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 4,
    textAlign: "center",
  },
  loginCard: {
    padding: 22,
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 3,
    marginBottom: 18,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.riskHighBorder,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  signInBtn: {
    marginTop: 6,
    marginBottom: 14,
  },
  registerPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  promptText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  registerLink: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  demoCard: {
    padding: 18,
    marginBottom: 16,
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  demoTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    flex: 1,
  },
  demoDesc: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginBottom: 14,
  },
  demoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  demoButton: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    overflow: "hidden",
  },
  demoBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  demoBtnText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  footerText: {
    color: colors.textDark,
    fontSize: 10,
    textAlign: "center",
    marginTop: 6,
  },
});
