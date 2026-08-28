import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Card from "./Card";

export default function MetricCard({
  title,
  value,
  unit = "",
  icon,
  gradient = colors.gradientPrimary,
  glowColor,
  trend,
  trendPositive = true,
  subtitle,
  onPress,
  style,
}) {
  return (
    <Card
      onPress={onPress}
      glowColor={glowColor || gradient[0]}
      style={[styles.cardContainer, style]}
      padding={14}
    >
      <View style={styles.topRow}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}
        >
          <Ionicons name={icon || "analytics"} size={18} color="#FFFFFF" />
        </LinearGradient>

        {trend && (
          <View
            style={[
              styles.trendPill,
              {
                backgroundColor: trendPositive
                  ? colors.successBg
                  : colors.dangerBg,
                borderColor: trendPositive
                  ? colors.riskLowBorder
                  : colors.riskHighBorder,
              },
            ]}
          >
            <Ionicons
              name={trendPositive ? "trending-up" : "trending-down"}
              size={12}
              color={trendPositive ? colors.success : colors.danger}
              style={{ marginRight: 3 }}
            />
            <Text
              style={[
                styles.trendText,
                { color: trendPositive ? colors.success : colors.danger },
              ]}
            >
              {trend}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    minWidth: 140,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  trendText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  valueContainer: {
    marginTop: 2,
  },
  value: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
    marginLeft: 2,
  },
  title: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    marginTop: 2,
  },
  subtitle: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 3,
  },
});
