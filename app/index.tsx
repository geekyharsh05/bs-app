import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
      <Image></Image>
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
