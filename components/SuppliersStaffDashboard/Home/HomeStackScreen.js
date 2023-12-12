import react, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import Home from "./Home";
import ViewProjects from "../Companies/Projects/ViewProjects";
import DashboardProjects from "./DashboardProjects";
import EditProject from "../Companies/Projects/EditProject";
import ProjectDetail from "../Companies/Projects/ProjectDetail";
import DashboardTasks from "./DashboardTasks";
import { useCustomActiveScreenStatus } from "../../../Contexts/ActiveScreenContext";
import { useIsFocused } from "@react-navigation/native";
import AddProject from "../Companies/Projects/AddProject";

const Stack = createNativeStackNavigator();

const HomeStackScreen = ({ navigation, route }) => {
  const [shouldReset, setShouldReset] = useState(false);

  useEffect(() => {
    if (route?.params?.resetStack) {
      setShouldReset(true);
    }
  }, [route?.params?.resetStack]);

  // console.log("reset stack", route?.params?.resetStack);

  const isFocused = useIsFocused();
  const { setActiveScreen } = useCustomActiveScreenStatus();

  useEffect(() => {
    if (isFocused) {
      const screenState = navigation.getState().routes[0].name;
      setActiveScreen(screenState);
      console.log("screenState: ", screenState);
    }
  }, []);

  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen
        name="Dashboard"
        component={Home}
        options={({ navigation }) => ({
          headerLeft: () => (
            <Icon
              onPress={() => navigation.toggleDrawer()}
              name="menu"
              size={25}
              style={{ marginRight: 30 }}
            />
          ),
        })}
      />

      {/* Project Screens */}
      <Stack.Screen
        name="Projects"
        component={DashboardProjects}
        initialParams={{ homeFlag: true }}
        options={({ navigation }) => ({
          title: "Active Projects",
          // headerShown: false,
          unmountOnBlur: shouldReset,
        })}
      />
      <Stack.Screen
        name="Add Project"
        component={AddProject}
        options={({ navigation }) => ({
          unmountOnBlur: shouldReset,
        })}
      />
      <Stack.Screen
        name="Edit Project"
        component={EditProject}
        options={({ navigation }) => ({
          unmountOnBlur: shouldReset,
        })}
      />
      <Stack.Screen
        name="Project Details"
        component={ProjectDetail}
        options={({ navigation }) => ({
          unmountOnBlur: shouldReset,
        })}
      />

      {/* Tasks Screens */}
      <Stack.Screen name="Tasks Near Deadline" component={DashboardTasks} />
    </Stack.Navigator>
  );
};

export default HomeStackScreen;
