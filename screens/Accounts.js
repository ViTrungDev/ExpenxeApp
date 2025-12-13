import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AccountsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accounts Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F6FA",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
