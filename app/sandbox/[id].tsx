import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { TrustOrb } from "@/components/ui/TrustOrb";
import { DEMO_SCENARIOS } from "@/data/demo-scenarios";
import { colors, spacing } from "@/constants/theme";

export default function SandboxScenarioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scenario = useMemo(() => DEMO_SCENARIOS.find((s) => s.id === id), [id]);
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saferCount, setSaferCount] = useState(0);
  const [choiceCount, setChoiceCount] = useState(0);

  if (!scenario) {
    return (
      <Screen>
        <Text>Scenario not found.</Text>
      </Screen>
    );
  }

  const step = scenario.steps[stepIndex];
  const isLast = stepIndex >= scenario.steps.length - 1;
  const showComplete = isLast && (step.from === "narrator" || !!feedback);

  const choose = (safer: boolean, text: string) => {
    setFeedback(text);
    setChoiceCount((c) => c + 1);
    if (safer) setSaferCount((c) => c + 1);
  };

  const next = () => {
    setFeedback(null);
    if (stepIndex < scenario.steps.length - 1) setStepIndex((i) => i + 1);
  };

  return (
    <Screen scroll>
      <View style={styles.progressRow}>
        <Badge
          label={scenario.riskLabel}
          tone={scenario.riskLevel === "high" ? "warning" : "violet"}
        />
        <Text variant="caption" muted>
          Step {Math.min(stepIndex + 1, scenario.steps.length)} / {scenario.steps.length}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${((stepIndex + 1) / scenario.steps.length) * 100}%` },
          ]}
        />
      </View>

      <Text variant="title" style={{ marginTop: spacing.md }}>
        {scenario.title}
      </Text>

      <Card elevated style={{ marginTop: spacing.lg }}>
        <Text variant="caption" muted>
          {step.from === "narrator" ? "Narrator" : "Match"}
        </Text>
        <Text style={{ marginTop: spacing.sm }}>{step.text}</Text>
      </Card>

      {step.choices && !feedback ? (
        <View style={styles.choices}>
          {step.choices.map((choice) => (
            <Button
              key={choice.id}
              label={choice.label}
              variant={choice.safer ? "primary" : "secondary"}
              onPress={() => choose(choice.safer, choice.feedback)}
              style={{ marginBottom: spacing.sm, alignSelf: "stretch" }}
            />
          ))}
        </View>
      ) : null}

      {feedback ? (
        <Card style={{ marginTop: spacing.md }}>
          <Text variant="subtitle">Why this matters</Text>
          <Text style={{ marginTop: 8 }}>{feedback}</Text>
          {!isLast || step.choices ? (
            <Button label="Continue" onPress={next} style={{ marginTop: spacing.md }} />
          ) : null}
        </Card>
      ) : null}

      {showComplete ? (
        <Card elevated style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <TrustOrb state="complete" size={88} label="Scenario complete" />
          <Text variant="subtitle" style={{ marginTop: spacing.md }}>
            Lessons learned
          </Text>
          {scenario.lessons.map((lesson) => (
            <Text key={lesson} style={{ marginTop: spacing.sm, alignSelf: "stretch" }}>
              • {lesson}
            </Text>
          ))}
          <Text muted style={{ marginTop: spacing.md }}>
            Safer choices: {saferCount}/{choiceCount || 0}
          </Text>
          <Button
            label="Back to Trust"
            variant="secondary"
            onPress={() => router.back()}
            style={{ marginTop: spacing.md }}
          />
        </Card>
      ) : null}

      {step.from === "narrator" && !feedback && !isLast ? (
        <Button label="Next" onPress={next} style={{ marginTop: spacing.md }} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barTrack: {
    marginTop: spacing.sm,
    height: 6,
    borderRadius: 99,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  barFill: { height: 6, backgroundColor: colors.violet },
  choices: { marginTop: spacing.lg },
});
