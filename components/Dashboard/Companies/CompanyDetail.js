import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { mockData } from "./MOCK_DATA";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const initialCompanyData = {
  companyName: "",
  email: "",
  phoneNo: "",
  address: "Indian bank, jhujhar nagar",
};

const CompanyDetail = ({ navigation, route }) => {
  const [isCompanyEditOn, setIsCompanyEditOn] = useState(false);
  const [companyData, setCompanyData] = useState(initialCompanyData);

  // console.log(route.params);

  useEffect(() => {
    setCompanyData({ ...route.params });
  }, []);

  const handleSubmit = () => {
    const index = mockData.findIndex((item) => item.id == companyData.id);
    mockData[index] = { ...mockData[index], companyData };
    setIsCompanyEditOn(false);
  };

  const handleDeleteCompany = () => {
    const index = mockData.findIndex((item) => item.id == companyData.id);
    const arr = mockData.splice(index, 1);
    console.log("pressed index: ", arr);
    navigation.goBack();
  };

  return (
    <>
      {isCompanyEditOn ? (
        <View style={styles.centeredView}>
          <Text>Edit</Text>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text>Company Name:</Text>
              <TextInput
                style={styles.input}
                name="name"
                value={companyData.companyName}
                onChangeText={(text) =>
                  setCompanyData({ ...companyData, companyName: text })
                }
                placeholder="Name"
              />
              <Text>Email:</Text>
              <TextInput
                style={styles.input}
                name="email"
                value={companyData.email}
                onChangeText={(text) =>
                  setCompanyData({ ...companyData, email: text })
                }
              />
              <Text>Phone Number:</Text>
              <TextInput
                style={styles.input}
                name="phoneNo"
                value={companyData.phoneNo}
                onChangeText={(text) =>
                  setCompanyData({ ...companyData, phoneNo: text })
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
                  props.notifyChange(details.geometry.location, data);
                }}
                query={{
                  key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
                  language: "en",
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={200}
                styles={placesStyle}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            ></View>
          </ScrollView>
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.textStyle}>Submit</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setIsCompanyEditOn(false)}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.centeredView}>
          <Text style={styles.item}>{companyData.companyName}</Text>
          <View>
            <Text>Email: {companyData.email} </Text>
          </View>
          <View>
            <Text>Phone Number: {companyData.phoneNo} </Text>
          </View>
          <View>
            <Text>Location: {companyData.address} </Text>
          </View>
          <Pressable style={styles.button} onPress={handleDeleteCompany}>
            <Text style={styles.textStyle}>Delete Company</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setIsCompanyEditOn(true)}
          >
            <Text style={styles.textStyle}>Edit Company Details</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

export default CompanyDetail;

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
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  input: {
    borderWidth: 1,
    width: 300,
    height: 35,
    marginTop: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
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
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
