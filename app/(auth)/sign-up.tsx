import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/constants/theme";
import { isValidEmail, nonEmpty } from "@/lib/validation";
import { useAuthStore } from "@/store/auth";

export default function SignUpScreen() {
  const signUpEmail = useAuthStore((s) => s.signUpEmail);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!nonEmpty(name, 2)) {
      setError("Add a display name.");
      return;
    }
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
    const err = await signUpEmail(email, password, name);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginTop: spacing.lg }}>
        Create account
      </Text>
      <Text muted style={{ marginTop: 8 }}>
        Without Supabase, account creation opens demo mode so you can still explore the MVP.
      </Text>
      <View style={styles.form}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="Alex" />
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
        <Button label="Continue" onPress={() => void submit()} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: spacing.xl, gap: spacing.md },
});
