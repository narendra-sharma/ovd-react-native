import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Dropdown } from "react-native-element-dropdown";
import * as DocumentPicker from "expo-document-picker";
import { apiAddNewTask, apiGetTasksDropdownData } from "../../../../apis/tasks";
import Toast from "react-native-root-toast";

const AddTask = ({ navigation }) => {
  const [taskData, setTaskData] = useState({});
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [contractorsList, setContractorsList] = useState([]);
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);
  const [startDate, setStartDate] = useState();
  const [isStartDatePickerVisible, setStartDateVisibility] = useState(false);

  const [nameError, setNameError] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [contractorError, setContractorError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [documentError, setDocumentError] = useState(null);
  const [costError, setCostError] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [deadlineError, setDeadlineError] = useState(null);

  useEffect(() => {
    const getAllData = async () => {
      const res = await apiGetTasksDropdownData();
      // console.log("res: ", res.data);
      const tempProjects = res?.data?.projects?.map((project) => {
        return { label: project.project_name, value: project.id };
      });
      setProjectsList([...tempProjects]);

      const tempContractors = res?.data?.contractors?.map((contractor) => {
        return { label: contractor.name, value: contractor.id };
      });
      setContractorsList([...tempContractors]);

      // console.log(customersList);
    };

    getAllData();
  }, []);

  //handle file upload
  const UploadFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.assets[0].uri) {
      setIsFilePicked(true);
      setTaskData((prev) => ({
        ...prev,
        document: result.assets[0].uri,
        fileName: result.assets[0].name,
        fileType: result.assets[0].mimeType,
      }));
      console.log(taskData);
    }
    console.log(result.assets[0]);
  };

  //date functions
  const hideStartDatePicker = () => {
    setStartDateVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const hideEndDatePicker = () => {
    setEndDateVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    if (
      moment(startDate).format("MM/DD/YYYY") <=
      moment(date).format("MM/DD/YYYY")
    ) {
      setEndDate(date);
    } else {
      // setend_dateError("end_date cannot be before the start date");
    }
    hideEndDatePicker();
  };

  //validation functions
  const validateTaskName = (name) => {
    if (name == "") {
      setNameError("Task name is required*");
      return false;
    }
    return true;
  };

  const validateProjectName = (project) => {
    if (project == "" || project == null) {
      setProjectError("Project is required*");
      return false;
    }
    return true;
  };

  const validateContractor = (contractor) => {
    if (contractor == "" || contractor == null) {
      setContractorError("Contractor is required*");
      return false;
    }
    return true;
  };

  const validateDescription = (description) => {
    if (description == "" || description == null) {
      setDescriptionError("Description is required*");
      return false;
    }
    return true;
  };

  const validateDocument = (document) => {
    if (document == "" || document == null) {
      setDocumentError("Document is required*");
      return false;
    }
    return true;
  };

  const validateCost = (cost) => {
    if (cost == "" || cost == null) {
      setCostError("Cost is required*");
      return false;
    }
    return true;
  };

  const validateStartDate = (date) => {
    if (date == "" || date == null) {
      setStartDateError("Start date is required*");
      return false;
    }
    return true;
  };

  const validateEndDate = (date) => {
    if (date == "" || date == null) {
      setDeadlineError("Deadline is required*");
      return false;
    }
    return true;
  };

  //handle form submit
  const handleSubmit = async () => {
    if (
      validateTaskName(taskData.name) &&
      validateProjectName(taskData.project) &&
      validateContractor(taskData.contractor) &&
      validateDescription(taskData.description) &&
      validateDocument(taskData.document) &&
      validateCost(taskData.cost) &&
      validateStartDate(taskData.start_date) &&
      validateEndDate(taskData.end_date)
    ) {
      try {
        var form_data = new FormData();

        // for (var key in taskData) {
        //   form_data.append(key, taskData[key]);
        // }
        form_data.append("name", taskData.name);
        form_data.append("project", taskData.project);
        form_data.append("contractor", taskData.contractor);
        form_data.append("cost", taskData.cost);
        form_data.append("description", taskData.description);
        form_data.append("start_date", taskData.start_date);
        form_data.append("end_date", taskData.end_date);
        form_data.append("status", 1);
        form_data.append("document", {
          uri: taskData.document,
          type: taskData.fileType,
          name: taskData.fileName,
        });
        // console.log("add task obj:", form_data);

        const res = await apiAddNewTask(form_data);
        if (res.status == 200) {
          Toast.show("New Task Added", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show("Cannot Add Task", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    } else {
      validateTaskName(taskData.name);
      validateProjectName(taskData.project);
      validateContractor(taskData.contractor);
      validateDescription(taskData.description);
      validateDocument(taskData.document);
      validateCost(taskData.cost);
      validateStartDate(taskData.start_date);
      validateEndDate(taskData.end_date);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Task Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={taskData.name}
            onChangeText={(text) => {
              setTaskData({ ...taskData, name: text });
              setNameError(null);
            }}
            placeholder="Task Name"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          {/* <Text>Status:</Text>
          <DropdownMenu /> 
           <TextInput
            style={styles.input}
            name="organization"
            value={taskData.totalCommission}
            onChangeText={(text) =>
              setTaskData({ ...taskData, totalCommission: text })
            }
            placeholder="Status"
          /> */}
          <Text>Project:</Text>
          <DropdownMenu
            data={projectsList}
            placeholder="Select Project"
            value={taskData.project}
            setValue={setTaskData}
            label="project"
            originalObj={taskData}
            setErrorState={setProjectError}
          />
          {projectError ? (
            <Text style={styles.errorText}>{projectError}</Text>
          ) : null}

          <Text>Contractor:</Text>
          <DropdownMenu
            data={contractorsList}
            placeholder="Select Contractor"
            value={taskData.contractor}
            setValue={setTaskData}
            label="contractor"
            originalObj={taskData}
            setErrorState={setContractorError}
          />
          {contractorError ? (
            <Text style={styles.errorText}>{contractorError}</Text>
          ) : null}

          <Text>Task Description:</Text>
          <TextInput
            style={styles.input}
            name="description"
            value={taskData.description}
            onChangeText={(text) => {
              setTaskData({ ...taskData, description: text });
              setDescriptionError(null);
            }}
            placeholder="Task Description"
          />
          {descriptionError ? (
            <Text style={styles.errorText}>{descriptionError}</Text>
          ) : null}

          <Text style={styles.file}>Upload File</Text>
          <View style={styles.button}>
            <TouchableOpacity>
              <Button
                title="upload your file"
                color="black"
                onPress={() => {
                  UploadFile();
                  setDocumentError(null);
                }}
              />
            </TouchableOpacity>
          </View>
          {isFilePicked && (
            <View>
              <Text>Selected File {taskData.fileName}</Text>
            </View>
          )}
          {documentError ? (
            <Text style={styles.errorText}>{documentError}</Text>
          ) : null}

          <Text>Task Cost:</Text>
          <TextInput
            style={styles.input}
            name="cost"
            value={taskData.cost}
            onChangeText={(text) => {
              setTaskData({ ...taskData, cost: text });
              setCostError(null);
            }}
            placeholder="Task Cost"
          />
          {costError ? <Text style={styles.errorText}>{costError}</Text> : null}

          <Text>Start Date:</Text>
          <Pressable
            onPress={() => {
              setStartDateVisibility(true);
              setTaskData({
                ...taskData,
                start_date: moment(startDate).format("MM/DD/YYYY"),
              });
              setStartDateError(null);
            }}
            style={[
              styles.input,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#d9d9d9",
              },
            ]}
            name="startDate"
            value={taskData.start_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {startDate ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(startDate).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                Start Date
              </Text>
            )}
          </Pressable>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />
          {startDateError ? (
            <Text style={styles.errorText}>{startDateError}</Text>
          ) : null}

          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
          <Text>End Date:</Text>
          <Pressable
            onPress={() => {
              setEndDateVisibility(true);
              setTaskData({
                ...taskData,
                end_date: moment(endDate).format("MM/DD/YYYY"),
              });
              setDeadlineError(null);
            }}
            style={[
              styles.input,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#d9d9d9",
              },
            ]}
            name="startDate"
            value={taskData.end_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {endDate ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(endDate).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>End Date</Text>
            )}
          </Pressable>
          {deadlineError ? (
            <Text style={styles.errorText}>{deadlineError}</Text>
          ) : null}
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.submitButton}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddTask;

const DropdownMenu = ({
  data,
  placeholder,
  value,
  setValue,
  label,
  originalObj,
  setErrorState,
}) => {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholder={placeholder}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      containerStyle={styles.listStyle}
      dropdownPosition="bottom"
      value={value}
      onChange={(item) => {
        setValue({ ...originalObj, [label]: item.value });
        setErrorState(null);
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#A9A9AC",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
  },

  input: {
    width: 300,
    height: 35,
    marginTop: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 8,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  submitText: {
    color: "white",
    justifyContent: "center",
  },

  opacity: {
    margin: 20,
  },

  fieldName: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
