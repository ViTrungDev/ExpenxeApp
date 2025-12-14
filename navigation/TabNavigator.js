import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { renderTabBarIcon } from "./tabBarIcon";
import { scale } from "../utils/scale";
import TabBarAddButton from "../components/TabBarAddButton";

import Dashboard from "../screens/HomeScreen";
import Transactions from "../screens/Transactions";
import AddTransaction from "../screens/AddTransaction";
import Memories from "../screens/Memories";
import Accounts from "../screens/Accounts";

const Tab = createBottomTabNavigator();
const renderAddButton = (props) => <TabBarAddButton {...props} />;

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: scale(50),
          paddingBottom: scale(8),
          paddingTop: scale(6),
        },
        tabBarActiveTintColor: "#2D74FF",
        tabBarInactiveTintColor: "#999",
        tabBarIcon: ({ focused, color }) =>
          renderTabBarIcon(route.name, focused, color),
      })}
    >
      <Tab.Screen name="Trang chủ" component={Dashboard} />
      <Tab.Screen name="Giao dịch" component={Transactions} />

      <Tab.Screen
        name="Thêm"
        component={AddTransaction}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => null,
          tabBarButton: renderAddButton,
        }}
      />

      <Tab.Screen name="Lịch sử" component={Memories} />
      <Tab.Screen name="Tài khoản" component={Accounts} />
    </Tab.Navigator>
  );
}
