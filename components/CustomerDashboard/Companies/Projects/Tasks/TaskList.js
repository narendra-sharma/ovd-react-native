import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { apiDeleteTask, apiGetAllTasks } from "../../../../../apis/tasks";
import { handlererrors } from "../../../../../apis/auth";

const TasksList = ({ navigation, route, tagId = null, projectId = null }) => {
  const [taskList, setTasksList] = useState([]);
  const [deleteFlag, setDeleteFlag] = useState(false);

  console.log("tagId: ", tagId);
  console.log("projectId: ", projectId);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllTasks = async () => {
        if (tagId) {
          const res = await apiGetAllTasks(tagId, projectId);
          setTasksList(res?.data?.tasks);
        } else {
          const res = await apiGetAllTasks(tagId, projectId);
          setTasksList(res?.data?.tasks);
          console.log("tasks", res.data);
        }
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

  const displayTaskStatus = (status) => {
    switch (status) {
      case 0:
        return { text: "Pending", color: "blue" };
      case 1:
        return { text: "New", color: "purple" };
      case 2:
        return { text: "In Progress", color: "orange" };
      case 3:
        return { text: "Completed", color: "green" };
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        // data={taskList.sort(sortTasks)}
        data={taskList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate("Task Details", item);
            }}
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
                <Text style={styles.subText}>
                  Status:{" "}
                  <Text
                    style={{
                      color: displayTaskStatus(item.status).color,
                      fontWeight: "bold",
                    }}
                  >
                    {displayTaskStatus(item.status).text}
                  </Text>
                </Text>
              </View>
            </View>
            {/* <View style={styles.iconsContainer}>
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
            </View> */}
          </Pressable>
        )}
      />
    </View>
  );
};

export default TasksList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "pink",
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
    fontSize: 12.5,
  },
});
