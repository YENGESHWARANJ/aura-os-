import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import colors from "../../theme/colors";

export default function LoadingSkeleton({ width = "100%", height = 20, borderRadius = 8, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.row}>
        <LoadingSkeleton width={40} height={40} borderRadius={10} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <LoadingSkeleton width="70%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
          <LoadingSkeleton width="40%" height={12} borderRadius={4} />
        </View>
      </View>
      <LoadingSkeleton width="100%" height={10} borderRadius={5} style={{ marginTop: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surfaceLight,
  },
  cardSkeleton: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
