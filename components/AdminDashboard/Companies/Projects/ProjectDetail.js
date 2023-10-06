import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
// import TasksList from "./Tasks/TaskList";
import { apiGetPreFilledProjectDetails } from "../../../../apis/projects";
import { useFocusEffect } from "@react-navigation/native";

const ProjectDetail = ({ navigation, route }) => {
  const [projectData, setProjectData] = useState({ consultant: "" });
  const [consultant, setConsultant] = useState("");
  const [customer, setCustomer] = useState("");
  const [company, setCompany] = useState("");
  const [users, setUsers] = useState([]);

  const [totalCost, setTotalCost] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllData = async () => {
        try {
          const res = await apiGetPreFilledProjectDetails(route.params.id);
          setProjectData({ ...res.data.project });

          const tempConsultant = res.data.consultant.filter(
            (consultant) => consultant.id == projectData.consultant_id
          );
          setConsultant(
            res.data.consultant[
              res.data.consultant.findIndex(
                (consultant) => consultant.id == projectData.consultant_id
              )
            ].name
          );

          const tempCustomer = res.data.customers.filter(
            (customer) => customer.id == projectData.customer_id
          );
          setCustomer(tempCustomer[0].name);

          const tempCompany = res.data.companies.filter(
            (company) => company.id == projectData.company_id
          );
          setCompany(tempCompany[0].name);
        } catch (error) {
          console.log(error);
        }
      };

      getAllData();
      return () => (isActive = false);
    }, [])
  );

  useEffect(() => {
    setProjectData({
      ...projectData,
      company: company,
      customer: customer,
      consultant: consultant,
    });
  }, [company, customer, consultant]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
      <View style={{width: "90%", marginHorizontal: "auto"}}>
        <Text style={styles.item}>{projectData.companyName}</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Name</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.project_name} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Consultant</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.consultant} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Customer</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {consultant} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Company</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {company} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Phone Number</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.contact_number} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Project Location</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.address} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Start Date</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.start_date} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Deadline</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.end_date} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Description</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.description} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Total Estimated Hours</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.estimated_hours} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Billing Type</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {projectData.billing_type} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Tasks</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> </Text>
          </View>
      </View>

      {/* <TasksList tasks={route.params.tasks} navigation={navigation} /> */}

      <View
        style={[styles.fieldContainer]}
      >
        <Text style={styles.fieldName}>Total cost of all tasks</Text>
        <Text style={styles.span}>:</Text>
        <Text style={styles.fielContent}>{totalCost}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          // onPress={() => setIsCompanyEditOn(true)}
        >
          <Text
            style={styles.textStyle}
            onPress={() =>
              navigation.navigate("Edit Project", { id: projectData.id })
            }
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
  );
};

export default ProjectDetail;

const styles = StyleSheet.create({
  fieldContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  fieldName: {
    width: "40%",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left"
  },

  fielContent: {
    width: "55%",
  },

  span: {
    width: "10%"
  },

  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

  buttonsContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "pink",
  },

  button: {
    margin: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  buttonClose: {
    backgroundColor: "#696cff",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  addButton: {
    margin: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
