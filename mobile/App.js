import React from "react";
import { AppRegistry } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#020617" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// Explicit registration required in React Native 0.73+ with new architecture
AppRegistry.registerComponent("main", () => App);

export default App;
