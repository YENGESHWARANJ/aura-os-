import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { getBaseUrl, setCustomBaseUrl, DEFAULT_API_URL } from "../../api/client";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const [apiUrl, setApiUrl] = useState(getBaseUrl());
  const [pushNotifs, setPushNotifs] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSaveApiUrl = async () => {
    try {
      await setCustomBaseUrl(apiUrl);
      Alert.alert("Success", `Backend API Base URL updated to:\n${apiUrl}`);
    } catch (e) {
      Alert.alert("Error", "Failed to save API URL");
    }
  };

  const handleResetApiUrl = async () => {
    setApiUrl(DEFAULT_API_URL);
    await setCustomBaseUrl(DEFAULT_API_URL);
    Alert.alert("Reset", `Reset API Base URL to default:\n${DEFAULT_API_URL}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        subtitle="Server Host & Preferences"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Server Host Config (Crucial for Physical Device / Emulator connectivity) */}
        <Card style={styles.card} glowColor={`${colors.primary}33`}>
          <View style={styles.cardHeader}>
            <Ionicons name="server-outline" size={18} color={colors.primaryLight} />
            <Text style={styles.cardTitle}>Backend Server Configuration</Text>
          </View>

          <Text style={styles.cardDesc}>
            Connect the mobile app to your local backend API. For physical phones on WiFi, use your PC's LAN IP e.g. http://192.168.1.10:5000/api/v1
          </Text>

          <Input
            label="API Base URL"
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="http://localhost:5000/api/v1"
            icon="globe-outline"
          />

          <View style={styles.btnRow}>
            <Button
              title="Save API Endpoint"
              size="sm"
              icon="save-outline"
              onPress={handleSaveApiUrl}
              style={{ flex: 1 }}
            />
            <Button
              title="Reset Default"
              size="sm"
              variant="outline"
              onPress={handleResetApiUrl}
            />
          </View>
        </Card>

        {/* Notifications & Alerts */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="notifications-outline" size={18} color={colors.warning} />
            <Text style={styles.cardTitle}>Notification Preferences</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Push Notifications</Text>
              <Text style={styles.switchSub}>Assignment deadlines & meeting updates</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>AI Risk Early Warnings</Text>
              <Text style={styles.switchSub}>Immediate alerts when attendance drops below 75%</Text>
            </View>
            <Switch
              value={riskAlerts}
              onValueChange={setRiskAlerts}
              trackColor={{ false: colors.surfaceBorder, true: colors.danger }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* About App */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={18} color={colors.secondaryLight} />
            <Text style={styles.cardTitle}>About AURA OS</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoVal}>v1.0.0 (Production)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>AI Core Model</Text>
            <Text style={styles.infoVal}>Random Forest 13-Step Ensemble</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Database</Text>
            <Text style={styles.infoVal}>MongoDB Atlas Cloud</Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="Sign Out"
          variant="danger"
          icon="log-out-outline"
          onPress={logout}
          style={{ marginTop: 8, marginBottom: 24 }}
        />
      </ScrollView>
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
  card: {
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  cardDesc: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  switchLabel: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  switchSub: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  infoVal: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
});
