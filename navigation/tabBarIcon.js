import React from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import { scale } from "../utils/scale";

export function renderTabBarIcon(routeName, focused, color) {
  let iconName;

  switch (routeName) {
    case "Trang chủ":
      iconName = focused ? "home" : "home-outline";
      break;
    case "Giao dịch":
      iconName = focused ? "list" : "list-outline";
      break;
    case "Lịch sử":
      iconName = focused ? "book" : "book-outline";
      break;
    case "Tài khoản":
      iconName = focused ? "person" : "person-outline";
      break;
    default:
      iconName = "ellipse-outline";
  }

  return (
    <Ionicons
      name={iconName}
      size={scale(18)}
      color={color}
    />
  );
}
