import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { colors, radii, spacing } from "@/constants/theme";
import { Text } from "./Text";

type Props = TextInputProps & {
  label?: string;
  error?: string | null;
};

export function Input({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text variant="caption" muted style={{ marginBottom: 8 }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        {...rest}
        style={[styles.input, style]}
      />
      {error ? (
        <Text variant="caption" color={colors.warning} style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
  },
});
