import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { colors, radii, spacing } from "@/constants/theme";
import { Text } from "./Text";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

const SIZE = {
  sm: { minHeight: 36, padX: 14, font: "caption" as const },
  md: { minHeight: 44, padX: 18, font: "bodyStrong" as const },
  lg: { minHeight: 48, padX: 20, font: "bodyStrong" as const },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  style,
}: Props) {
  const s = SIZE[size];
  const handle = () => {
    if (disabled || loading) return;
    void Haptics.selectionAsync().catch(() => undefined);
    onPress?.();
  };

  if (variant === "primary") {
    return (
      <Pressable
        onPress={handle}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.base,
          { opacity: disabled ? 0.45 : pressed ? 0.9 : 1, alignSelf: "flex-start" },
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <LinearGradient
          colors={["#9B5CFF", "#6B7CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { minHeight: s.minHeight, paddingHorizontal: s.padX }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text variant={s.font} color="#fff">
              {label}
            </Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  const bg =
    variant === "danger"
      ? colors.warningSoft
      : variant === "secondary"
        ? colors.surfaceHigh
        : "transparent";
  const border = variant === "ghost" ? colors.borderStrong : colors.border;
  const textColor = variant === "danger" ? colors.warning : colors.text;

  return (
    <Pressable
      onPress={handle}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles.flat,
        {
          backgroundColor: bg,
          borderColor: border,
          minHeight: s.minHeight,
          paddingHorizontal: s.padX,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
          alignSelf: "flex-start",
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text variant={s.font} color={textColor}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.full,
    overflow: "hidden",
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
  },
  flat: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
