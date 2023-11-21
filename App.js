import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
import DashboardScreen from "./screens/AdminDashboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AuthScreen from "./screens/AuthScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import OtpInputScreen from "./screens/OtpInputScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import IntDesignDashScreen from "./screens/IntDesignDashScreen";
import SupplierStaffScreen from "./screens/SupplierStaffScreen";
import SalesManagerScreen from "./screens/SalesManagerScreen";
import CustomerScreen from "./screens/CustomerScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FirstLoginScreen from "./screens/FirstLoginScreen";
import { ActiveScreenProvider } from "./Contexts/ActiveScreenContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RootSiblingParent>
      <ActiveScreenProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Common Screens */}
            <Stack.Screen
              name="Login"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="First Login"
              component={FirstLoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Forgot Password"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OTP"
              component={OtpInputScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reset Password"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
            {/* Admin Stack */}
            <Stack.Screen
              name="Admin Dashboard"
              component={DashboardScreen}
              options={({ navigation }) => ({
                title: "Dashboard",
                headerShown: false,
              })}
            />
            {/* Interior Designer Stack */}
            <Stack.Screen
              name="Interior Designer Dashboard"
              component={IntDesignDashScreen}
              options={({ navigation }) => ({
                title: "Dashboard",
                headerShown: false,
              })}
            />
            {/* Sales Manager Stack */}
            <Stack.Screen
              name="Sales Manager Dashboard"
              component={SalesManagerScreen}
              options={({ navigation }) => ({
                title: "Dashboard",
                headerShown: false,
              })}
            />
            {/* Supplier Staff Stack */}
            <Stack.Screen
              name="Supplier Staff Dashboard"
              component={SupplierStaffScreen}
              options={({ navigation }) => ({
                title: "Dashboard",
                headerShown: false,
              })}
            />
            {/* Customer Stack */}
            <Stack.Screen
              name="Customer Dashboard"
              component={CustomerScreen}
              options={({ navigation }) => ({
                title: "Dashboard",
                headerShown: false,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ActiveScreenProvider>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
