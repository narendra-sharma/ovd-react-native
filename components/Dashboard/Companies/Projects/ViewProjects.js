import { useEffect, useState } from "react";
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
import { mockData } from "../MOCK_DATA";
import Icon from "react-native-vector-icons/FontAwesome5";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const initialFormData = {
  companyName: "",
  email: "",
  phoneNo: "",
  jobs: [{}],
};

const ViewProjects = ({ navigation }) => {
  const [addCompanyModalVisible, setAddCompanyModalVisible] = useState(false);
  const [companiesList, setCompaniesList] = useState(mockData);
  const [newCompanyData, setNewCompanyData] = useState(initialFormData);
  useEffect(() => {}, [companiesList]);

  const handleNewCompanySubmit = () => {
    setCompaniesList([...companiesList, newCompanyData]);
    setAddCompanyModalVisible(!addCompanyModalVisible);
    setNewCompanyData(initialFormData);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          setAddCompanyModalVisible(true);
          navigation.se;
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
        <View style={styles.centeredView}>
          <Text>Project Name:</Text>
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
            placeholder="Company Name"
            style={styles.input}
            name="phoneNo"
            value={newCompanyData.phoneNo}
            onChangeText={(text) =>
              setNewCompanyData({ ...newCompanyData, phoneNo: text })
            }
          />

          <View>
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
        </View>
      </Modal>

      <FlatList
        // style={{ height: 100 }}
        data={companiesList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("Project Details");
                // navigation.setOptions({ title: "Updated!" });
              }}
              style={styles.listItem}
            >
              <Text style={styles.item}>{item.companyName}</Text>
              <Icon name="angle-right" size={28} />
            </Pressable>
          </>
        )}
      />
    </View>
  );
};

export default ViewProjects;

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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: "100%",
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
  },
  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "50%",
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

  addButton: {
    margin: 10,
    backgroundColor: "#B76E79",
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
