import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { colors, layout } from "@/constants/theme";

function TabIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome name={name} size={20} color={color} style={{ marginBottom: -1 }} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.violetSoft,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.border,
          height: layout.tabBarHeight,
          paddingTop: 6,
          paddingBottom: Platform.OS === "web" ? 10 : 16,
          maxWidth: 720,
          width: "100%",
          alignSelf: "center",
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon name="home" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <TabIcon name="compass" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => <TabIcon name="comments" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="trust"
        options={{
          title: "Trust",
          tabBarIcon: ({ color }) => <TabIcon name="shield" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabIcon name="cog" color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
