import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { TrustOrb } from "@/components/ui/TrustOrb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors, radii, spacing } from "@/constants/theme";
import { useAuthStore } from "@/store/auth";

const INSIGHTS = [
  {
    title: "Romance-scam scripts rising",
    body: "Affection → urgency → money is a common pattern in demo intel this week.",
    tone: "warning" as const,
  },
  {
    title: "Stay on-platform longer",
    body: "Keeping early chats in-app preserves reporting tools and Message Guard context.",
    tone: "cyan" as const,
  },
];

const ACTIVITY = [
  { title: "Scanned Alex conversation", detail: "High concern · money + urgency", time: "2m ago" },
  { title: "Viewed Linh verification", detail: "College still unconfirmed", time: "1h ago" },
  { title: "Sandbox: Too good to be true", detail: "2 safer choices practiced", time: "Yesterday" },
];

export default function HomeScreen() {
  const router = useRouter();
  const name = useAuthStore((s) => s.displayName);
  const demo = useAuthStore((s) => s.demoSession);

  return (
    <Screen scroll>
      <View style={styles.top}>
        <View>
          <Text variant="micro" color={colors.violetSoft}>
            TRUSTLENS
          </Text>
          <Text variant="caption" muted style={{ marginTop: 4 }}>
            Hi {name}
            {demo ? " · Demo" : ""}
          </Text>
        </View>
        {demo ? <Badge label="DEMO" tone="cyan" /> : null}
      </View>

      <View style={styles.hero}>
        <TrustOrb state="idle" size={132} label="Ready when you are" />
        <Text variant="hero" center style={{ marginTop: spacing.md }}>
          Connection, with clarity.
        </Text>
        <Text center muted style={{ marginTop: spacing.sm, maxWidth: 420, alignSelf: "center" }}>
          Spot risky patterns early — without killing the vibe.
        </Text>
        <Button
          label="Analyze a conversation"
          size="lg"
          onPress={() => router.push("/chats")}
          style={{ marginTop: spacing.lg, alignSelf: "center" }}
        />
      </View>

      <View style={styles.shortcuts}>
        {[
          { label: "Discover", hint: "Profiles", href: "/discover" as const },
          { label: "Sandbox", hint: "Practice", href: "/trust" as const },
          { label: "Safe Meet", hint: "Plan", href: "/safe-meet" as const },
        ].map((item) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href)}
            style={styles.shortcut}
            accessibilityRole="button"
          >
            <Text variant="bodyStrong">{item.label}</Text>
            <Text variant="caption" muted>
              {item.hint}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text variant="subtitle" style={styles.section}>
        Safety insights
      </Text>
      <View style={styles.insightRow}>
        {INSIGHTS.map((item) => (
          <Card key={item.title} style={styles.insightCard}>
            <Badge label={item.tone === "warning" ? "WATCH" : "TIP"} tone={item.tone} />
            <Text variant="bodyStrong" style={{ marginTop: spacing.sm }}>
              {item.title}
            </Text>
            <Text variant="caption" muted style={{ marginTop: 4 }}>
              {item.body}
            </Text>
          </Card>
        ))}
      </View>

      <Text variant="subtitle" style={styles.section}>
        Recent activity
      </Text>
      <Card>
        {ACTIVITY.map((item, i) => (
          <View
            key={item.title}
            style={[styles.activity, i > 0 && styles.activityBorder]}
          >
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">{item.title}</Text>
              <Text variant="caption" muted>
                {item.detail}
              </Text>
            </View>
            <Text variant="micro" muted>
              {item.time}
            </Text>
          </View>
        ))}
      </Card>
      <Text variant="micro" muted style={{ marginTop: spacing.md }}>
        Insights and activity are fictional demo content for the hackathon walkthrough.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hero: {
    marginTop: spacing.xl,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  shortcuts: {
    marginTop: spacing.xl,
    flexDirection: "row",
    gap: spacing.sm,
  },
  shortcut: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  section: { marginTop: spacing.xl, marginBottom: spacing.sm },
  insightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  insightCard: {
    flexGrow: 1,
    flexBasis: 240,
  },
  activity: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  activityBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
