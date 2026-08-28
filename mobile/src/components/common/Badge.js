import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function Badge({
  label,
  variant = "default", // 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size = "sm", // 'xs' | 'sm' | 'md'
  icon,
  dot = false,
  style,
  textStyle,
}) {
  const getBadgeColors = () => {
    switch (variant) {
      case "primary":
        return {
          bg: "rgba(99, 102, 241, 0.15)",
          border: "rgba(99, 102, 241, 0.35)",
          text: colors.primaryLight,
          dot: colors.primaryLight,
        };
      case "success":
        return {
          bg: colors.successBg,
          border: colors.riskLowBorder,
          text: colors.success,
          dot: colors.success,
        };
      case "warning":
        return {
          bg: colors.warningBg,
          border: colors.riskMediumBorder,
          text: colors.warning,
          dot: colors.warning,
        };
      case "danger":
        return {
          bg: colors.dangerBg,
          border: colors.riskHighBorder,
          text: colors.danger,
          dot: colors.danger,
        };
      case "info":
        return {
          bg: colors.infoBg,
          border: "rgba(6, 182, 212, 0.35)",
          text: colors.accentLight,
          dot: colors.accentLight,
        };
      case "purple":
        return {
          bg: "rgba(139, 92, 246, 0.15)",
          border: "rgba(139, 92, 246, 0.35)",
          text: colors.secondaryLight,
          dot: colors.secondaryLight,
        };
      default:
        return {
          bg: "rgba(255, 255, 255, 0.06)",
          border: colors.surfaceBorder,
          text: colors.textSecondary,
          dot: colors.textMuted,
        };
    }
  };

  const badgeColors = getBadgeColors();

  return (
    <View
      style={[
        styles.badge,
        styles[size],
        {
          backgroundColor: badgeColors.bg,
          borderColor: badgeColors.border,
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            { backgroundColor: badgeColors.dot },
          ]}
        />
      )}
      <Text
        style={[
          styles.text,
          styles[`${size}Text`],
          { color: badgeColors.text },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function RiskBadge({ level = "Low", score, style }) {
  const normLevel = (level || "low").toLowerCase();

  let variant = "success";
  let label = "Low Risk";

  if (normLevel.includes("high") || normLevel === "critical") {
    variant = "danger";
    label = "High Risk";
  } else if (normLevel.includes("med") || normLevel.includes("mod")) {
    variant = "warning";
    label = "Medium Risk";
  }

  const displayText = score !== undefined ? `${label} (${score}%)` : label;

  return (
    <Badge
      label={displayText}
      variant={variant}
      dot
      size="sm"
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  xs: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  sm: {
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontWeight: typography.weights.bold,
    letterSpacing: 0.2,
  },
  xsText: {
    fontSize: 10,
  },
  smText: {
    fontSize: typography.sizes.xs,
  },
  mdText: {
    fontSize: typography.sizes.sm,
  },
});
