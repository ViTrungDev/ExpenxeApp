import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { scale } from "../utils/scale";

export default function TabBarAddButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.container} 
    >
      <View style={styles.button}>
        <Ionicons name="add" size={scale(25)} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: "#2D74FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
