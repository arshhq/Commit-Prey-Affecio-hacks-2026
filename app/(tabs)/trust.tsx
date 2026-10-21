import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { TrustOrb } from "@/components/ui/TrustOrb";
import { DEMO_PROFILES } from "@/data/demo-profiles";
import { DEMO_SCENARIOS } from "@/data/demo-scenarios";
import { colors, radii, spacing } from "@/constants/theme";

export default function TrustScreen() {
  const router = useRouter();
  const sample = DEMO_PROFILES[0];
  const verified = sample.verifications.filter((v) => v.status === "verified").length;
  const total = sample.verifications.length;

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginTop: spacing.md }}>
        Trust Insights
      </Text>
      <Text muted style={{ marginTop: 6, maxWidth: 520 }}>
        Evidence-based indicators for demo profiles — not a score of someone’s character.
      </Text>

      <Card elevated style={{ marginTop: spacing.lg, alignItems: "center" }}>
        <TrustOrb state="idle" size={100} label="Evidence snapshot" />
        <Text variant="caption" muted center style={{ marginTop: spacing.sm, maxWidth: 400 }}>
          These signals combine profile completeness, demo verification status, and conversation
          heuristics. Uncertainty always remains.
        </Text>
      </Card>

      <View style={styles.grid}>
        <Indicator
          label="Profile completeness"
          value={`${sample.completeness}%`}
          evidence="Bio, interests, and photo fields filled in the demo profile."
          limit="Completeness ≠ authenticity."
        />
        <Indicator
          label="Verification status"
          value={`${verified}/${total}`}
          evidence="Count of demo-verified attributes vs claims."
          limit="Simulated badges only — not real ID checks."
        />
        <Indicator
          label="Photo signal"
          value={`${sample.photoSignal}%`}
          evidence="Placeholder heuristic for demo storytelling."
          limit="Not forensic proof of a real photo."
        />
        <Indicator
          label="Conversation signals"
          value={`${sample.behaviorSignal}%`}
          evidence="Based on demo chat patterns linked to this profile."
          limit="Can miss novel tactics and false-alarm."
        />
      </View>

      <Text variant="subtitle" style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
        Trust Sandbox
      </Text>
      <View style={styles.carousel}>
        {DEMO_SCENARIOS.map((scenario) => (
          <Pressable
            key={scenario.id}
            onPress={() => router.push(`/sandbox/${scenario.id}`)}
            style={styles.scenario}
            accessibilityRole="button"
          >
            <Badge
              label={scenario.riskLabel}
              tone={scenario.riskLevel === "high" ? "warning" : "violet"}
            />
            <Text variant="bodyStrong" style={{ marginTop: spacing.sm }}>
              {scenario.title}
            </Text>
            <Text variant="caption" muted style={{ marginTop: 6 }} numberOfLines={3}>
              {scenario.summary}
            </Text>
            <Text variant="caption" color={colors.violetSoft} style={{ marginTop: 12 }}>
              Start →
            </Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

function Indicator({
  label,
  value,
  evidence,
  limit,
}: {
  label: string;
  value: string;
  evidence: string;
  limit: string;
}) {
  return (
    <Card style={styles.indicator}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="title" color={colors.cyan} style={{ marginTop: 4 }}>
        {value}
      </Text>
      <Text variant="caption" style={{ marginTop: spacing.sm }}>
        {evidence}
      </Text>
      <Text variant="micro" muted style={{ marginTop: 6 }}>
        Limit: {limit}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  indicator: {
    flexGrow: 1,
    flexBasis: 220,
  },
  carousel: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  scenario: {
    flexGrow: 1,
    flexBasis: 220,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
