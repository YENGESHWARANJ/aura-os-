import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function Button({
  title,
  onPress,
  variant = "primary", // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success'
  size = "md", // 'sm' | 'md' | 'lg'
  icon,
  iconRight,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const getGradientColors = () => {
    if (disabled) return ["#334155", "#1E293B"];
    switch (variant) {
      case "primary":
        return colors.gradientPrimary;
      case "secondary":
        return colors.gradientCyan;
      case "success":
        return colors.gradientEmerald;
      case "danger":
        return colors.gradientRose;
      default:
        return null;
    }
  };

  const isGradient = !["outline", "ghost"].includes(variant);
  const gradColors = getGradientColors();

  const buttonContent = (
    <View style={styles.contentRow}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? colors.primaryLight : "#FFFFFF"}
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size === "sm" ? 15 : size === "lg" ? 20 : 17}
              color={
                variant === "outline" || variant === "ghost"
                  ? colors.primaryLight
                  : "#FFFFFF"
              }
              style={{ marginRight: 7 }}
            />
          )}
          <Text
            style={[
              styles.text,
              styles[`${size}Text`],
              variant === "outline" && styles.outlineText,
              variant === "ghost" && styles.ghostText,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight && (
            <Ionicons
              name={iconRight}
              size={size === "sm" ? 15 : size === "lg" ? 20 : 17}
              color={
                variant === "outline" || variant === "ghost"
                  ? colors.primaryLight
                  : "#FFFFFF"
              }
              style={{ marginLeft: 7 }}
            />
          )}
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.85}
      style={[
        styles.buttonBase,
        styles[size],
        variant === "outline" && styles.outlineButton,
        variant === "ghost" && styles.ghostButton,
        variant === "primary" && !disabled && styles.primaryGlow,
        style,
      ]}
    >
      {isGradient && gradColors ? (
        <LinearGradient
          colors={gradColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientInner, styles[size]]}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        buttonContent
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientInner: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  primaryGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  sm: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    minHeight: 38,
  },
  md: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 26,
    minHeight: 56,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: typography.weights.bold,
    letterSpacing: 0.3,
  },
  smText: {
    fontSize: typography.sizes.xs,
  },
  mdText: {
    fontSize: typography.sizes.sm,
  },
  lgText: {
    fontSize: typography.sizes.md,
  },
  outlineButton: {
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(99, 102, 241, 0.4)",
  },
  outlineText: {
    color: colors.primaryLight,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.textDark,
  },
});
