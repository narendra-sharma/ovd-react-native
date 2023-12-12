import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import {
  apiChangeProjectStatus,
  apiDeleteProject,
  apiGetAllProjects,
} from "../../../apis/projects";
import { apiGetAllDashboardData } from "../../../apis/dashboard";
import { handlererrors } from "../../../apis/auth";

const DashboardProjects = ({ navigation, route }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});

  // fetch project details
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (route?.params?.nearDeadline) {
        navigation.setOptions({ title: "Projects Near Deadline" });
      }

      const getAllProjects = async () => {
        const res = await apiGetAllDashboardData();
        console.log(
          "project near deadline: ",
          res?.data?.totalNearDeadlineProjects
        );
        console.log("dashboard projects", res?.data);

        if (route?.params?.active)
          setProjectsList(res?.data?.totalActiveProjects?.data);

        if (route?.params?.nearDeadline)
          setProjectsList(res?.data?.totalNearDeadlineProjects);
      };

      getAllProjects();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

  //handle project delete
  const handleDelete = async (name, id) => {
    const deleteProject = async () => {
      try {
        const res = await apiDeleteProject(id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("Project Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
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
      { text: "OK", onPress: () => deleteProject() },
    ]);
  };

  //handle open modal
  const handleClicked = (name, id, status) => {
    setModalVisible(true);
    // console.log(status);
    setFormData({
      name: name,
      id: id,
      status: status,
    });
  };

  //handle change project status API
  const changeProjectStatus = async () => {
    try {
      const res = await apiChangeProjectStatus(formData, formData.id);
      console.log(res.data);
      setDeteleFlag((prev) => !prev);
      if (res?.data?.message == "Status changed successfully.") {
        Toast.show("Project Status Changed Successfully", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
      handlererrors(error,navigation)
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Project");
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New
        </Text>
      </Pressable>

      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View
              style={[
                styles.listItem,
                {
                  backgroundColor: "#d9d9d9",
                  justifyContent: "space-between",
                },
              ]}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "55%",
                  // backgroundColor: "yellow",
                }}
              >
                <Text
                  style={[
                    styles.item,
                    {
                      fontSize: 12.5,
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                      marginRight: 4,
                    },
                  ]}
                >
                  NAME
                </Text>
                {/* <TouchableOpacity
                onPress={() => {
                  setSortLabel("title");
                  changeSortOrder();
                }}
              >
                <MaterialCommunityIcons size={25} name="sort" />
              </TouchableOpacity> */}
              </View>

              <View style={styles.iconsContainer}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.item,
                      {
                        fontSize: 12.5,
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    STATUS
                  </Text>
                  {/* <TouchableOpacity
                  onPress={() => {
                    setSortLabel("job_date");
                    changeSortOrder();
                  }}
                >
                  <MaterialCommunityIcons size={25} name="sort" />
                </TouchableOpacity> */}
                </View>

                <View>
                  <Text
                    style={[
                      styles.item,
                      {
                        fontSize: 12.5,
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    EDIT
                  </Text>
                </View>

                <View>
                  <Text
                    style={[
                      styles.item,
                      {
                        fontSize: 12.5,
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    DELETE
                  </Text>
                </View>
              </View>
            </View>
          }
          stickyHeaderIndices={[0]}
          // style={{ height: 100 }}
          data={projectsList}
          renderItem={({ item }) => (
            <>
              <Pressable
                onPress={() => {
                  navigation.navigate("Project Details", item);
                  // navigation.setOptions({ title: "Updated!" });
                }}
                style={styles.listItem}
              >
                <Text style={styles.item}>{item.project_name}</Text>
                <View style={styles.iconsContainer}>
                  <Icon
                    onPress={() =>
                      handleClicked(item.project_name, item.id, item.status)
                    }
                    name="tasks"
                    size={22}
                    color="#444"
                  />
                  <Icon
                    onPress={() => navigation.navigate("Edit Project", item)}
                    name="pen"
                    size={22}
                    color="#444"
                  />
                  <Icon
                    onPress={() => handleDelete(item.project_name, item.id)}
                    name="trash-alt"
                    size={22}
                    color="#444"
                  />
                </View>
              </Pressable>
            </>
          )}
        />

        {/* Change consultant's role modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  textAlign: "center",
                  padding: 6,
                  textDecorationLine: "underline",
                }}
              >
                Change {formData.name}'s Status
              </Text>

              <Text style={styles.fieldName}>Project Status: </Text>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={[
                  { label: "New", value: 1 },
                  { label: "In Progress", value: 2 },
                  { label: "Done", value: 3 },
                ]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Status"
                value={formData.status}
                onChange={(item) => {
                  setFormData({
                    ...formData,
                    status: item.value,
                  });
                }}
              />

              <TouchableOpacity
                style={styles.customButton}
                onPress={() => {
                  changeProjectStatus();
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.customButton}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default DashboardProjects;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
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
  },

  item: {
    padding: 10,
    fontSize: 16,
    // maxW,
  },

  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    padding: 2,
    marginHorizontal: 8,
    width: "41%",
    justifyContent: "space-around",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    minWidth: "60%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    width: 240,
  },

  customButton: {
    width: 238,
    marginTop: 10,
    backgroundColor: "#1FAAE2",
    padding: 10,
    borderRadius: 4,
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
