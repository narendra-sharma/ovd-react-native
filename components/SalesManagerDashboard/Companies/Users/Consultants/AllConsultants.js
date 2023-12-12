import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
  TouchableNativeFeedback,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import {
  apiChangeConsultantRole,
  apiDeleteUser,
  apiGetUsersFromUsers,
} from "../../../../../apis/users";
import Toast from "react-native-root-toast";
import { Dropdown } from "react-native-element-dropdown";
import { handlererrors } from "../../../../../apis/auth";

const randomHexColor = () => {
  return "#b7d0d1";
};

const AllConsultants = ({ navigation }) => {
  const [consultantList, setConsultantList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleRadius, setRippleRadius] = useState(10);
  const [rippleOverflow, setRippleOverflow] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const [commissionError, setCommissionError] = useState(null);
  const [allList, setAllList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllConsultants = async () => {
        setIsLoading(true);
        try{
        const res = await apiGetUsersFromUsers();
        console.log(res.data);
        // console.log(res.data.data);

        setConsultantList([...res.data.consultants]);
        setAllList([...res.data.consultants]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        handlererrors(error,navigation)
      }
      };

      getAllConsultants();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

  //validation function
  const validateCommission = (commission) => {
    if (commission == "" || commission == null) {
      setCommissionError("Commision is required*");
      return false;
    }
    return true;
  };

  //function to delete the user
  const handleDelete = async (user, userId) => {
    const deleteUser = async () => {
      try {
        const res = await apiDeleteUser(userId);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("User Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          // navigation.navigate("All Companies");
        }
      } catch (error) {
        console.log(error);
        handlererrors(error,navigation)
      }
    };
    Alert.alert(`Delete ${user}`, `Are you sure you want to delete ${user}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteUser() },
    ]);
  };

  //change consultant's role
  const handleClicked = (name, id) => {
    setModalVisible(true);
    setFormData({
      name: name,
      id: id,
    });
  };

  const changeConsultantRole = async () => {
    try {
      const res = await apiChangeConsultantRole(formData, formData.id);
      console.log(res.data);
      setDeteleFlag((prev) => !prev);
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      handlererrors(error,navigation)
    }
  };
  const handleSearch = (text) => {
    let filteredData = [...allList]
    if (text && text.length > 0) {
      filteredData = filteredData.filter((item) =>
      item?.name.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
    setConsultantList([...filteredData]);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Consultant");
          // setAddCompanyModalVisible(true);
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New
        </Text>
      </Pressable>
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
      ) : (consultantList.length>0)?<FlatList
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        // style={{ height: 100 }}
        data={consultantList}
        renderItem={({ item }) => (
          <>
            <Pressable style={styles.listItem}>
              <Pressable
                style={{ width: "72%" }}
                onPress={() => {
                  navigation.navigate("Consultant Details", { id: item.id });
                  // navigation.setOptions({ title: "Updated!" });
                }}
              >
                <Text style={styles.item}>{item.name}</Text>
              </Pressable>

              <View style={styles.iconsContainer}>
                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    navigation.navigate("Edit Consultant", {
                      id: item.id,
                    });
                    // setRippleOverflow(!rippleOverflow);
                  }}
                  background={TouchableNativeFeedback.Ripple(
                    rippleColor,
                    rippleOverflow
                  )}
                >
                  <View style={styles.touchable}>
                    <Text style={styles.text}>
                      <Icon
                        name="pen"
                        size={18}
                        color={"#444"}
                        // color="blue"
                      />
                    </Text>
                  </View>
                </TouchableNativeFeedback>

                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    handleDelete(item.name, item.id);
                    // setRippleOverflow(!rippleOverflow);
                  }}
                  background={TouchableNativeFeedback.Ripple(
                    rippleColor,
                    rippleOverflow
                  )}
                >
                  <View style={styles.touchable}>
                    <Text style={styles.text}>
                      <Icon name="trash-alt" size={18} color="#444" />
                    </Text>
                  </View>
                </TouchableNativeFeedback>

                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    // setRippleOverflow(!rippleOverflow);
                    // console.log("clicked!");
                    handleClicked(item.name, item.id);
                  }}
                  background={TouchableNativeFeedback.Ripple(
                    rippleColor,
                    rippleOverflow
                  )}
                >
                  <View style={styles.touchable}>
                    <Text style={styles.text}>
                      <Icon name="user-edit" size={18} color="#444" />
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </Pressable>
          </>
        )}
      />: (
        <View style={styles.container}>
          <Text style={{ fontWeight: "bold"}}>No Consultants Available!</Text>
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
              Update {formData.name} to Consultant Manager
            </Text>

            <Text style={styles.fieldName}>Commision: </Text>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={[
                { label: "5%", value: 5 },
                { label: "10%", value: 10 },
                { label: "15%", value: 15 },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Commission"
              value={formData.commission}
              onChange={(item) => {
                setFormData({
                  ...formData,
                  commission: item.value,
                });
                setCommissionError(null);
              }}
            />
            {commissionError ? (
              <Text style={styles.errorText}>{commissionError}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                changeConsultantRole();
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
    </ScrollView>
  );
};

export default AllConsultants;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    width: "100%",
    height: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
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
    width: "24%",
    justifyContent: "space-between",
  },

  rippleView: {
    padding: 2,
    borderRadius: 10,
    overflow: "hidden",
  },

  addButton: {
    margin: 5,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
    marginBottom: 20,
  },

  addText: {
    color: "#fff",
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
