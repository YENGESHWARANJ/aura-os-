import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function ProgressBar({
  progress = 0, // 0 to 100
  height = 8,
  gradientColors,
  showLabel = false,
  label,
  style,
  glow = true,
}) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const getGradient = () => {
    if (gradientColors) return gradientColors;
    if (clampedProgress >= 80) return colors.gradientEmerald;
    if (clampedProgress >= 60) return colors.gradientCyan;
    if (clampedProgress >= 40) return colors.gradientAmber;
    return colors.gradientRose;
  };

  const currentGradient = getGradient();

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>{label || "Progress"}</Text>
          <Text style={styles.percentText}>{Math.round(clampedProgress)}%</Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fillWrapper,
            {
              width: `${clampedProgress}%`,
              borderRadius: height / 2,
            },
            glow && {
              shadowColor: currentGradient[0],
              shadowOpacity: 0.5,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 1 },
            },
          ]}
        >
          <LinearGradient
            colors={currentGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradientFill, { height, borderRadius: height / 2 }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  labelText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  percentText: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  track: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  fillWrapper: {
    height: "100%",
  },
  gradientFill: {
    width: "100%",
  },
});
