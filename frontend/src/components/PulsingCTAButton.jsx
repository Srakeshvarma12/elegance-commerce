import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { ArrowRight } from "lucide-react-native";
import colors from "@/constants/colors";

export default function PulsingCTAButton({ label, onPress, variant = "primary" }) {
  const c = colors.dark;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const isPrimary = variant === "primary";

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.button,
          isPrimary
            ? { backgroundColor: c.accent }
            : { borderWidth: 1.5, borderColor: c.white },
        ]}
      >
        <Text style={[styles.label, { color: isPrimary ? c.black : c.white }]}>
          {label}
        </Text>
        <ArrowRight size={18} color={isPrimary ? c.black : c.white} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 3,
  },
});