import { Pressable, StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { colors, spacing } from "@/constants/theme";
import type { VerificationItem } from "@/types";

export function VerificationList({
  items,
  onSelect,
}: {
  items: VerificationItem[];
  onSelect?: (item: VerificationItem) => void;
}) {
  return (
    <Card>
      <Text variant="subtitle">Verification</Text>
      <Text variant="caption" muted style={{ marginTop: 4 }}>
        Green means demo-verified or confirmed in-app. Self-reported is not the same as verified.
      </Text>
      <View style={styles.list}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onSelect?.(item)}
            style={styles.row}
            accessibilityRole="button"
            accessibilityLabel={`${item.label}: ${item.status}`}
          >
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">{item.label}</Text>
              {item.demoOnly ? (
                <Text variant="micro" color={colors.cyan}>
                  Simulated in demo mode
                </Text>
              ) : null}
            </View>
            <Badge
              label={
                item.status === "verified"
                  ? "Verified"
                  : item.status === "self_reported"
                    ? "Self-reported"
                    : "Unverified"
              }
              tone={
                item.status === "verified"
                  ? "success"
                  : item.status === "self_reported"
                    ? "neutral"
                    : "warning"
              }
            />
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: spacing.md, gap: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
