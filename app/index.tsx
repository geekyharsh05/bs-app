import { useAuthStore } from "@/store/auth-store";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  const { user, token, checkAuth } = useAuthStore();
  console.log(user);
  console.log("Token", token)

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>

      <Link href="/(auth)/signup">Signup</Link>
      <Link href="/(auth)">Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "blue",
  },
});
