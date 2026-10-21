import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth";

export { ErrorBoundary } from "expo-router";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
    primary: colors.violet,
  },
};

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const root = segments[0];
    const inAuth = root === "(auth)";
    if (!isAuthenticated && !inAuth) {
      router.replace("/(auth)/welcome");
    } else if (isAuthenticated && inAuth) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded]);

  return (
    <ThemeProvider value={navTheme}>
      <AuthGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="chat/[id]"
            options={{
              headerShown: true,
              title: "Message Guard",
              headerTintColor: colors.text,
              headerStyle: { backgroundColor: colors.bgElevated },
            }}
          />
          <Stack.Screen
            name="profile/[id]"
            options={{
              headerShown: true,
              title: "Profile",
              headerTintColor: colors.text,
              headerStyle: { backgroundColor: colors.bgElevated },
            }}
          />
          <Stack.Screen
            name="sandbox/[id]"
            options={{
              headerShown: true,
              title: "Trust Sandbox",
              headerTintColor: colors.text,
              headerStyle: { backgroundColor: colors.bgElevated },
            }}
          />
          <Stack.Screen
            name="privacy/index"
            options={{
              headerShown: true,
              title: "Privacy Shield",
              headerTintColor: colors.text,
              headerStyle: { backgroundColor: colors.bgElevated },
            }}
          />
          <Stack.Screen
            name="safe-meet/index"
            options={{
              headerShown: true,
              title: "Safe Meet",
              headerTintColor: colors.text,
              headerStyle: { backgroundColor: colors.bgElevated },
            }}
          />
          <Stack.Screen
            name="vibesync/index"
            options={{
              headerShown: true,
              title: "VibeSync",
              headerTintColor: colors.text,
              headerStyle: { backgroundColor: colors.bgElevated },
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthGate>
    </ThemeProvider>
  );
}
