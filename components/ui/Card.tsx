import { StyleSheet, View, type ViewProps } from "react-native";
import { colors, radii, spacing } from "@/constants/theme";

type Props = ViewProps & {
  elevated?: boolean;
  padded?: boolean;
};

export function Card({
  elevated,
  padded = true,
  style,
  children,
  ...rest
}: Props) {
  return (
    <View
      {...rest}
      style={[
        styles.card,
        elevated && styles.elevated,
        padded && { padding: spacing.md },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.surfaceHigh,
  },
});
