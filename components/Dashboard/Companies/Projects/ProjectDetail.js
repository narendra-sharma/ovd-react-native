import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";

const ProjectDetail = ({ navigation, route }) => {
  const [projectData, setProjectData] = useState({});

  useEffect(() => {
    setProjectData({ ...route.params });
    navigation.setOptions({
      title: `Project - ${route.params.projectName}`,
    });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <View style={styles.centeredView}>
        <Text style={styles.item}>{projectData.companyName}</Text>
        <View>
          <Text>Name: {projectData.projectName} </Text>
        </View>
        <View>
          <Text>Consutant: {projectData.cosultant} </Text>
        </View>
        <View>
          <Text>Point of Contact: {projectData.pointOfContact} </Text>
        </View>
        <View>
          <Text>Project Location: {projectData.projectLocation} </Text>
        </View>

        <Text>Taks: </Text>
        <FlatList
          data={projectData.items}
          renderItem={({ item }) => (
            <View>
              <Text>description: {item.description}</Text>
              <Text>qty: {item.qty}</Text>
              <Text>totalCostOfLine: {item.totalCostOfLine}</Text>
              <Text>tax: {item.tax}</Text>
              <Text>discount: {item.discount}</Text>
              <Text>cust_details: {item.cust_details}</Text>
            </View>
          )}
        />

        <View>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            // onPress={() => setIsCompanyEditOn(true)}
          >
            <Text
              style={styles.textStyle}
              onPress={() => navigation.navigate("Edit Project")}
            >
              Edit Project Details
            </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            // onPress={handleDeleteCompany}
          >
            <Text style={styles.textStyle}>Delete Project</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProjectDetail;

const styles = StyleSheet.create({});
