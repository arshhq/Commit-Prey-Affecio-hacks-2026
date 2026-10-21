import { Text as RNText, type TextProps, type TextStyle } from "react-native";
import { colors, typography } from "@/constants/theme";

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  muted?: boolean;
  center?: boolean;
};

export function Text({
  variant = "body",
  color,
  muted,
  center,
  style,
  ...rest
}: Props) {
  const base = typography[variant];
  const resolved: TextStyle = {
    ...base,
    color: color ?? (muted ? colors.textSecondary : colors.text),
    textAlign: center ? "center" : undefined,
  };
  return <RNText {...rest} style={[resolved, style]} />;
}
