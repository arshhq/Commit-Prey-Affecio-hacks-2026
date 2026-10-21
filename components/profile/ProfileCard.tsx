import { Pressable, StyleSheet, View } from "react-native";
import { Avatar } from "@/components/profile/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { colors, radii, spacing } from "@/constants/theme";
import type { DemoProfile } from "@/types";

export function ProfileCard({
  profile,
  onPress,
}: {
  profile: DemoProfile;
  onPress?: () => void;
}) {
  const verified = profile.verifications.filter((v) => v.status === "verified").length;
  const unverified = profile.verifications.filter((v) => v.status === "unverified").length;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${profile.name}`}
    >
      <Avatar
        name={profile.name}
        seed={profile.id}
        gradient={profile.photoGradient}
        size={64}
      />
      <View style={styles.meta}>
        <Text variant="subtitle">
          {profile.name}, {profile.age}
        </Text>
        <Text variant="caption" muted>
          {profile.city} · approx. area
        </Text>
        <Text numberOfLines={2} style={{ marginTop: 6 }}>
          {profile.bio}
        </Text>
        <View style={styles.tags}>
          {profile.interests.slice(0, 3).map((tag) => (
            <Badge key={tag} label={tag} tone="violet" />
          ))}
        </View>
        <View style={styles.tags}>
          <Badge label={`${verified} demo-verified`} tone="success" />
          {unverified > 0 ? (
            <Badge label={`${unverified} unconfirmed`} tone="warning" />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  meta: { flex: 1, minWidth: 0 },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: spacing.sm,
  },
});
