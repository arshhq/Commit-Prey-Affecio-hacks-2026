import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { colors, spacing } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops" }} />
      <View style={styles.container}>
        <Text variant="title">Screen not found</Text>
        <Link href="/" style={styles.link}>
          <Text color={colors.violetSoft}>Go home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    padding: spacing.lg,
  },
  link: { marginTop: spacing.md },
});
