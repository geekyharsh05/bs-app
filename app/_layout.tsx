import SafeScreen from "@/components/safe-screen";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { checkAuth } from "@/utils/auth-helpers";
import { useAuthStore } from "@/store/auth-store";
import { useFonts } from "expo-font";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, token } = useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const isAuthPage = segments[0] === "(auth)";
    const isLoggedIn = !!user && !!token;

    if (!isAuthPage && !isLoggedIn) router.replace("/(auth)");
    else if (isAuthPage && isLoggedIn) router.replace("/(tabs)");
  }, [user, token, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </SafeScreen>
        <Toast />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
