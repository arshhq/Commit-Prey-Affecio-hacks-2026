import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/constants/theme";
import { getBackendStatus } from "@/lib/config";
import { useAuthStore } from "@/store/auth";
import { useSettingsStore } from "@/store/settings";

export default function SettingsScreen() {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);
  const demoSession = useAuthStore((s) => s.demoSession);
  const email = useAuthStore((s) => s.email);
  const resetPrivacy = useSettingsStore((s) => s.resetPrivacy);
  const backend = getBackendStatus();

  const deleteAccount = () => {
    Alert.alert(
      "Delete account data",
      demoSession
        ? "Demo mode: clears local session and privacy preferences on this device."
        : "Signs you out and clears local preferences. Server deletion needs Supabase policies you configure.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete local data",
          style: "destructive",
          onPress: () => {
            resetPrivacy();
            void signOut();
          },
        },
      ]
    );
  };

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginTop: spacing.md }}>
        Settings
      </Text>
      <Text muted style={{ marginTop: 6 }}>
        {email}
        {demoSession ? " · Demo session" : ""}
      </Text>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.row}>
          <Button label="Privacy Shield" size="sm" onPress={() => router.push("/privacy")} />
          <Button
            label="Safe Meet"
            size="sm"
            variant="secondary"
            onPress={() => router.push("/safe-meet")}
          />
          <Button
            label="VibeSync"
            size="sm"
            variant="secondary"
            onPress={() => router.push("/vibesync")}
          />
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text variant="subtitle">Backend status</Text>
        <Text muted style={{ marginTop: 8 }}>
          Supabase auth: {backend.supabaseAuth === "configured" ? "connected" : "not set (demo auth)"}
        </Text>
        <Text muted style={{ marginTop: 4 }}>
          AI proxy: {backend.aiProxy === "configured" ? "configured" : "not set (on-device rules)"}
        </Text>
        <Text muted style={{ marginTop: 4 }}>
          Offline demo: available · API keys never stored in the app
        </Text>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text variant="subtitle">Data & consent</Text>
        <Text muted style={{ marginTop: 8 }}>
          Analysis stays on-device unless you configure a backend. We do not claim live emergency
          services or real government ID verification.
        </Text>
        <View style={[styles.row, { marginTop: spacing.md }]}>
          <Button label="Sign out" size="sm" variant="ghost" onPress={() => void signOut()} />
          <Button label="Delete local data" size="sm" variant="danger" onPress={deleteAccount} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
