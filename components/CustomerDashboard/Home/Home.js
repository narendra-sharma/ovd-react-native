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
import {
  apiGetAllDashboardData,
  apiGetAnalyticsGraphData,
} from "../../../apis/dashboard";
import { useRoute } from "@react-navigation/native";
import AnalyticsGraphs from "./AnalyticsGraphs";

const Home = ({ navigation }) => {
  const [countsObj, setCountsObj] = useState({
    activeProjects: 0,
    projectsNearingDeadline: 0,
    tasksNearingDeadline: 0,
    completedTasks: 0,
  });
  const [comissionData, setComissionData] = useState([
    {
      value: 0,
      frontColor: "rgba(255, 171, 0,1)",
      barWidth: 65,
      disablePress: true,
      barBorderTopLeftRadius: 4,
      barBorderTopRightRadius: 4,
    },
    {
      value: 0,
      frontColor: "rgba(53, 162, 235, 1)",
      barWidth: 65,
      disablePress: true,
      barBorderTopLeftRadius: 4,
      barBorderTopRightRadius: 4,
    },
    {
      value: 0,
      frontColor: "rgba(105, 108, 255, 1)",
      barWidth: 65,
      disablePress: true,
      barBorderTopLeftRadius: 4,
      barBorderTopRightRadius: 4,
    },
  ]);
  const [comissionLabels, setComissionLabels] = useState([
    { label: "Overall", frontColor: "rgba(255, 171, 0,1)", width: 70 },
    { label: "Paid", frontColor: "rgba(53, 162, 235, 1)", width: 70 },
    { label: "Pending", frontColor: "rgba(105, 108, 255, 1)", width: 70 },
  ]);
  const [supplierData, setSupplierData] = useState([
    {
      value: 0,
      frontColor: "rgba(255, 171, 0,1)",
      barWidth: 65,
      disablePress: true,
      barBorderTopLeftRadius: 4,
      barBorderTopRightRadius: 4,
    },
    {
      value: 0,
      frontColor: "rgba(53, 162, 235, 1)",
      barWidth: 65,
      disablePress: true,
      barBorderTopLeftRadius: 4,
      barBorderTopRightRadius: 4,
    },
    {
      value: 0,
      frontColor: "rgba(105, 108, 255, 1)",
      barWidth: 65,
      disablePress: true,
      barBorderTopLeftRadius: 4,
      barBorderTopRightRadius: 4,
    },
  ]);
  const [supplierLabels, setSupplierLabels] = useState([
    { label: "Overall", frontColor: "rgba(255, 171, 0,1)", width: 60 },
    {
      label: "Total Projects",
      frontColor: "rgba(53, 162, 235, 1)",
      width: 110,
    },
    { label: "Best Projects", frontColor: "rgba(105, 108, 255, 1)", width: 90 },
  ]);

  //get all data
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          const res = await apiGetAllDashboardData();
          setCountsObj({
            activeProjects: res?.data?.activeProjectsCount,
            projectsNearingDeadline: res?.data?.nearbydeadlineCount,
            tasksNearingDeadline: res?.data?.taskWithNearbyDeadlineCount,
            completedTasks: res?.data?.taskCompletedCount,
          });

          //graphs api
          // const graphres = await apiGetAnalyticsGraphData();
          // setAllGraphData(graphres);
        } catch (error) {
          console.log(error);
        }
      })();

      return () => (isActive = false);
    }, [])
  );

  const setAllGraphData = (graphres) => {
    let comissionGraphData = [...comissionData];
    if (graphres?.data?.usersCommissionChart?.overall > 0) {
      comissionGraphData[0].value =
        graphres?.data?.usersCommissionChart?.overall;
      comissionGraphData[0].topLabelComponent = () => (
        <Text
          style={{
            color: comissionGraphData[0].frontColor,
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          {graphres?.data?.usersCommissionChart?.overall}
        </Text>
      );
    }
    if (graphres?.data?.usersCommissionChart?.paid > 0) {
      comissionGraphData[1].value = graphres?.data?.usersCommissionChart?.paid;
      comissionGraphData[1].topLabelComponent = () => (
        <Text
          style={{
            color: comissionGraphData[1].frontColor,
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          {graphres?.data?.usersCommissionChart?.paid}
        </Text>
      );
    }
    if (graphres?.data?.usersCommissionChart?.pending > 0) {
      comissionGraphData[2].value =
        graphres?.data?.usersCommissionChart?.pending;
      comissionGraphData[2].topLabelComponent = () => (
        <Text
          style={{
            color: comissionGraphData[2].frontColor,
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          {graphres?.data?.usersCommissionChart?.pending}
        </Text>
      );
    }
    setComissionData([...comissionGraphData]);
    let supplierGraphData = [...supplierData];
    if (graphres?.data?.supplierProjectChart?.overall > 0) {
      supplierGraphData[0].value =
        graphres?.data?.supplierProjectChart?.overall;
      supplierGraphData[0].topLabelComponent = () => (
        <Text
          style={{
            color: supplierGraphData[0].frontColor,
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          {graphres?.data?.supplierProjectChart?.overall}
        </Text>
      );
    }
    if (graphres?.data?.supplierProjectChart?.total_projects > 0) {
      supplierGraphData[1].value =
        graphres?.data?.supplierProjectChart?.total_projects;
      supplierGraphData[1].topLabelComponent = () => (
        <Text
          style={{
            color: supplierGraphData[1].frontColor,
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          {graphres?.data?.supplierProjectChart?.total_projects}
        </Text>
      );
    }
    if (graphres?.data?.supplierProjectChart?.best_projects > 0) {
      supplierGraphData[2].value =
        graphres?.data?.supplierProjectChart?.best_projects;
      supplierGraphData[2].topLabelComponent = () => (
        <Text
          style={{
            color: supplierGraphData[2].frontColor,
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          {graphres?.data?.supplierProjectChart?.best_projects}
        </Text>
      );
    }
    setSupplierData([...supplierGraphData]);
  };

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
        {/* <AnalyticsGraphs
          title="Comissions Status"
          labels={comissionLabels}
          data={comissionData}
          bottomTitle="Comissions"
        />
        <AnalyticsGraphs
          title="Supplier Projects"
          labels={supplierLabels}
          data={supplierData}
          bottomTitle="Supplier Projects"
        /> */}
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
