import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/Text";
import { colors } from "@/constants/theme";

type Props = {
  name: string;
  seed: string;
  gradient: [string, string];
  size?: number;
};

export function Avatar({ name, seed, gradient, size = 56 }: Props) {
  const [failed, setFailed] = useState(false);
  const uri = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
      {!failed ? (
        <Image
          source={{ uri }}
          style={{ width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }}
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <LinearGradient
          colors={gradient}
          style={{
            width: size - 4,
            height: size - 4,
            borderRadius: (size - 4) / 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="subtitle" color="#fff">
            {name[0]}
          </Text>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(155,92,255,0.45)",
    backgroundColor: colors.surfaceHigh,
    overflow: "hidden",
  },
});
