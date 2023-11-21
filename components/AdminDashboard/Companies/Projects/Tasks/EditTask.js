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
  Image,
  Switch,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-root-toast";
import * as ImagePicker from "expo-image-picker";
import { apiGetPreFilledTaskDetails } from "../../../../../apis/tasks";

const EditTask = ({ navigation, route }) => {
  const [taskData, setTaskData] = useState({});
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [contractorsList, setContractorsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);
  const [startDate, setStartDate] = useState();
  const [isStartDatePickerVisible, setStartDateVisibility] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [projectDetail, setProjectDetail] = useState({});

  const [nameError, setNameError] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [contractorError, setContractorError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [documentError, setDocumentError] = useState(null);
  const [costError, setCostError] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [deadlineError, setDeadlineError] = useState(null);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    const res = await apiGetPreFilledTaskDetails(route.params.id);
    // console.log("res: ", res.data);
    setTaskData({
      ...res.data.task,
      // tags: JSON.parse(res.data.task.tags_id),
    });

    if (res?.data?.documents?.length > 0) {
      setIsFilePicked(true);
      const tempDocs = res.data.documents.map((doc, idx) => {
        return {
          ...doc,
          uri: `https://ovd.visionvivante.com${doc.uri}`,
        };
      });
      console.log("task documents!!!!! ", tempDocs);
      setDocuments([...tempDocs]);
    }

    if (res?.data?.before_image)
      setBeforeImage(`https://ovd.visionvivante.com${res?.data?.before_image}`);
    if (res?.data?.after_image)
      setAfterImage(`https://ovd.visionvivante.com${res?.data?.after_image}`);

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

  // console.log(documents);

  //handle file upload
  const UploadFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (result.assets[0].uri) {
      setIsFilePicked(true);

      let docs = result.assets.map((doc, idx) => {
        console.log(doc);
        return {
          uri: doc.uri,
          name: doc.name,
          type: doc.mimeType,
        };
      });

      setDocuments([...documents, ...docs]);
      // setTaskData((prev) => ({
      //   ...prev,
      //   document: result.assets[0].uri,
      //   fileName: result.assets[0].name,
      //   fileType: result.assets[0].mimeType,
      // }));
      // console.log(taskData);
      console.log(docs);
    }
  };

  //date functions
  const hideStartDatePicker = () => {
    setStartDateVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    setTaskData((prev) => ({
      ...prev,
      start_date: moment(date).format("MM/DD/YYYY"),
    }));
    hideStartDatePicker();
  };

  const hideEndDatePicker = () => {
    setEndDateVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    // if (
    //   moment(taskData.start_date).format("MM/DD/YYYY") <=
    //   moment(date).format("MM/DD/YYYY")
    // ) {
    setEndDate(date);
    setTaskData((prev) => ({
      ...prev,
      end_date: moment(date).format("MM/DD/YYYY"),
    }));
    // } else {
    //   // setend_dateError("end_date cannot be before the start date");
    // }
    hideEndDatePicker();
  };

  //upload image
  const pickImage = async (setState) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //   aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageType = result.assets[0].uri.endsWith(".png")
        ? "image/png"
        : "image/jpeg";

      setState(result.assets[0].uri);
    }
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
      validateProjectName(taskData.project_id) &&
      validateContractor(taskData.contractor_id) &&
      validateDescription(taskData.description) &&
      // validateDocument(taskData.document) &&
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
        form_data.append("project", taskData.project_id);
        form_data.append("contractor", taskData.contractor_id);
        form_data.append("cost", Number(taskData.cost));
        form_data.append("description", taskData.description);
        form_data.append("start_date", taskData.start_date);
        form_data.append("end_date", taskData.end_date);
        for (var i = 0; i < taskData.tags_id.length; i++) {
          form_data.append("tags[]", Number(taskData.tags_id[i]));
        }
        form_data.append("status", taskData.status);

        if (documents?.length > 0) {
          documents.forEach((doc) => {
            let obj = { ...doc };
            obj.name = `${doc.uri}`;
            obj.uri = doc.uri;

            const docType = doc.uri.substring(doc.uri.lastIndexOf(".") + 1);
            if (docType == "jpg" || docType == "jpeg") obj.type = "image/jpeg";
            else if (docType == "png") obj.type = "image/png";
            else if (docType == "doc") obj.type = "application/msword";
            else if (docType == "docx")
              obj.type =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            else if (docType == "pdf") obj.type = "application/pdf";
            console.log(docType);
            form_data.append("document[]", obj);
          });
        }

        if (beforeImage)
          form_data.append("before_image", {
            name: beforeImage,
            uri: beforeImage,
            type: beforeImage.endsWith(".png") ? "image/png" : "image/jpeg",
          });

        if (afterImage)
          form_data.append("after_image", {
            name: afterImage,
            uri: afterImage,
            type: afterImage.endsWith(".png") ? "image/png" : "image/jpeg",
          });

        const res = await apiUpdateTaskDetails(form_data, route.params.id);
        if (res.status == 200) {
          Toast.show("Task Updated", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show("Cannot Update Task", {
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
      validateProjectName(taskData.project_id);
      validateContractor(taskData.contractor_id);
      validateDescription(taskData.description);
      // validateDocument(taskData.document);
      validateCost(taskData.cost);
      validateStartDate(taskData.start_date);
      validateEndDate(taskData.end_date);
    }
  };

  //handle document approve
  const handleDocumentApproval = async (id, index) => {
    let tempDocs = [...documents];
    tempDocs[index].doc_approval = tempDocs[index].doc_approval == 0 ? 1 : 0;
    setDocuments(tempDocs);
    const res = await apiChangeDocApprovalStatus(id);

    console.log(res?.data);
  };

  //handle document status (visible/hidden to customer)
  const handleDocumentStatus = async (id, index) => {
    let tempDocs = [...documents];
    tempDocs[index].status = tempDocs[index].status == 0 ? 1 : 0;
    setDocuments(tempDocs);
    const res = await apiChangeDocumentStatus(id);
    console.log(res?.data);
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text style={styles.fieldName}>Project:</Text>
          <View
            style={[
              styles.input,
              {
                backgroundColor: "#e9e9e9",
                display: "flex",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={{ color: "gray" }}>
              {projectDetail?.project_name
                ? projectDetail?.project_name
                : "Project Name"}
            </Text>
          </View>

          {/* <DropdownMenu
            data={projectsList}
            placeholder="Select Project"
            value={taskData.project_id}
            setValue={setTaskData}
            label="project_id"
            originalObj={taskData}
            setErrorState={setProjectError}
            disable={true}
          /> */}
          {/* {projectError ? (
            <Text style={styles.errorText}>{projectError}</Text>
          ) : null} */}

          <Text style={styles.fieldName}>Task Name:</Text>
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

          <Text style={styles.fieldName}>Status:</Text>
          <DropdownMenu
            data={[
              { label: "New", value: 1 },
              { label: "In Progress", value: 2 },
              { label: "Completed", value: 3 },
            ]}
            placeholder="Select Project"
            value={taskData.status}
            setValue={setTaskData}
            label="status"
            originalObj={taskData}
            setErrorState={setProjectError}
          />

          <Text style={styles.fieldName}>Tags:</Text>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            data={tagsList}
            labelField="label"
            valueField="value"
            placeholder="Select Tags"
            searchPlaceholder="Search..."
            value={taskData.tags_id || []}
            onChange={(item) => {
              setTaskData({ ...taskData, tags_id: item });
              console.log(taskData);
            }}
            selectedStyle={styles.selectedStyle}
          />

          <Text style={styles.fieldName}>Contractor:</Text>
          <DropdownMenu
            data={contractorsList}
            placeholder="Select Contractor"
            value={taskData.contractor_id}
            setValue={setTaskData}
            label="contractor_id"
            originalObj={taskData}
            setErrorState={setContractorError}
          />
          {contractorError ? (
            <Text style={styles.errorText}>{contractorError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Task Description:</Text>
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

          <View style={styles.uploadFileSec}>
            <Text style={[styles.file, styles.fieldName]}>Upload File</Text>
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
          </View>
          {isFilePicked &&
            documents.map((doc, idx) => (
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // width: "70%",
                    justifyContent: "space-between",
                    padding: 4,
                  }}
                >
                  <Text
                    // style={{
                    //   width: "30%",
                    // }}
                    numberOfLines={1}
                  >
                    {doc.uri}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "red",
                      padding: 8,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      const tempList = documents.filter(
                        (doc, index) => index != idx
                      );
                      setDocuments([...tempList]);
                    }}
                  >
                    <Icon name="trash" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // width: "70%",
                    justifyContent: "space-between",
                    padding: 4,
                  }}
                >
                  <Image
                    source={{
                      uri: doc.uri,
                    }}
                    style={{ width: 150, height: 150, margin: 10 }}
                  />
                  <View>
                    <Text>Status: </Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={doc?.status ? "#fff" : "#fff"}
                      ios_backgroundColor="#3e3e3e"
                      onChange={() => handleDocumentStatus(doc?.id, idx)}
                      value={doc?.status == 1 ? true : false}
                    />

                    <Text>Approve: </Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={doc?.doc_approval ? "#fff" : "#fff"}
                      ios_backgroundColor="#3e3e3e"
                      onChange={() => handleDocumentApproval(doc?.id, idx)}
                      value={doc?.doc_approval == 1 ? true : false}
                    />
                  </View>
                </View>
              </View>
            ))}
          {documentError ? (
            <Text style={styles.errorText}>{documentError}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.addButton,
              { width: "95%", alignSelf: "center", marginVertical: 10 },
            ]}
            onPress={() => pickImage(setBeforeImage)}
          >
            <Text style={styles.addText}>Task Image Before Start</Text>
          </TouchableOpacity>
          {/* View Uploaded Job Image */}
          {beforeImage && (
            <Image
              source={{ uri: beforeImage }}
              style={{ width: 150, height: 150, margin: 10 }}
            />
          )}

          <TouchableOpacity
            style={[
              styles.addButton,
              { width: "95%", alignSelf: "center", marginVertical: 10 },
            ]}
            onPress={() => pickImage(setAfterImage)}
          >
            <Text style={styles.addText}>Task Image After Completion</Text>
          </TouchableOpacity>
          {afterImage && (
            <Image
              source={{ uri: afterImage }}
              style={{ width: 150, height: 150, margin: 10 }}
            />
          )}

          <Text style={styles.fieldName}>Task Cost:</Text>
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

          <Text style={styles.fieldName}>Start Date:</Text>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />
          <Pressable
            onPress={() => {
              setStartDateVisibility(true);
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
            name="start_date"
            value={taskData.start_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {taskData.start_date ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {taskData.start_date}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                Start Date
              </Text>
            )}
          </Pressable>
          {startDateError ? (
            <Text style={styles.errorText}>{startDateError}</Text>
          ) : null}

          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
          <Text style={styles.fieldName}>End Date:</Text>
          <Pressable
            onPress={() => {
              setEndDateVisibility(true);
              // setTaskData({
              //   ...taskData,
              //   end_date: moment(taskData.endDate).format("MM/DD/YYYY"),
              // });
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
            name="endDate"
            value={taskData.end_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {taskData.end_date ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {taskData.end_date}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>End Date</Text>
            )}
          </Pressable>
          {deadlineError ? (
            <Text style={styles.errorText}>{deadlineError}</Text>
          ) : null}
        </View>

        <View style={styles.bothButtons}>
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text style={{ color: "#ffff" }}>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.submitButton, styles.cancelBtn]}
          >
            <Text style={{ color: "#696cff" }}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditTask;

const DropdownMenu = ({
  data,
  placeholder,
  value,
  setValue,
  label,
  originalObj,
  setErrorState,
  disable = false,
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
      disable={disable}
    />
  );
};

const styles = StyleSheet.create({
  selectedStyle: {
    borderRadius: 12,
  },
  dropdown: {
    height: 44,
    fontSize: 16,
    marginTop: 2,
    padding: 5,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    width: "100%",
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
    padding: 10,
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
  },

  input: {
    width: "100%",
    fontSize: 16,
    marginTop: 2,
    padding: 5,
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 44,
    minWidth: "100%",
    borderColor: "gray",
    borderWidth: 0.5,
  },

  addButton: {
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
    marginTop: 20,
    marginHorizontal: "auto",
  },

  addText: {
    color: "#fff",
  },

  bothButtons: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 10,
  },

  uploadFileSec: {
    marginBottom: 10,
  },

  cancelBtn: {
    backgroundColor: "transparent",
    borderColor: "#696cff",
    borderWidth: 1,
  },

  submitButton: {
    marginTop: 15,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "100%",
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
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
