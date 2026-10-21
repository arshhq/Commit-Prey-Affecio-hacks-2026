import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { VerificationList } from "@/components/profile/VerificationList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { CURRENT_USER, DEMO_PROFILES } from "@/data/demo-profiles";
import { colors, spacing } from "@/constants/theme";
import type { VerificationItem } from "@/types";

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile =
    id === "me" ? CURRENT_USER : DEMO_PROFILES.find((p) => p.id === id);
  const [selected, setSelected] = useState<VerificationItem | null>(null);

  if (!profile) {
    return (
      <Screen>
        <Text>Profile not found.</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ProfileHero profile={profile} />
      <View style={{ marginTop: spacing.lg }}>
        <VerificationList items={profile.verifications} onSelect={setSelected} />
      </View>
      <Card style={{ marginTop: spacing.md }}>
        <Text variant="subtitle">Limitations</Text>
        <Text muted style={{ marginTop: 8 }}>
          {profile.notes} TrustLens never pretends a real government ID check happened in demo mode.
        </Text>
      </Card>

      <Modal visible={!!selected} transparent animationType="slide">
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text variant="subtitle">{selected?.label}</Text>
            <Text muted style={{ marginTop: 8 }}>
              Status: {selected?.status}
            </Text>
            <Text style={{ marginTop: spacing.md }}>{selected?.detail}</Text>
            {selected?.demoOnly ? (
              <Text variant="caption" color={colors.cyan} style={{ marginTop: spacing.sm }}>
                Explicitly simulated for this hackathon demo.
              </Text>
            ) : null}
            <Button
              label="Close"
              variant="secondary"
              onPress={() => setSelected(null)}
              style={{ marginTop: spacing.lg }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surfaceHigh,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
