import { StyleSheet, View } from "react-native";
import { colors, radii, spacing } from "@/constants/theme";
import { Text } from "./Text";

type Tone = "violet" | "cyan" | "success" | "warning" | "neutral";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  violet: { bg: "rgba(155,92,255,0.18)", fg: colors.violetSoft },
  cyan: { bg: "rgba(102,217,255,0.14)", fg: colors.cyan },
  success: { bg: "rgba(82,214,164,0.16)", fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  neutral: { bg: colors.surfaceHigh, fg: colors.textSecondary },
};

export function Badge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: Tone;
}) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text variant="micro" color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
});
