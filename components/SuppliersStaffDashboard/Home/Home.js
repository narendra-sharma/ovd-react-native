import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { apiGetAllDashboardData } from "../../../apis/dashboard";
import { useRoute } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const [countsObj, setCountsObj] = useState({
    activeProjects: 0,
    projectsNearingDeadline: 0,
    tasksNearingDeadline: 0,
    completedTasks: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          const res = await apiGetAllDashboardData();
          // console.log("dashboard response: ", res.data);
          setCountsObj({
            activeProjects: res?.data?.activeProjectsCount,
            projectsNearingDeadline: res?.data?.nearbydeadlineCount,
            tasksNearingDeadline: res?.data?.taskWithNearbyDeadlineCount,
            completedTasks: res?.data?.taskCompletedCount,
          });
        } catch (error) {
          console.log(error);
        }
      })();

      return () => (isActive = false);
    }, [])
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        {/******************* CARDS *******************/}
        <View style={styles.boxesContainer}>
          <TouchableOpacity
            style={[styles.box, { backgroundColor: "#696cff" }]}
            onPress={() => navigation.navigate("Projects", { active: true })}
          >
            <Text style={styles.boxNumText}> {countsObj.activeProjects} </Text>
            <Text style={styles.boxText}>Active Projects</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box, { backgroundColor: "#fd7e14" }]}
            onPress={() =>
              navigation.navigate("Projects", { nearDeadline: true })
            }
          >
            <Text style={styles.boxNumText}>
              {countsObj.projectsNearingDeadline}
            </Text>
            <Text style={styles.boxText}>Projects Nearing Deadline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box, { backgroundColor: "#ff3e1d" }]}
            onPress={() =>
              navigation.navigate("Tasks Near Deadline", { nearDeadline: true })
            }
          >
            <Text style={styles.boxNumText}>
              {countsObj.tasksNearingDeadline}
            </Text>
            <Text style={styles.boxText}>Tasks Nearing Deadline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box, { backgroundColor: "#71dd37" }]}
            onPress={() =>
              navigation.navigate("Tasks Near Deadline", { completed: true })
            }
          >
            <Text style={styles.boxNumText}> {countsObj.completedTasks} </Text>
            <Text style={styles.boxText}>Recent Completed Tasks</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    flex: 1,
  },

  boxesContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  box: {
    width: "40%",
    height: 150,
    backgroundColor: "pink",
    flexGrow: 1,
    padding: 8,
    margin: 4,
    borderRadius: 5,
  },

  boxNumText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    fontSize: 24,
    marginVertical: 10,
  },

  boxText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    fontSize: 16,
  },
});
