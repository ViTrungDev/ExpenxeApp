import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/HomeScreen";
import Transactions from "../screens/Transactions";
import Memories from "../screens/Memories";
import Accounts from "../screens/Accounts";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="Memories" component={Memories} />
      <Tab.Screen name="Accounts" component={Accounts} />
    </Tab.Navigator>
  );
}
