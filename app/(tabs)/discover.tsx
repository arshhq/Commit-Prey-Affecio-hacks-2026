import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { DEMO_PROFILES } from "@/data/demo-profiles";
import { spacing } from "@/constants/theme";

export default function DiscoverScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginTop: spacing.md }}>
        Discover
      </Text>
      <Text muted style={{ marginTop: 6, maxWidth: 520 }}>
        Browse demo profiles. Verification badges are simulated — tap through to see evidence and limits.
      </Text>

      <View style={styles.list}>
        {DEMO_PROFILES.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onPress={() => router.push(`/profile/${profile.id}`)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: spacing.lg, gap: spacing.sm },
});
