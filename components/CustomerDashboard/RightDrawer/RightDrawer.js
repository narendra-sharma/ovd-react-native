import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  StatusBar,
} from "react-native";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiLogout, handlererrors } from "../../../apis/auth";
import CompanyStackScreen from "../Companies/CompanyStackScreen";
import ProfileStackScreen from "../Profile/ProfileStackScreen";
import { useFocusEffect } from "@react-navigation/native";
import ChangePassword from "../Settings/ChangePassword";
import { ScrollView } from "react-native-gesture-handler";
import ViewProjects from "../Companies/Projects/ViewProjects";
import ViewQuotes from "../Companies/Quotes/ViewQuotes";
import ConsultantStack from "../Companies/Users/Consultants/ConsultantStack";
import ContractorStack from "../Companies/Users/Contractors/ContractorStack";
import CustomerStack from "../Companies/Users/Customers/CustomerStack";
import TagsStackScreen from "../Companies/Tags/TagsStackScreen";
import HomeStackScreen from "../Home/HomeStackScreen";
import { useCustomActiveScreenStatus } from "../../../Contexts/ActiveScreenContext";

const Drawer = createDrawerNavigator();

const RightDrawer = ({ navigation }) => {
  // const [userData, setUserData] = useState({ name: "", email: "" });
  const [userData, setUserData] = useState({});
  const [isCompaniesSubMenuOpen, setIsCompaniesSubMenuOpen] = useState(false);
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);
  const [activeScreenName, setActiveScreenName] = useState("Home");
  // const [isManageCompaniesActive, setIsManageCompaniesActive] = useState(false);

  const handleLogout = () => {
    const logout = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await apiLogout(JSON.parse(token));
        console.log(res);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("profile");
        navigation.navigate("Login");
      } catch (err) {
        console.log("Logout Error",err);
        handlererrors(err,navigation);
        console.log("Logout Error",err.message);
      }
    };

    Alert.alert(`Logout`, `Are you sure you want to logout?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => logout() },
    ]);
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
          handlererrors(err,navigation);
        }
      };

      getData();
      return () => {
        isActive = false;
      };
    }, [userData])
  );

  const { activeScreen, setActiveScreen } = useCustomActiveScreenStatus();

  return (
    <Drawer.Navigator
      hideStatusBarOnOpen={true}
      initialRouteName="Home"
      drawerContent={(props) => {
        return (
          <ScrollView
            style={{
              display: "flex",
              height: "100%",
            }}
            contentContainerStyle={{
              justifyContent: "space-between",
            }}
          >
            {/* <ScrollView> */}
            <StatusBar style="auto" />
            <View>
              {/* User Details Section */}
              <Pressable
                style={styles.detailsContainer}
                onPress={() => {
                  navigation.navigate("Profile");
                }}
              >
                <View style={styles.innerContainer}>
                  <Icon
                    style={{ color: "#ffff", fontSize: 40 }}
                    // style={styles.drawerIcon}
                    name="user-circle-o"
                    size={35}
                  />
                  <View>
                    <Text
                      style={{ fontSize: 14, marginLeft: 8, color: "#ffff" }}
                    >
                      {userData?.name}
                    </Text>
                    <Text
                      style={{ fontSize: 15, marginLeft: 8, color: "#ffff" }}
                    >
                      {userData?.email}
                    </Text>
                  </View>
                </View>
              </Pressable>

              <ScrollView>
                {/* Custom Home */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("Home");
                    setActiveScreen("Home");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreen == "Home" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="home"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>Home</Text>
                </Pressable> */}

                {/* Accounts/Users Sub-Menu */}
                {/* <Pressable
                  onPress={() => {
                    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
                    setIsCompaniesSubMenuOpen(false);
                  }}
                  style={styles.subMenuButton}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="people"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>
                    Users{" "}
                    {isUsersSubMenuOpen ? (
                      <Icon
                        style={{ marginLeft: 8 }}
                        name="angle-up"
                        size={16}
                      />
                    ) : (
                      <Icon
                        style={{ marginLeft: 8 }}
                        name="angle-down"
                        size={16}
                      />
                    )}
                  </Text>
                </Pressable> */}
                {/* {isUsersSubMenuOpen && (
                  <View>
                    <View>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Contractors");
                          setActiveScreen("Contractors");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreen == "Contractors" && styles.activeSubMenu,
                        ]}
                      >
                        <Text style={styles.menuItemText}>Contractors</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Customers");
                          setActiveScreen("Customers");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreen == "Customers" && styles.activeSubMenu,
                        ]}
                      >
                        <Text style={styles.menuItemText}>Customers</Text>
                      </Pressable>
                    </View>
                  </View>
                )} */}

                {/* Custom Companies */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("Manage Companies");
                    setActiveScreen("Manage Companies");
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreen == "Manage Companies" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="admin-panel-settings"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>All Companies</Text>
                </Pressable> */}

                {/* Custom Quotes Link */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("Quotes");
                    setActiveScreen("Quotes");
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreen == "Quotes" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="request-quote"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>All Quotes</Text>
                </Pressable> */}

                {/* Custom Projects */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("Projects");
                    setActiveScreen("Projects");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreen == "Projects" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="view-sidebar"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>All Projects</Text>
                </Pressable> */}

                {/* Custom Profile */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("Profile");
                    setActiveScreen("Profile");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreen == "Profile" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="view-sidebar"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>Profile</Text>
                </Pressable> */}

                {/* Custom Tags */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("All Tags");
                    setActiveScreen("All Tags");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreen == "All Tags" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="view-sidebar"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>All Tags</Text>
                </Pressable> */}

                {/* Custom Commissions */}
                {/* <Pressable
                  onPress={() => {
                    props.navigation.navigate("All Commissions");
                    setActiveScreen("All Commissions");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreen == "All Commissions" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="view-sidebar"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>All Commissions</Text>
                </Pressable> */}

                {/* Custom Change Password */}
                {/* <Pressable
                  onPress={() => {
                    setActiveScreen("Change Password");
                    props.navigation.navigate("Change Password");
                    setIsCompaniesSubMenuOpen(false);
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreen == "Change Password" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="settings"
                    size={30}
                  />
                  <Text style={styles.menuItemText}>Change Password</Text>
                </Pressable> */}

                <DrawerItemList
                  {...props}
                  onItemPress={({ route }) => {
                    if (route.name !== "Manage Companies") {
                      setIsManageCompaniesActive(false);
                    }
                    props.navigation.navigate(route.name);
                  }}
                />
              </ScrollView>
            </View>
            <View
              style={{
                display: "flex",
                width: "90%",
                marginLeft: 10,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Icon style={{ color: "#ffff" }} name="sign-out" size={30} />
                <Text style={{ color: "#ffff", fontWeight: "600" }}>
                  Logout
                </Text>
              </Pressable>
            </View>

            {/* </ScrollView> */}
          </ScrollView>
        );
      }}
    >
      {/* Home Screen */}
      <Drawer.Screen
        name="Home"
        initialParams={{ resetStack: true }}
        options={{
          drawerIcon: () => (
            <MaterialIcons style={styles.drawerIcon} name="home" size={30} />
          ),
          // drawerItemStyle: { display: "none" },
          headerShown: false,
        }}
        component={HomeStackScreen}
      />

      {/* Project Screens */}
      <Drawer.Screen
        name="Projects"
        component={ViewProjects}
        initialParams={{ homeFlag: false }}
        options={({ navigation }) => ({
          drawerIcon: () => (
            <MaterialIcons
              style={styles.drawerIcon}
              name="account-tree"
              size={30}
            />
          ),
          title: "My Projects",
          headerShown: false,
        })}
      />

      {/* Profile Stack */}
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon style={styles.drawerIcon} name="user" size={30} />
          ),
          title: "Profile",
          headerShown: false,
        }}
        name="Profile"
        component={ProfileStackScreen}
      />

      {/* Tags Screens */}
      {/* <Drawer.Screen
        name="All Tags"
        component={TagsStackScreen}
        options={({ navigation }) => ({
          title: "My Tags",
          headerShown: false,
        })}
      /> */}

      {/* Change Password */}
      <Drawer.Screen
        options={({ navigation }) => ({
          drawerIcon: () => (
            <MaterialIcons
              style={styles.drawerIcon}
              name="settings"
              size={30}
            />
          ),
          title: "Change Password",
          // headerShown: false,
        })}
        name="Change Password"
        component={ChangePassword}
      />
    </Drawer.Navigator>
  );
};

export default RightDrawer;

const styles = StyleSheet.create({
  detailsContainer: {
    height: 140,
    width: "100%",
    backgroundColor: "#696cff",
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
    maxWidth: "100%",
  },

  subMenuButton: {
    height: 50,
    // justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    borderRadius: 4,
    padding: 10,
  },

  subMenuItem: {
    height: 50,
    // justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    borderRadius: 4,
    padding: 8,
    paddingLeft: 48,
  },

  activeSubMenu: {
    backgroundColor: "#DAE4FF", // Add your desired active background color
    transition: "0.2s",
  },

  menuItemText: {
    fontSize: 15,
    paddingLeft: 12,
  },

  drawerIcon: {
    padding: 4,
    marginRight: 4,
    fontSize: 28,
  },

  textStyle: {
    marginLeft: 8,
  },

  settingsButton: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "#B76E79",
    borderRadius: 5,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },

  logoutButton: {
    height: 45,
    backgroundColor: "#696cff",
    borderRadius: 5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
});
