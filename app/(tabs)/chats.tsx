import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar } from "@/components/profile/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { DEMO_PROFILES } from "@/data/demo-profiles";
import { colors, radii, spacing } from "@/constants/theme";
import { useChatStore } from "@/store/chat";

export default function ChatsScreen() {
  const router = useRouter();
  const conversations = useChatStore((s) => s.conversations);

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginTop: spacing.md }}>
        Chats
      </Text>
      <Text muted style={{ marginTop: 6, maxWidth: 480 }}>
        Open a thread, tap a message, and run Message Guard — start with Alex for the money-request demo.
      </Text>

      <View style={styles.list}>
        {conversations.map((c) => {
          const profile = DEMO_PROFILES.find((p) => p.id === c.profileId);
          if (!profile) return null;
          return (
            <Pressable
              key={c.id}
              onPress={() => router.push(`/chat/${c.id}`)}
              style={styles.row}
              accessibilityRole="button"
            >
              <Avatar
                name={profile.name}
                seed={profile.id}
                gradient={profile.photoGradient}
                size={48}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.top}>
                  <Text variant="bodyStrong">{profile.name}</Text>
                  {c.unread > 0 ? <Badge label={`${c.unread}`} tone="violet" /> : null}
                </View>
                <Text muted numberOfLines={1} style={{ marginTop: 4 }}>
                  {c.preview}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: spacing.lg, gap: spacing.sm },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
});
