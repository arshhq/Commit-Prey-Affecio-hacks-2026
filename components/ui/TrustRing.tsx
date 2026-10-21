import Svg, { Circle } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import { Text } from "./Text";

type Props = {
  value: number;
  label?: string;
  caption?: string;
  size?: number;
};

export function TrustRing({
  value,
  label = "Insights",
  caption,
  size = 180,
}: Props) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c * (1 - clamped / 100);
  const tone =
    clamped >= 70 ? colors.success : clamped >= 40 ? colors.cyan : colors.warning;

  return (
    <View style={styles.wrap} accessibilityLabel={`${label}: ${clamped} of 100`}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text variant="hero">{Math.round(clamped)}</Text>
        <Text variant="caption" muted>
          of 100 · {label}
        </Text>
        {caption ? (
          <Text variant="caption" color={tone} style={{ marginTop: 4 }}>
            {caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
});
