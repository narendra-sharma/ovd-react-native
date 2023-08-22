import React, { useState, useEffect } from "react";
import About from "../components/Dashboard/About/About";
import Home from "../components/Dashboard/Home/Home";
import Profile from "../components/Dashboard/Profile/Profile";
import RightDrawer from "../components/Dashboard/RightDrawer/RightDrawer";
import CustomDrawerIcon from "../components/Dashboard/RightDrawer/CustomDrawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({ name: "", email: "" });

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const user = await AsyncStorage.getItem("async");
  //       const parsedUser = JSON.parse(user);
  //       setUserData({ ...userData, ...parsedUser });
  //       console.log(parsedUser);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getUserData();
  //   console.log(userData);
  // }, []);

  return <RightDrawer navigation={navigation} userData={userData} />;
};

export default DashboardScreen;
