import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../theme/colors";

export default function Card({
  children,
  style,
  onPress,
  glowColor,
  gradientColors,
  variant = "glass", // 'glass' | 'solid' | 'gradient' | 'outlined'
  padding = 16,
}) {
  const Container = onPress ? TouchableOpacity : View;

  const getGradientColors = () => {
    if (gradientColors) return gradientColors;
    if (variant === "gradient") return colors.gradientCard;
    return colors.gradientGlass;
  };

  return (
    <Container
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      style={[
        styles.cardOuter,
        glowColor && {
          shadowColor: glowColor,
          shadowOpacity: 0.35,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          borderColor: `${glowColor}55`,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.cardInner,
          { padding },
        ]}
      >
        {/* Subtle top light reflection line */}
        <View style={styles.topHighlight} />
        {children}
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: "rgba(15, 23, 42, 0.70)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  cardInner: {
    borderRadius: 19,
    width: "100%",
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
});
