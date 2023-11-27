import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { mockData } from "../MOCK_DATA";
import Icon from "react-native-vector-icons/FontAwesome5";
import ProjectsList from "./ProjectsList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EditProject from "./EditProject";
import AddProject from "./AddProject";
import ProjectDetail from "./ProjectDetail";
import { useIsFocused } from "@react-navigation/native";
import { useCustomActiveScreenStatus } from "../../../../Contexts/ActiveScreenContext";
import AllTasks from "./Tasks/AllTasks";
import EditTask from "./Tasks/EditTask";
import AddTask from "./Tasks/AddTask";
import TaskDetail from "./Tasks/TaskDetail";
import EditInvoice from "./Invoices/EditInvoice";
import AddInvoice from "./Invoices/AddInvoice";
import InvoiceDetail from "./Invoices/InvoiceDetail";

const initialFormData = {
  companyName: "",
  email: "",
  phoneNo: "",
  jobs: [{}],
};

const Stack = createNativeStackNavigator();

const ProjectsLayout = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Project");
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New
        </Text>
      </Pressable> */}

      <ProjectsList navigation={navigation} />
    </View>
  );
};

const ViewProjects = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { setActiveScreen } = useCustomActiveScreenStatus();

  useEffect(() => {
    if (isFocused) {
      setActiveScreen("Projects");
    }
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My Projects"
        component={ProjectsLayout}
        options={({ navigation }) => ({
          headerLeft: () => (
            <MaterialIcons
              onPress={() => navigation.toggleDrawer()}
              name="menu"
              size={25}
              style={{ marginRight: 30 }}
            />
          ),
        })}
      />
      <Stack.Screen name="Edit Project" component={EditProject} />
      <Stack.Screen name="Add Project" component={AddProject} />
      <Stack.Screen name="Project Details" component={ProjectDetail} />
      <Stack.Screen name="Edit Invoice" component={EditInvoice} />
      <Stack.Screen name="Add Invoice" component={AddInvoice} />
      <Stack.Screen name="Invoice Details" component={InvoiceDetail} />
      {/* <Stack.Screen
        name="My Tasks"
        component={AllTasks}
        options={({ navigation }) => ({
          headerLeft: () => (
            <MaterialIcons
              onPress={() => navigation.toggleDrawer()}
              name="menu"
              size={25}
              style={{ marginRight: 30 }}
            />
          ),
        })}
      /> */}
      <Stack.Screen name="Edit Task" component={EditTask} />
      <Stack.Screen name="Add Task" component={AddTask} />
      <Stack.Screen name="Task Details" component={TaskDetail} />
    </Stack.Navigator>
  );
};

export default ViewProjects;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    width: "100%",
    height: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: "100%",
  },

  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },

  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  buttonClose: {
    backgroundColor: "#B76E79",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "80%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
  },

  item: {
    padding: 10,
    fontSize: 16,
  },

  addButton: {
    margin: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
