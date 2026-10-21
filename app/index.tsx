import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth";

export default function Index() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!hydrated) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/welcome" />;
}
