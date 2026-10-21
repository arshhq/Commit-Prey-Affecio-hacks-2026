import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { TrustOrb } from "@/components/ui/TrustOrb";
import { colors, spacing } from "@/constants/theme";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";

export default function WelcomeScreen() {
  const router = useRouter();
  const enterDemo = useAuthStore((s) => s.enterDemo);

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <TrustOrb state="idle" size={120} label="Trust before connection" />
        <Text variant="hero" center style={{ marginTop: spacing.lg }}>
          TrustLens
        </Text>
        <Text
          variant="subtitle"
          center
          color={colors.violetSoft}
          style={{ marginTop: 8 }}
        >
          Same vibes. Less risks. More real.
        </Text>
        <Text center muted style={{ marginTop: spacing.md, maxWidth: 420 }}>
          A privacy-first safety layer for dating — Message Guard, verification clarity, and practice scenarios.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="Continue with email"
          size="lg"
          onPress={() => router.push("/(auth)/sign-in")}
          style={{ alignSelf: "center" }}
        />
        <Button
          label="Enter demo mode"
          variant="secondary"
          size="lg"
          onPress={() => enterDemo("You")}
          style={{ marginTop: spacing.sm, alignSelf: "center" }}
        />
        <Text variant="caption" center muted style={{ marginTop: spacing.md }}>
          {isSupabaseConfigured
            ? "Supabase Auth is configured."
            : "No backend credentials — demo mode works fully offline."}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.xxl,
    minHeight: 360,
  },
  actions: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
});
