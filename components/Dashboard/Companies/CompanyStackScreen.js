import CompanyDetail from "./CompanyDetail";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllCompanies from "./AllCompanies";
import Icon from "react-native-vector-icons/MaterialIcons";

const Stack = createNativeStackNavigator();

const CompanyStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="All Companies"
        component={AllCompanies}
        options={({ navigation }) => ({
          title: "All Companies",
          // headerShown: false,
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
      <Stack.Screen
        name="Company Details"
        component={CompanyDetail}
        options={({ navigation }) => ({
          title: "Company Details",
          // headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default CompanyStackScreen;
