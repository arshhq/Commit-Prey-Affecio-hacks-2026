import { ScrollView, StyleSheet, View, type ViewProps, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, layout, spacing } from "@/constants/theme";

type Props = ViewProps & {
  scroll?: boolean;
  padded?: boolean;
};

export function Screen({
  scroll,
  padded = true,
  style,
  children,
  ...rest
}: Props) {
  const { width } = useWindowDimensions();
  const outerPad = Math.max(layout.contentPad, Math.min(32, (width - layout.maxWidth) / 2));

  const body = (
    <View
      style={[
        styles.shell,
        padded && { paddingHorizontal: Math.min(outerPad, layout.contentPad + 8) },
        style,
      ]}
      {...rest}
    >
      <View style={styles.inner}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  shell: {
    width: "100%",
    alignItems: "center",
  },
  inner: {
    width: "100%",
    maxWidth: layout.maxWidth,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
});
