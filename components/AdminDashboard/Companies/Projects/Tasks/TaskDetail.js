import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import Toast from "react-native-root-toast";
import moment from "moment";
import {
  apiDeleteTask,
  apiGetPreFilledTaskDetails,
} from "../../../../../apis/tasks";
import { url } from "../../../../../constants";

const TaskDetail = ({ navigation, route }) => {
  const [taskData, setTaskData] = useState({});
  const [tagsList, setTagsList] = useState([]);
  const [contractorList, setContractorsList] = useState([]);
  const [projectDetail, setProjectDetail] = useState({});
  // const [companyList, setCompanyList] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    const res = await apiGetPreFilledTaskDetails(route.params.id);
    console.log("task data: ", res?.data);
    console.log(
      `${url.slice(0, -4)}${res?.data?.after_image}`,
      "res?.data?.after_image"
    );
    setTaskData({
      ...res.data.task,
      // tags: JSON.parse(res.data.task.tags_id),
    });

    if (res?.data?.documents?.length > 0) {
      setIsFilePicked(true);
      const tempDocs = res.data.documents.map((doc, idx) => {
        return {
          ...doc,
          uri: `${url.slice(0, -4)}${doc.uri}`,
        };
      });
      console.log("task documents!!!!! ", tempDocs);
      setDocuments([...tempDocs]);
    }

    if (res?.data?.before_image)
      setBeforeImage(`${url.slice(0, -4)}${res?.data?.before_image}`);
    if (res?.data?.after_image)
      setAfterImage(`${url.slice(0, -4)}${res?.data?.after_image}`);

    setProjectDetail({ ...res?.data?.project });

    // const tempProjects = res?.data?.project?.map((project) => {
    //   return { label: project.project_name, value: project.id };
    // });
    // setProjectsList([...tempProjects]);

    const tempContractors = res?.data?.contractors?.map((contractor) => {
      return { label: contractor.name, value: contractor.id };
    });
    setContractorsList([...tempContractors]);

    const tempTags = res?.data?.tags?.map((tag) => {
      return { label: tag.name, value: JSON.stringify(tag.id) };
    });
    setTagsList([...tempTags]);

    // console.log(customersList);
  };

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
          navigation.goBack();
        }
      } catch (error) {
        console.log(error);
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

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ width: "90%", marginHorizontal: "auto" }}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Task Name</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}> {taskData.name} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Project Name</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>{projectDetail?.project_name}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Status</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>{projectDetail?.status}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Contractor</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {
              contractorList[
                contractorList?.findIndex(
                  (contractor) => contractor?.id == taskData?.contractor_id
                )
              ]?.username
            }
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Start Date: </Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {moment(taskData.start_date).format("YYYY-MM-DD")}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>End Date: </Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {moment(taskData.end_date).format("YYYY-MM-DD")}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Days Before Deadline: </Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {(moment(taskData.end_date).toDate().getTime() -
              moment(taskData.start_date).toDate().getTime()) /
              (1000 * 60 * 60 * 24)}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Description: </Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>{taskData.description}</Text>
        </View>
      </View>
      {/* <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Status</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>{taskData.status}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Tags</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>{taskData.tag}</Text>
        </View>

      

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Task Cost: </Text>
        <Text>{taskData.cost}</Text>
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Contractor: </Text>
        <Text>{taskData.contractor}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => navigation.navigate("Edit Task")}
        >
          <Text style={styles.textStyle}>Edit Task Details</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          // onPress={handleDeleteCompany}
        >
          <Text style={styles.textStyle}>Delete Task</Text>
        </Pressable>
      </View> */}

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
            Edit Task
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          // onPress={handleDeleteCompany}
        >
          <Text style={styles.textStyle}>Delete Task</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TaskDetail;

const styles = StyleSheet.create({
  fieldContainer: {
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
    width: "50%",
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
