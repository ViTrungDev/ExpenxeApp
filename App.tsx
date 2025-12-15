import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";

import { useEffect } from "react";
import { testGetData } from "./__tests__/getData.test";


export default function App() {
  const isDarkMode = useColorScheme() === "dark";

    useEffect(() => {
    testGetData(); 
  }, []);
  
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
      
    </SafeAreaProvider>
  );
}
