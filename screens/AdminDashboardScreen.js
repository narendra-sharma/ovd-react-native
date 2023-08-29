import React, { useState, useEffect } from "react";
import RightDrawer from "../components/AdminDashboard/RightDrawer/RightDrawer";

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
