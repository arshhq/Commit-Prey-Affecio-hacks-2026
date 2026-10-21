import { Pressable, StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { TrustOrb } from "@/components/ui/TrustOrb";
import { colors, spacing } from "@/constants/theme";
import type { SafetyAnalysis } from "@/types";

type Props = {
  analysis: SafetyAnalysis;
  analyzing?: boolean;
  progress?: number;
  onDismiss: () => void;
  onUseReply: (reply: string) => void;
  onReport: () => void;
  onOpenDetails?: () => void;
};

const FLAG_LABEL: Record<string, string> = {
  money_request: "Money request",
  emotional_pressure: "Emotional pressure",
  sensitive_info: "Sensitive info ask",
  suspicious_link: "Suspicious link",
  off_platform: "Off-platform push",
  urgency: "Artificial urgency",
  other: "Other signal",
};

export function MessageGuardCard({
  analysis,
  analyzing,
  progress,
  onDismiss,
  onUseReply,
  onReport,
  onOpenDetails,
}: Props) {
  if (analyzing) {
    return (
      <Card style={styles.card}>
        <View style={{ alignItems: "center", paddingVertical: spacing.md }}>
          <TrustOrb state="analyzing" size={88} progress={progress} />
          <Text muted center style={{ marginTop: spacing.sm }}>
            Looking for money asks, pressure, links, and off-platform pushes…
          </Text>
        </View>
      </Card>
    );
  }

  const orbState =
    analysis.riskLevel === "high"
      ? "caution"
      : analysis.riskLevel === "moderate"
        ? "analyzing"
        : "complete";

  return (
    <Card
      style={[
        styles.card,
        analysis.riskLevel === "high" && styles.high,
        analysis.riskLevel === "moderate" && styles.mod,
      ]}
    >
      <View style={styles.header}>
        <TrustOrb
          state={orbState}
          size={56}
          label={
            analysis.riskLevel === "high"
              ? "High concern"
              : analysis.riskLevel === "moderate"
                ? "Worth a look"
                : "Low concern"
          }
        />
        <View style={{ flex: 1 }}>
          <Badge
            label={analysis.riskLevel.toUpperCase()}
            tone={
              analysis.riskLevel === "high"
                ? "warning"
                : analysis.riskLevel === "moderate"
                  ? "violet"
                  : "success"
            }
          />
          <Text variant="subtitle" style={{ marginTop: 8 }}>
            {analysis.title}
          </Text>
          <Text variant="caption" muted style={{ marginTop: 4 }}>
            {analysis.source === "ai" ? "AI-assisted" : "On-device rules"} · not a scam verdict
          </Text>
        </View>
      </View>

      {analysis.flags.length === 0 ? (
        <Text muted style={{ marginTop: spacing.md }}>
          No strong scam patterns matched this message.
        </Text>
      ) : (
        <View style={styles.flags}>
          {analysis.flags.map((f, i) => (
            <View key={`${f.type}-${i}`} style={styles.flag}>
              <Text variant="bodyStrong">{FLAG_LABEL[f.type] ?? f.type}</Text>
              <Text variant="caption" color={colors.violetSoft} style={{ marginTop: 4 }}>
                Triggered by: “{f.evidence}”
              </Text>
              <Text variant="caption" muted style={{ marginTop: 4 }}>
                {f.explanation}
              </Text>
            </View>
          ))}
        </View>
      )}

      {analysis.suggestedReplies.length > 0 ? (
        <View style={{ marginTop: spacing.md }}>
          <Text variant="caption" muted>
            Suggested boundary replies — tap to load into composer (nothing sends automatically)
          </Text>
          {analysis.suggestedReplies.map((reply) => (
            <Pressable
              key={reply}
              onPress={() => onUseReply(reply)}
              style={styles.reply}
              accessibilityRole="button"
            >
              <Text variant="caption">{reply}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Text variant="micro" muted style={{ marginTop: spacing.md }}>
        {analysis.limitations}
      </Text>

      <View style={styles.actions}>
        {onOpenDetails ? (
          <Button label="Details" variant="ghost" size="sm" onPress={onOpenDetails} />
        ) : null}
        <Button label="Dismiss" variant="ghost" size="sm" onPress={onDismiss} />
        <Button label="Report / Block" variant="danger" size="sm" onPress={onReport} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.sm },
  high: {
    borderColor: "rgba(255,101,111,0.45)",
    backgroundColor: "rgba(255,101,111,0.08)",
  },
  mod: { borderColor: "rgba(155,92,255,0.35)" },
  header: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  flags: { marginTop: spacing.md, gap: spacing.sm },
  flag: {
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.bgElevated,
  },
  reply: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceHigh,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
