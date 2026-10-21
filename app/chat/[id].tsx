import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Avatar } from "@/components/profile/Avatar";
import { MessageGuardCard } from "@/components/safety/MessageGuardCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { DEMO_PROFILES } from "@/data/demo-profiles";
import { analyzeMessage } from "@/lib/safety-analysis";
import { colors, radii, spacing } from "@/constants/theme";
import { useChatStore } from "@/store/chat";

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversations = useChatStore((s) => s.conversations);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const lastAnalysis = useChatStore((s) => s.lastAnalysis);
  const dismissedWarning = useChatStore((s) => s.dismissedWarning);
  const setAnalysis = useChatStore((s) => s.setAnalysis);
  const dismissWarning = useChatStore((s) => s.dismissWarning);
  const [draft, setDraft] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [composerHint, setComposerHint] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversation = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );
  const profile = DEMO_PROFILES.find((p) => p.id === conversation?.profileId);

  if (!conversation || !profile) {
    return (
      <View style={styles.center}>
        <Text>Conversation not found.</Text>
      </View>
    );
  }

  const runAnalysis = async (messageId: string, text: string) => {
    setSelectedId(messageId);
    setLoading(true);
    setError(null);
    setProgress(12);
    const tick = setInterval(() => {
      setProgress((p) => Math.min(92, p + 18));
    }, 120);
    try {
      const result = await analyzeMessage(text);
      setAnalysis(result);
    } catch {
      setError("Couldn’t analyze that message. Try again.");
      setAnalysis(null);
    } finally {
      clearInterval(tick);
      setProgress(100);
      setLoading(false);
    }
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    appendMessage(conversation.id, {
      id: `local-${Date.now()}`,
      sender: "me",
      text,
      timestamp: "Now",
    });
    setDraft("");
    setComposerHint(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={88}
    >
      <View style={styles.header}>
        <Avatar
          name={profile.name}
          seed={profile.id}
          gradient={profile.photoGradient}
          size={36}
        />
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong">{profile.name}</Text>
          <Text variant="caption" muted>
            Tap a message · Message Guard
          </Text>
        </View>
        <Button
          label="Scan last"
          size="sm"
          variant="secondary"
          loading={loading}
          onPress={() => {
            const last = conversation.messages.at(-1);
            if (last) void runAnalysis(last.id, last.text);
          }}
        />
      </View>

      <FlatList
        data={conversation.messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text muted center>
            No messages yet.
          </Text>
        }
        renderItem={({ item }) => {
          const mine = item.sender === "me";
          const selected = selectedId === item.id;
          return (
            <Pressable
              onPress={() => void runAnalysis(item.id, item.text)}
              style={[
                styles.bubble,
                mine ? styles.mine : styles.theirs,
                selected && styles.selected,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Analyze message: ${item.text}`}
            >
              <Text color={mine ? "#fff" : colors.text}>{item.text}</Text>
              <Text
                variant="micro"
                color={mine ? "rgba(255,255,255,0.7)" : colors.textMuted}
                style={{ marginTop: 6 }}
              >
                {item.timestamp}
              </Text>
            </Pressable>
          );
        }}
      />

      {error ? (
        <Card style={styles.guard}>
          <Text color={colors.warning}>{error}</Text>
        </Card>
      ) : null}

      {(loading || (lastAnalysis && !dismissedWarning)) && (
        <View style={styles.guard}>
          <MessageGuardCard
            analyzing={loading}
            progress={progress}
            analysis={
              lastAnalysis ?? {
                riskLevel: "low",
                title: "",
                flags: [],
                suggestedReplies: [],
                limitations: "",
                source: "rules",
              }
            }
            onDismiss={dismissWarning}
            onUseReply={(reply) => {
              setDraft(reply);
              setComposerHint("Suggested reply loaded — review before sending.");
            }}
            onReport={() =>
              Alert.alert(
                "Report / Block",
                "Demo action recorded locally. In production this would notify moderation."
              )
            }
            onOpenDetails={() => setDetailsOpen(true)}
          />
        </View>
      )}

      <View style={styles.composer}>
        {composerHint ? (
          <Text variant="caption" color={colors.cyan} style={{ marginBottom: 8 }}>
            {composerHint}
          </Text>
        ) : null}
        <Input
          value={draft}
          onChangeText={setDraft}
          placeholder="Write a reply…"
          multiline
        />
        <View style={styles.composerActions}>
          <Button
            label="Scan draft"
            variant="secondary"
            size="sm"
            loading={loading}
            onPress={() =>
              void runAnalysis("draft", draft || conversation.messages.at(-1)?.text || "")
            }
          />
          <Button label="Send" size="sm" onPress={send} />
        </View>
      </View>

      <Modal visible={detailsOpen && !!lastAnalysis} transparent animationType="slide">
        <Pressable style={styles.backdrop} onPress={() => setDetailsOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text variant="subtitle">Evidence & limits</Text>
            <Text muted style={{ marginTop: 8 }}>
              This check highlights patterns often seen in romance scams. It can false-positive on
              legitimate emergencies and miss novel tactics.
            </Text>
            {lastAnalysis?.flags.map((f, i) => (
              <View key={`${f.type}-${i}`} style={styles.detailFlag}>
                <Text variant="bodyStrong">{f.type.replace(/_/g, " ")}</Text>
                <Text variant="caption" muted style={{ marginTop: 4 }}>
                  Evidence: “{f.evidence}”
                </Text>
                <Text variant="caption" style={{ marginTop: 4 }}>
                  Safer alternative: stay on-app, refuse money/codes, verify via live video.
                </Text>
              </View>
            ))}
            <Button
              label="Close"
              variant="secondary"
              onPress={() => setDetailsOpen(false)}
              style={{ marginTop: spacing.lg }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  bubble: {
    maxWidth: "82%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
  },
  mine: { alignSelf: "flex-end", backgroundColor: colors.violet },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { borderWidth: 1, borderColor: colors.cyan },
  guard: {
    paddingHorizontal: spacing.lg,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  composer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  composerActions: { flexDirection: "row", gap: spacing.sm },
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
    maxHeight: "80%",
  },
  detailFlag: {
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.bgElevated,
  },
});
