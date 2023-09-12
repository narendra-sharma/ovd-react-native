import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import SupplierProfile from "../SupplierProfile.js/SupplierProfile";
import CompanyStackScreen from "../Companies/CompanyStackScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiLogout } from "../../../apis/auth";
import { useFocusEffect } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const RightDrawer = () => {
  // const [userData, setUserData] = useState({ name: "", email: "" });
  const [userData, setUserData] = useState({});

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await apiLogout(JSON.parse(token));
      console.log(res);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("profile");
      navigation.navigate("Login");
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const getData = async () => {
        try {
          const user = await AsyncStorage.getItem("profile");
          const parsedUser = JSON.parse(user);
          setUserData({ ...userData, ...parsedUser });
          // console.log("we at local storage: ", userData);
        } catch (err) {
          console.log(err);
        }
      };

      getData();
      return () => {
        isActive = false;
      };
    }, [userData])
  );
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => {
        return (
          <SafeAreaView
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <View>
              <View style={styles.detailsContainer}>
                <View style={styles.innerContainer}>
                  <Icon name="user-circle-o" size={35} />
                  <View>
                    <Text style={styles.textStyle}>{userData?.name}</Text>
                    <Text style={styles.textStyle}>{userData?.email}</Text>
                  </View>
                </View>
              </View>
              <DrawerItemList {...props} />
            </View>

            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 50,
              }}
            >
              {/* <Pressable style={styles.settingsButton}>
                <MaterialIcons name="settings" size={20} color="#B76E79" />
                <Text style={{ color: "#B76E79" }}>Settings</Text>
              </Pressable> */}
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="sign-out" size={28} />
                <Text>Logout</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        );
      }}
    >
      <Drawer.Screen name="My Profile" component={SupplierProfile} />
      <Drawer.Screen
        name="Companies"
        component={CompanyStackScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
    </Drawer.Navigator>
  );
};

export default RightDrawer;

const styles = StyleSheet.create({
  detailsContainer: {
    height: 140,
    width: "100%",
    backgroundColor: "#B76E79",
    marginBottom: 5,
    display: "flex",
    alignItems: "center",
  },

  innerContainer: {
    padding: 5,
    display: "flex",
    flexDirection: "row",
    height: "50%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 40,
    width: "90%",
  },

  textStyle: {
    marginLeft: 5,
  },

  settingsButton: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "#B76E79",
    borderRadius: 8,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },

  logoutButton: {
    height: 50,
    backgroundColor: "#B76E79",
    borderRadius: 8,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    display: "flex",
    flexDirection: "row",
  },
});
