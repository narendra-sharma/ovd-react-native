import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { mockData } from "./MOCK_DATA";
import Icon from "react-native-vector-icons/FontAwesome5";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { ScrollView } from "react-native-gesture-handler";
import { apiGetAllCompanies } from "../../../apis/companies";
import { useFocusEffect } from "@react-navigation/native";

const initialFormData = {
  companyName: "",
  email: "",
  phoneNo: "",
  jobs: [{}],
};

const AllCompanies = ({ navigation }) => {
  const [addCompanyModalVisible, setAddCompanyModalVisible] = useState(false);
  const [companiesList, setCompaniesList] = useState(mockData);
  const [newCompanyData, setNewCompanyData] = useState(initialFormData);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllCompanies = async () => {
        try {
          const res = await apiGetAllCompanies();
          console.log(res.data.data);
          setCompaniesList([...res.data.data]);
        } catch (err) {
          console.log(err);
        }
      };

      getAllCompanies();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const res = await apiGetAllCompanies();
        console.log(res.data.data);
        setCompaniesList([...res.data.data]);
      } catch (error) {
        console.log(error);
      }
    };
    getAllCompanies();
  }, []);

  const handleNewCompanySubmit = () => {
    setCompaniesList([...companiesList, newCompanyData]);
    setAddCompanyModalVisible(!addCompanyModalVisible);
    setNewCompanyData(initialFormData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Company");
          // setAddCompanyModalVisible(true);
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New
        </Text>
      </Pressable>

      {/* Add new company form */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={addCompanyModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setAddCompanyModalVisible(!addCompanyModalVisible);
        }}
      >
        <ScrollView contentContainerStyle={styles.centeredView}>
          <ScrollView>
            <Text>Company Name:</Text>
            <TextInput
              placeholder="Company Name"
              style={styles.input}
              name="phoneNo"
              value={newCompanyData.companyName}
              onChangeText={(text) =>
                setNewCompanyData({ ...newCompanyData, companyName: text })
              }
            />
            <Text>Email:</Text>
            <TextInput
              placeholder="Email"
              style={styles.input}
              name="email"
              value={newCompanyData.email}
              onChangeText={(text) =>
                setNewCompanyData({ ...newCompanyData, email: text })
              }
            />
            <Text>Phone Number:</Text>
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              name="phoneNo"
              value={newCompanyData.phoneNo}
              onChangeText={(text) =>
                setNewCompanyData({ ...newCompanyData, phoneNo: text })
              }
            />
            <Text>Address:</Text>
            <GooglePlacesAutocomplete
              placeholder="Search"
              autoFocus={true}
              // listViewDisplayed="auto"
              returnKeyType={"search"}
              fetchDetails={true}
              onPress={(data, details = null) => {
                // console.log("data: ", data);
                console.log("details: ", details.geometry.location);
                // props.notifyChange(details.geometry.location, data);
              }}
              query={{
                key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
                language: "en",
              }}
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={200}
              styles={placesStyle}
            />
          </ScrollView>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setAddCompanyModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleNewCompanySubmit}
            >
              <Text style={styles.textStyle}>Add</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Modal>

      <FlatList
        // style={{ height: 100 }}
        data={companiesList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("Company Details", { id: item.id });
                // navigation.setOptions({ title: "Updated!" });
              }}
              style={styles.listItem}
            >
              <Text style={styles.item}>{item.name}</Text>
              <Icon name="angle-right" size={28} />
            </Pressable>
          </>
        )}
      />
    </ScrollView>
  );
};

export default AllCompanies;

const placesStyle = StyleSheet.create({
  textInputContainer: {
    backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    maxWidth: "100%",
    minWidth: "90%",
  },
  textInput: {
    height: 45,
    color: "#5d5d5d",
    fontSize: 16,
    borderWidth: 1,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  listView: {
    color: "black",
    backgroundColor: "white",
    maxWidth: "89%",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "blue",
  },
  description: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 14,
    maxWidth: "89%",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 10,
    height: "80%",
    padding: 20,
  },

  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    height: "80%",
  },

  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  buttonClose: {
    backgroundColor: "#B76E79",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "80%",
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

  addButton: {
    margin: 5,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
