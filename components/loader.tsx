import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import COLORS from "@/constants/colors";

interface LoaderProps {
  size: number | "large" | "small" | undefined;
}

export default function Loader({ size = "large" }: LoaderProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size={size} color={COLORS.primary} />
    </View>
  );
}
