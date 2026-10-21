import { StyleSheet, View } from "react-native";
import { Avatar } from "@/components/profile/Avatar";
import { CURRENT_USER } from "@/data/demo-profiles";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { ToggleRow } from "@/components/ui/ToggleRow";
import { colors, spacing } from "@/constants/theme";
import { useSettingsStore } from "@/store/settings";

export default function PrivacyScreen() {
  const privacy = useSettingsStore((s) => s.privacy);
  const setPrivacy = useSettingsStore((s) => s.setPrivacy);

  return (
    <Screen scroll>
      <Text muted style={{ maxWidth: 520 }}>
        Compact controls with a live preview of what others would see. Changes save on this device.
      </Text>

      <Card style={{ marginTop: spacing.lg }}>
        <ToggleRow
          title="Visible to everyone"
          description="Appear in Discover"
          value={privacy.visibleToEveryone}
          onChange={(visibleToEveryone) => setPrivacy({ visibleToEveryone })}
        />
        <ToggleRow
          title="Show approximate location"
          description="City-level only"
          value={privacy.showApproximateLocation}
          onChange={(showApproximateLocation) => setPrivacy({ showApproximateLocation })}
        />
        <ToggleRow
          title="Show college"
          description="Self-reported field"
          value={privacy.showCollege}
          onChange={(showCollege) => setPrivacy({ showCollege })}
        />
        <ToggleRow
          title="Screenshot notifications"
          description="Demo preference"
          value={privacy.screenshotNotifications}
          onChange={(screenshotNotifications) => setPrivacy({ screenshotNotifications })}
        />
        <ToggleRow
          title="Allow message requests"
          description="When off, matches only"
          value={privacy.allowMessageRequests}
          onChange={(allowMessageRequests) => setPrivacy({ allowMessageRequests })}
        />
      </Card>

      <Card elevated style={{ marginTop: spacing.lg }}>
        <Text variant="subtitle">Live preview</Text>
        <Text variant="caption" color={colors.cyan} style={{ marginTop: 4 }}>
          What others can see
        </Text>
        <View style={styles.preview}>
          <Avatar
            name={CURRENT_USER.name}
            seed={CURRENT_USER.id}
            gradient={CURRENT_USER.photoGradient}
            size={56}
          />
          <View style={{ flex: 1 }}>
            <Text variant="subtitle">
              {CURRENT_USER.name}, {CURRENT_USER.age}
            </Text>
            <Text muted>
              {privacy.showApproximateLocation ? CURRENT_USER.city : "Location hidden"}
            </Text>
          </View>
        </View>
        <Text style={{ marginTop: spacing.sm }}>{CURRENT_USER.bio}</Text>
        <View style={styles.tags}>
          {CURRENT_USER.interests.map((t) => (
            <Badge key={t} label={t} tone="violet" />
          ))}
          {privacy.showCollege ? <Badge label="College · self-reported" tone="neutral" /> : null}
        </View>
        <Text variant="caption" muted style={{ marginTop: spacing.md }}>
          {privacy.visibleToEveryone ? "Discoverable" : "Hidden from Explore"} ·{" "}
          {privacy.allowMessageRequests ? "Open to requests" : "Matches only"}
        </Text>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text variant="subtitle">Consent & retention</Text>
        <Text muted style={{ marginTop: 8 }}>
          Preferences persist in AsyncStorage. Delete local account data from Settings to clear them.
          No silent cloud sync unless you configure Supabase.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
    alignItems: "center",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: spacing.md,
  },
});
