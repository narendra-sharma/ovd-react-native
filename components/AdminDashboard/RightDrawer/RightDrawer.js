import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
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
import Home from "../Home/Home";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiLogout } from "../../../apis/auth";
import CompanyStackScreen from "../Companies/CompanyStackScreen";
import ProfileStackScreen from "../Profile/ProfileStackScreen";
import { useFocusEffect } from "@react-navigation/native";
import ChangePassword from "../Settings/ChangePassword";
import AccountsStackScreen from "../Accounts/AccountsStackScreen";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import ViewProjects from "../Companies/Projects/ViewProjects";
import ViewQuotes from "../Companies/Quotes/ViewQuotes";
import AddProject from "../Companies/Projects/AddProject";
import ConsultantManagerStack from "../Companies/Users/ConsultantManagers/ConsultantManagerStack";
import ConsultantStack from "../Companies/Users/Consultants/ConsultantStack";
import ContractorStack from "../Companies/Users/Contractors/ContractorStack";
import CustomerStack from "../Companies/Users/Customers/CustomerStack";
import EditQuote from "../Companies/Quotes/EditQuote";
import TasksStackScreen from "../Companies/Tasks/TasksStackScreen";

const Drawer = createDrawerNavigator();

const RightDrawer = ({ navigation }) => {
  // const [userData, setUserData] = useState({ name: "", email: "" });
  const [userData, setUserData] = useState({});
  const [isCompaniesSubMenuOpen, setIsCompaniesSubMenuOpen] = useState(false);
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);
  const [activeScreenName, setActiveScreenName] = useState("Home");
  // const [isManageCompaniesActive, setIsManageCompaniesActive] = useState(false);

  const route = useRoute();
  // console.log(route.name);

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
        console.log(err);
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
        }
      };

      // switch (activeScreenName) {
      //   case "Manage Companies":
      //     setIsUsersSubMenuOpen(false);
      //     return;
      //   case "Accounts":
      //     setIsCompaniesSubMenuOpen(false);
      //     return;
      //   default:
      //     setIsCompaniesSubMenuOpen(false);
      //     setIsUsersSubMenuOpen(false);
      //     return;
      // }

      getData();
      return () => {
        isActive = false;
      };
    }, [userData])
  );

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const user = await AsyncStorage.getItem("profile");
  //       const parsedUser = JSON.parse(user);
  //       setUserData({ ...userData, ...parsedUser });
  //       // console.log(userData);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   getData();
  // }, [navigation]);

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
                  <Icon style={{color: "#ffff", fontSize: 40}}
                    // style={styles.drawerIcon}
                    name="user-circle-o"
                    size={35}
                  />
                  <View>
                    <Text style={{ fontSize: 14
                    , marginLeft: 8, color: "#ffff" }}>{userData?.name}</Text>
                    <Text style={{ fontSize: 15, marginLeft: 8, color: "#ffff" }}>
                      {userData?.email}
                    </Text>
                  </View>
                </View>
              </Pressable>

              <ScrollView>
                {/* Custom Home */}
                <Pressable
                  onPress={() => {
                    props.navigation.navigate("Home");
                    setActiveScreenName("Home");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Home" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="home"
                    size={28}
                  />
                  {/* <Icon name="home" size={28} /> */}
                  <Text>Home</Text>
                </Pressable>

                {/* Accounts/Users Sub-Menu */}
                <Pressable
                  onPress={() => {
                    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
                    setIsCompaniesSubMenuOpen(false);
                  }}
                  style={styles.subMenuButton}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="people"
                    size={28}
                  />
                  <Text>
                    Manage Users{" "}
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
                </Pressable>
                {isUsersSubMenuOpen && (
                  <View>
                    <View>
                      {/* Render sub-menu items */}
                      {/* <Pressable
                        onPress={() => {
                          setActiveScreenName("Accounts");
                          props.navigation.navigate("Accounts");
                          // setIsManageCompaniesActive(true);
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Accounts" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>All Accounts</Text>
                      </Pressable> */}
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Consultant Managers");
                          setActiveScreenName("Consultant Managers");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Consultant Managers" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>Consultant Managers</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Consultants");
                          setActiveScreenName("Consultants");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Consultants" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>Consultants</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Contractors");
                          setActiveScreenName("Contractors");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Contractors" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>Contractors</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          props.navigation.navigate("Customers");
                          setActiveScreenName("Customers");
                          // Handle sub-menu item click here
                        }}
                        style={[
                          styles.subMenuItem,
                          activeScreenName == "Customers" &&
                            styles.activeSubMenu,
                        ]}
                      >
                        <Text>Customers</Text>
                      </Pressable>
                      {/* Add more sub-menu items as needed */}
                    </View>
                  </View>
                )}

                {/* Custom Companies */}
                <Pressable
                  onPress={() => {
                    props.navigation.navigate("Manage Companies");
                    setActiveScreenName("Manage Companies");
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Manage Companies" &&
                      styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="admin-panel-settings"
                    size={28}
                  />
                  <Text>All Companies</Text>
                </Pressable>

                {/* Custom Quotes Link */}
                <Pressable
                  onPress={() => {
                    props.navigation.navigate("Quotes");
                    setActiveScreenName("Quotes");
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Quotes" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="request-quote"
                    size={28}
                  />
                  {/* <Icon name="home" size={28} /> */}
                  <Text>All Quotes</Text>
                </Pressable>

                {/* Custom Projects */}
                <Pressable
                  onPress={() => {
                    props.navigation.navigate("Projects");
                    setActiveScreenName("Projects");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Projects" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="view-sidebar"
                    size={28}
                  />
                  {/* <Icon name="home" size={28} /> */}
                  <Text>All Projects</Text>
                </Pressable>

                {/* Custom Tasks */}
                <Pressable
                  onPress={() => {
                    props.navigation.navigate("Tasks");
                    setActiveScreenName("Tasks");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Tasks" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="view-sidebar"
                    size={28}
                  />
                  {/* <Icon name="home" size={28} /> */}
                  <Text>All Tasks</Text>
                </Pressable>

                {/* Custom Profile */}
                {/* <Pressable
                  onPress={() => {
                    setActiveScreenName("Profile");
                    props.navigation.navigate("Profile");
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Profile" && styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="account-circle"
                    size={28}
                  />
                  <Text>Profile </Text>
                </Pressable> */}

                {/* Custom Change Password */}
                <Pressable
                  onPress={() => {
                    setActiveScreenName("Change Password");
                    props.navigation.navigate("Change Password");
                    setIsCompaniesSubMenuOpen(false);
                    // setIsHomeSubMenuOpen(!isHomeSubMenuOpen); // Toggle the sub-menu when Home is pressed
                  }}
                  style={[
                    styles.subMenuButton,
                    activeScreenName == "Change Password" &&
                      styles.activeSubMenu,
                  ]}
                >
                  <MaterialIcons
                    style={styles.drawerIcon}
                    name="settings"
                    size={28}
                  />
                  <Text>Change Password</Text>
                </Pressable>

                {/* <DrawerItemList
                {...props}
                onItemPress={({ route }) => {
                  if (route.name !== "Manage Companies") {
                    setIsManageCompaniesActive(false);
                  }
                  props.navigation.navigate(route.name);
                }}
              /> */}
              </ScrollView>
            </View>
            <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10
                  }}
                  >
                  <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Icon style={{color: "#ffff"}} name="sign-out" size={28} />
                    <Text style={{color: "#ffff"}}>Logout</Text>
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
        options={{
          drawerIcon: () => <Icon name="home" size={28} />,
          // drawerItemStyle: { display: "none" },
        }}
        component={Home}
      />

      {/* All Company Screens */}
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <MaterialIcons name="admin-panel-settings" size={28} />
          ),
          // headerTitle: () => <></>,
          headerShown: false,
          // drawerItemStyle: { display: "none" },
        }}
        name="Manage Companies"
        component={CompanyStackScreen}
      />

      {/*All Accounts/Users Screens */}
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="users" size={28} />,
          title: "Accounts",
          headerShown: false,
          // drawerItemStyle: { display: "none" },
        }}
        name="Accounts"
        component={AccountsStackScreen}
      />

      {/* Consultant Manager Screens */}
      <Drawer.Screen
        name="Consultant Managers"
        component={ConsultantManagerStack}
        options={({ navigation }) => ({
          title: "Consultant Managers",
          headerShown: false,
        })}
      />

      {/* Consultants Screens */}
      <Drawer.Screen
        name="Consultants"
        component={ConsultantStack}
        options={({ navigation }) => ({
          title: "Consultants",
          headerShown: false,
        })}
      />

      {/* Contractors Screens */}
      <Drawer.Screen
        name="Contractors"
        component={ContractorStack}
        options={({ navigation }) => ({
          title: "Contractors",
          headerShown: false,
        })}
      />

      {/* Customers Screens */}
      <Drawer.Screen
        name="Customers"
        component={CustomerStack}
        options={({ navigation }) => ({
          title: "Customers",
          headerShown: false,
        })}
      />

      {/* Profile Stack */}
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="user" size={28} />,
          title: "Profile",
          headerShown: false,
        }}
        name="Profile"
        component={ProfileStackScreen}
      />

      {/* Quotes Screens */}
      <Drawer.Screen
        name="Quotes"
        component={ViewQuotes}
        options={({ navigation }) => ({
          title: "All Quotes",
          headerShown: false,
        })}
      />

      {/* <Drawer.Screen
        name="Edit Quote"
        component={EditQuote}
        options={({ navigation }) => ({
          title: "Edit Quote",
          // headerShown: false,
        })}
      /> */}

      {/* Project Screens */}
      <Drawer.Screen
        name="Projects"
        component={ViewProjects}
        options={({ navigation }) => ({
          title: "My Projects",
          headerShown: false,
        })}
      />

      {/* Task Screens */}
      <Drawer.Screen
        name="Tasks"
        component={TasksStackScreen}
        options={({ navigation }) => ({
          title: "My Tasks",
          headerShown: false,
        })}
      />

      {/* Change Password */}
      <Drawer.Screen
        options={({ navigation }) => ({
          drawerIcon: () => <MaterialIcons name="settings" size={28} />,
          title: "Change Password",
          // headerShown: false,
        })}
        name="Change Password"
        component={ChangePassword}
      />
      {/* <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="user" size={28} />,
          title: isEditOn ? "Edit Profile Details" : "Profile",
        }}
        name="Profile"
        component={() => (
          <Profile isEditOn={isEditOn} setIsEditOn={setIsEditOn} />
        )}
      /> */}
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
    padding: 8,
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
    backgroundColor: "#E0E0E0", // Add your desired active background color
  },

  drawerIcon: {
    padding: 4,
    marginRight: 4,
    fontSize: 22,
  },

  textStyle: {
    marginLeft: 8,
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
    height: 40,
    backgroundColor: "#484848",
    borderRadius: 5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    display: "flex",
    flexDirection: "row",
  },
});
