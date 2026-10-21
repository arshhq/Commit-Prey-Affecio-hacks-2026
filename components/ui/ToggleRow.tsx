import { Pressable, StyleSheet, Switch, View } from "react-native";
import { colors, spacing } from "@/constants/theme";
import { Text } from "./Text";

type Props = {
  title: string;
  description?: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

export function ToggleRow({ title, description, value, onChange }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={styles.row}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={title}
    >
      <View style={styles.copy}>
        <Text variant="bodyStrong">{title}</Text>
        {description ? (
          <Text variant="caption" muted style={{ marginTop: 4 }}>
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#2A2B3A", true: colors.violet }}
        thumbColor="#fff"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  copy: { flex: 1 },
});
