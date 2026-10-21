import { StyleSheet, View } from "react-native";
import { Avatar } from "@/components/profile/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { colors, spacing } from "@/constants/theme";
import type { DemoProfile } from "@/types";

export function ProfileHero({ profile }: { profile: DemoProfile }) {
  return (
    <View style={styles.wrap}>
      <Avatar
        name={profile.name}
        seed={profile.id}
        gradient={profile.photoGradient}
        size={88}
      />
      <View style={styles.meta}>
        <Text variant="title">
          {profile.name}, {profile.age}
        </Text>
        <Text muted>{profile.city} · approximate area</Text>
        <Text style={{ marginTop: spacing.sm }}>{profile.bio}</Text>
        <View style={styles.tags}>
          {profile.interests.map((tag) => (
            <Badge key={tag} label={tag} tone="violet" />
          ))}
        </View>
        <Text variant="micro" color={colors.cyan} style={{ marginTop: spacing.sm }}>
          Demo profile · not a live identity check
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  meta: { flex: 1, minWidth: 0 },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: spacing.md,
  },
});
