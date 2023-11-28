import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { apiGetPreFilledProjectDetails } from "../../../../apis/projects";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import AllTasks from "./Tasks/AllTasks";
import InvoiceLayout from "./Invoices/ViewInvoices";

const ProjectDetail = ({ navigation, route }) => {
  const [projectData, setProjectData] = useState({});
  const [consultantsList, setConsultantsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [quotationsList, setQuotationsList] = useState([]);
  const [users, setUsers] = useState([]);

  const [totalCost, setTotalCost] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllData = async () => {
        try {
          const res = await apiGetPreFilledProjectDetails(route.params.id);
          console.log("project data: ", res?.data);
          setProjectData({
            ...res?.data?.project,
            totalCost: res?.data?.totalCost,
            deadline: res?.data?.deadline,
          });
          setCompaniesList([...res?.data?.companies]);
          setQuotationsList([...res?.data?.quotation]);
        } catch (error) {
          console.log(error);
        }
      };

      getAllData();
      return () => (isActive = false);
    }, [])
  );

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <ScrollView>
        <View style={{ width: "100%" }}>
          <Text style={styles.item}>{projectData.companyName}</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Name</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>
              {projectData?.project_name}{" "}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Company</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>
              {
                companiesList[
                  companiesList?.findIndex(
                    (company) => company?.id == projectData?.company_id
                  )
                ]?.name
              }
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Phone Number</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>
              {projectData?.contact_number}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Project Location</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>{projectData?.address}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Start Date</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>{projectData?.start_date}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Deadline</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>
              {projectData?.deadline?.end_date
                ? moment(projectData?.deadline?.end_date).format("YYYY-MM-DD")
                : "-"}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Description</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>{projectData?.description} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Total Estimated Hours</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>
              {projectData?.estimated_hours}
            </Text>
          </View>

          <View style={[styles.fieldContainer]}>
            <Text style={styles.fieldName}>Quotation Amount</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>
              {
                quotationsList[
                  quotationsList?.findIndex(
                    (quote) => quote?.id == projectData?.quotes_id
                  )
                ]?.cost
              }
            </Text>
          </View>

          {/* <View style={[styles.fieldContainer]}>
            <Text style={styles.fieldName}>Project Cost</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>{projectData?.totalCost}</Text>
          </View> */}

          {/* <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Billing Type</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}> {projectData.billing_type} </Text>
        </View> */}

          {/* <TasksList tasks={route.params.tasks} navigation={navigation} /> */}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Tasks</Text>
          <Text style={styles.span}>:</Text>
        </View>
        <AllTasks navigation={navigation} projectId={route?.params?.id} />

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Invoices</Text>
          <Text style={styles.span}>:</Text>
        </View>
        <InvoiceLayout navigation={navigation} projectId={route?.params?.id} />

        {/* <View style={styles.buttonsContainer}>
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
        </View> */}
      </ScrollView>
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
    textAlign: "left",
  },

  fieldContent: {
    width: "55%",
  },

  span: {
    width: "10%",
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
    borderRadius: 5,
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
