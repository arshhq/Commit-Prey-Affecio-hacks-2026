import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors, spacing } from "@/constants/theme";

const QUESTIONS = [
  {
    id: "pace",
    prompt: "Preferred chat pace?",
    options: ["Slow & thoughtful", "Playful banter", "Direct plans"],
  },
  {
    id: "meet",
    prompt: "First meet energy?",
    options: ["Coffee daytime", "Museum / walk", "Group activity"],
  },
  {
    id: "interest",
    prompt: "Shared interest you'd enjoy?",
    options: ["Music", "Food", "Outdoors"],
  },
];

export default function VibeSyncScreen() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const shared = useMemo(() => Object.values(answers), [answers]);
  const score = Math.min(100, 40 + shared.length * 18);

  return (
    <Screen scroll>
      <Text muted>
        A light compatibility activity — not a psychological assessment. Results describe overlap in preferences you chose.
      </Text>

      {!done ? (
        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          {QUESTIONS.map((q) => (
            <Card key={q.id}>
              <Text variant="subtitle">{q.prompt}</Text>
              <View style={styles.options}>
                {q.options.map((opt) => {
                  const active = answers[q.id] === opt;
                  return (
                    <Pressable
                      key={opt}
                      onPress={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      style={[styles.option, active && styles.optionActive]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <Text color={active ? "#fff" : colors.text}>{opt}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          ))}
          <Button
            label="See constellation"
            disabled={Object.keys(answers).length < QUESTIONS.length}
            onPress={() => setDone(true)}
          />
        </View>
      ) : (
        <Card elevated style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Svg width={260} height={220}>
            <Circle cx={130} cy={110} r={70} stroke="rgba(155,92,255,0.25)" strokeWidth={1} fill="none" />
            {shared.map((_, i) => {
              const angle = (i / shared.length) * Math.PI * 2 - Math.PI / 2;
              const x = 130 + Math.cos(angle) * 70;
              const y = 110 + Math.sin(angle) * 70;
              return (
                <Line
                  key={`l-${i}`}
                  x1={130}
                  y1={110}
                  x2={x}
                  y2={y}
                  stroke={colors.cyan}
                  strokeWidth={1.5}
                  opacity={0.7}
                />
              );
            })}
            <Circle cx={130} cy={110} r={8} fill={colors.violet} />
            {shared.map((_, i) => {
              const angle = (i / shared.length) * Math.PI * 2 - Math.PI / 2;
              const x = 130 + Math.cos(angle) * 70;
              const y = 110 + Math.sin(angle) * 70;
              return <Circle key={`c-${i}`} cx={x} cy={y} r={7} fill={colors.violetSoft} />;
            })}
          </Svg>
          <Text variant="title">Overlap {score}%</Text>
          <Text muted center style={{ marginTop: 8 }}>
            Shared picks: {shared.join(" · ")}
          </Text>
          <Text variant="caption" muted center style={{ marginTop: spacing.md }}>
            Differences are normal. This visualization only reflects your answers in this session.
          </Text>
          <Button
            label="Try again"
            variant="secondary"
            onPress={() => {
              setAnswers({});
              setDone(false);
            }}
            style={{ marginTop: spacing.lg, alignSelf: "stretch" }}
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: { marginTop: spacing.md, gap: spacing.sm },
  option: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  optionActive: {
    backgroundColor: colors.violet,
    borderColor: colors.violet,
  },
});
