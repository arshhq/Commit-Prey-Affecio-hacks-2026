import { useEffect, useMemo } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows } from "@/constants/theme";
import { Text } from "./Text";

export type OrbState = "idle" | "analyzing" | "caution" | "complete";

type Props = {
  state?: OrbState;
  size?: number;
  label?: string;
  progress?: number;
};

const STATE_COLORS: Record<OrbState, [string, string, string]> = {
  idle: ["#9B5CFF", "#66D9FF", "#3A2A6A"],
  analyzing: ["#66D9FF", "#9B5CFF", "#D7B7FF"],
  caution: ["#FF656F", "#9B5CFF", "#4A1F3A"],
  complete: ["#52D6A4", "#66D9FF", "#1F3A3A"],
};

export function TrustOrb({
  state = "idle",
  size = 148,
  label,
  progress,
}: Props) {
  const pulse = useSharedValue(1);
  const spin = useSharedValue(0);
  const reduceMotion = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) reduceMotion.value = enabled ? 1 : 0;
    });
    return () => {
      mounted = false;
    };
  }, [reduceMotion]);

  useEffect(() => {
    cancelAnimation(pulse);
    cancelAnimation(spin);
    if (reduceMotion.value === 1) {
      pulse.value = 1;
      spin.value = 0;
      return;
    }
    if (state === "analyzing") {
      pulse.value = withRepeat(
        withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      spin.value = withRepeat(
        withTiming(360, { duration: 4200, easing: Easing.linear }),
        -1,
        false
      );
    } else if (state === "caution") {
      pulse.value = withRepeat(
        withTiming(1.05, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else if (state === "complete") {
      pulse.value = withTiming(1.04, { duration: 400 });
    } else {
      pulse.value = withRepeat(
        withTiming(1.03, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [state, pulse, spin, reduceMotion]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulse.value },
      { rotate: `${spin.value}deg` },
    ],
  }));

  const palette = STATE_COLORS[state];
  const caption = useMemo(() => {
    if (label) return label;
    if (state === "analyzing") return progress != null ? `Scanning · ${Math.round(progress)}%` : "Scanning…";
    if (state === "caution") return "Caution signals";
    if (state === "complete") return "Analysis ready";
    return "TrustLens";
  }, [label, state, progress]);

  return (
    <View style={styles.wrap} accessibilityLabel={`TrustLens orb, ${caption}`}>
      <Animated.View style={[{ width: size, height: size }, orbStyle, shadows.glow]}>
        <LinearGradient
          colors={palette}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.orb, { borderRadius: size / 2 }]}
        >
          <View style={[styles.core, { width: size * 0.42, height: size * 0.42, borderRadius: size * 0.21 }]} />
          <View style={[styles.shine, { width: size * 0.28, height: size * 0.14 }]} />
        </LinearGradient>
      </Animated.View>
      <Text variant="caption" muted center style={{ marginTop: 12 }}>
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  orb: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  core: {
    backgroundColor: "rgba(8,9,14,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  shine: {
    position: "absolute",
    top: "18%",
    left: "22%",
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
});
