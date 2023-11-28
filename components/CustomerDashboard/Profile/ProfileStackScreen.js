import react from "react";
import { View, Text, Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
import Icon from "react-native-vector-icons/MaterialIcons";
import EditProfile from "./EditProfile";
import { useCustomActiveScreenStatus } from "../../../Contexts/ActiveScreenContext";
import { useIsFocused } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  const isFocused = useIsFocused();
  if (isFocused) {
    const { setActiveScreen } = useCustomActiveScreenStatus();
    setActiveScreen("Profile");
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My Profile"
        component={Profile}
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
      <Stack.Screen name="Edit Profile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export default ProfileStackScreen;
