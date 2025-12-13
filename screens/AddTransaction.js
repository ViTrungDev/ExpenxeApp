import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AddTransaction() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thêm thu / chi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
  },
});
