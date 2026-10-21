import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/constants/theme";
import { isValidEmail, nonEmpty } from "@/lib/validation";
import { useAuthStore } from "@/store/auth";

export default function SignInScreen() {
  const router = useRouter();
  const signInEmail = useAuthStore((s) => s.signInEmail);
  const enterDemo = useAuthStore((s) => s.enterDemo);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!isValidEmail(email)) {
      setError("Enter a valid email.");
      return;
    }
    if (!nonEmpty(password, 6)) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    const err = await signInEmail(email, password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginTop: spacing.lg }}>
        Welcome back
      </Text>
      <Text muted style={{ marginTop: 8 }}>
        Sign in with email. Without Supabase credentials, this enters demo mode.
      </Text>

      <View style={styles.form}>
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
        />
        <Input
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          error={error}
        />
        <Button label="Sign in" onPress={() => void submit()} loading={loading} />
        <Button
          label="Create account"
          variant="ghost"
          onPress={() => router.push("/(auth)/sign-up")}
        />
        <Button
          label="Skip — demo mode"
          variant="secondary"
          onPress={() => enterDemo()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
