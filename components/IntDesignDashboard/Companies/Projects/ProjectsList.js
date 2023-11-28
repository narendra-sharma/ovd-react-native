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
  ActivityIndicator
} from "react-native";
import Toast from "react-native-root-toast";
import { mockProjects } from "./MockProjects";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import {
  apiChangeProjectStatus,
  apiDeleteProject,
  apiGetAllProjects,
} from "../../../../apis/projects";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native-gesture-handler";

const ProjectsList = ({ navigation, companyId }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [allList, setAllList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllProjects = async () => {
        setIsLoading(true);
        try{
        const res = await apiGetAllProjects();
        // console.log("projects", res.data.projects);
        //listing of quotes for a specific company
        if (companyId) {
          const projects = res.data.projects.filter(
            (project) => project.company_id == companyId
          );
          setProjectsList(projects);
          setAllList([...projects]);
        } else {
          //listing all projects
          setProjectsList(res.data.projects);
          setAllList([...res.data.projects]);
        }
        setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      };

      getAllProjects();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

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
      console.log("errors: ", error?.response?.data);

      let msg = "";

      Object.keys(error?.response?.data?.errors).map(
        (key) => (msg += error?.response?.data?.errors[key] + " ")
      );

      if (msg == "") {
        msg += "Server Error";
      }

      Toast.show(msg, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };
  const handleSearch = (text) => {
    let filteredData = [...allList]
    if (text && text.length > 0) {
      filteredData = filteredData.filter((proj) =>
      proj?.project_name.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
    setProjectsList([...filteredData]);
  };
  return (
    <View style={styles.container}>
      {/* SEARCHBOX CONTAINER */}
      <View style={styles.searchboxContainer}>
        <Icon
          style={{
            marginHorizontal: 6,
            // borderRightWidth: 1,
            // borderRightColor: "#d9d9d9",
          }}
          color="#d9d9d9"
          name="search"
          size={20}
        />
        <TextInput
          name="search"
          placeholder="Search"
          onChangeText={(text) => {
            handleSearch(text);
            setSearchTerm(text);
          }}
          style={{
            width: "90%",
            height: "100%",
            // backgroundColor: "pink",
            padding: 8,
          }}
          value={searchTerm}
        />
        {/* {searchTerm && searchTerm.length > 0 && (
        <TouchableOpacity 
          onPress={()=>{
            handleSearch("");
            setSearchTerm("");
          }} 
          style={{ padding: 8 }}
        >
          <Icon
            name="window-close" // Replace with the actual icon name for a close or clear icon
            size={20}
            color="#000000"
          />
        </TouchableOpacity>
      )} */}
      </View>
      {isLoading ? (
        <View style={styles.container}>
<ActivityIndicator color="#B76E79" size="large"/>
</View>
      ) : (projectsList.length>0)?<FlatList
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
                  name="check-square"
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
      />: (
        <View style={styles.container}>
          <Text style={{ fontWeight: "bold"}}>No Projects Available!</Text>
        </View>
      )}

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
  );
};

export default ProjectsList;

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
  searchboxContainer: {
    backgroundColor: "#EDEDED",
    marginBottom: 16,
    width: "96%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 4,
    padding: 4,
  },
});
