import React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import About from "../components/Dashboard/About/About";
import Home from "../components/Dashboard/Home/Home";
import Profile from "../components/Dashboard/Profile/Profile";
import RightDrawer from "../components/Dashboard/RightDrawer/RightDrawer";
import CustomDrawerIcon from "../components/Dashboard/RightDrawer/CustomDrawer";

const Tab = createBottomTabNavigator();

// function HomeTabs() {
//   return <RightDrawer />;
// }

const DashboardScreen = ({ navigation }) => {
  return <RightDrawer navigation={navigation} />;
};

export default DashboardScreen;
