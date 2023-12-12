import { useEffect, useState, useCallback } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { apiGetAllDashboardData } from "../../../apis/dashboard";
import { apiDeleteTask } from "../../../apis/tasks";
import { handlererrors } from "../../../apis/auth";

const DashboardTasks = ({ navigation, route }) => {
  const [taskList, setTasksList] = useState([]);
  const [deleteFlag, setDeleteFlag] = useState(false);

  // fetch all tasks
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (route?.params?.completed)
        navigation.setOptions({ title: "Completed Tasks" });

      const getAllTasks = async () => {
        const res = await apiGetAllDashboardData();
        console.log("tasks", res?.data?.totalNearDeadlineProjects?.data);

        if (route?.params?.nearDeadline)
          setTasksList(res?.data?.totalTaskWithNearbyDeadline?.data);

        if (route?.params?.completed)
          setTasksList(res?.data?.totalTaskCompleted);
      };

      getAllTasks();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

  //handle task delete
  const handleDelete = async (name, id) => {
    const deleteTask = async () => {
      try {
        const res = await apiDeleteTask(id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          Toast.show("Task Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
        setDeleteFlag((prev) => !prev);
      } catch (error) {
        console.log(error);
        handlererrors(error,navigation)
      }
    };
    Alert.alert(`Delete ${name}`, `Are you sure you want to delete ${name}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteTask() },
    ]);
  };

  //ok, so we gotta sort the task according to the status
  function sortTasks(a, b) {
    if (a.status == b.status) {
      return a.date - b.date;
    } else if (a.status == "to do" && b.status !== "to do") {
      return -1;
    } else if (b.status == "to do" && a.status !== "to do") {
      return 1;
    } else if (a.status == "in progress" && b.status !== "in progress") {
      return -1;
    } else if (b.status == "in progress" && a.status !== "in progress") {
      return 1;
    }
  }

  return (
    <View style={styles.container}>
      {/* <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Task");
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New
        </Text>
      </Pressable> */}

      <FlatList
        // data={taskList.sort(sortTasks)}
        data={taskList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate("Task Details", item);
              // navigation.setOptions({ title: "Updated!" });
            }}
            // style={
            //   (item.status == "completed" && [
            //     styles.listItem,
            //     { backgroundColor: "lightgreen" },
            //   ]) ||
            //   (item.status == "in progress" && [
            //     styles.listItem,
            //     { backgroundColor: "lightblue" },
            //   ]) ||
            //   (item.status == "to do" && [
            //     styles.listItem,
            //     { backgroundColor: "orange" },
            //   ])
            // }
            style={styles.listItem}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                style={{ marginRight: 8 }}
                name="clipboard-list"
                size={30}
              />
              <View>
                <Text style={styles.item}>Name: {item.name}</Text>
                <Text style={styles.subText}>Status: {item.status}</Text>
              </View>
            </View>
            <View style={styles.iconsContainer}>
              <Icon
                onPress={() => navigation.navigate("Edit Task", item)}
                name="pen"
                size={22}
                color="#444"
              />
              <Icon
                onPress={() => handleDelete(item.name, item.id)}
                name="trash-alt"
                size={22}
                color="#444"
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default DashboardTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "pink",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    minWidth: "98%",
    maxWidth: "98%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  item: {
    fontSize: 16,
    // maxW,
  },

  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    padding: 2,
    marginHorizontal: 8,
    width: "20%",
    justifyContent: "space-between",
  },

  subText: {
    fontSize: 12,
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
