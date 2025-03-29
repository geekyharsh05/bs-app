import SafeScreen from "@/components/safe-screen";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <Toast />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
