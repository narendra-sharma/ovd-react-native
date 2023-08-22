import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/FontAwesome";
// import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const initialUserData = {
  name: "",
  email: "",
  organization: "OVD",
  phoneNo: "202 5550111",
  address: "Indian bank, jhujhar nagar",
  country: "India",
  state: "Punjab",
  zipcode: "160034",
};

const Profile = ({ navigation, isEditOn, setIsEditOn }) => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("John@mail.com");

  const [userData, setUserData] = useState(initialUserData);

  useEffect(() => {
    console.log("profile");
    const getData = async () => {
      try {
        const user = await AsyncStorage.getItem("profile");
        const parsedUser = JSON.parse(user);
        setUserData({ ...userData, ...parsedUser });
        console.log(userData);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  // const handleUploadPhoto = async () => {
  //   const options = {
  //     selectionLimit: 1,
  //     mediaType: "photo",
  //     includeBase64: false,
  //   };
  //   const result = await launchImageLibrary(options);
  // };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      {isEditOn ? (
        <ScrollView>
          <View style={styles.formContainer}>
            <Text>Name:</Text>
            <TextInput
              style={styles.input}
              name="name"
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Name"
            />
            <Text>Email:</Text>
            <TextInput
              style={styles.input}
              name="email"
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />
            <Text>Organization:</Text>
            <TextInput
              style={styles.input}
              name="organization"
              value={userData.organization}
              onChangeText={(text) =>
                setUserData({ ...userData, organization: text })
              }
            />
            <Text>Phone Number:</Text>
            <TextInput
              style={styles.input}
              name="phoneNo"
              value={userData.phoneNo}
              onChangeText={(text) =>
                setUserData({ ...userData, phoneNo: text })
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
            {/* 
            <GooglePlacesAutocomplete
              style={{ width: 300, minWidth: 80, maxWidth: 300 }}
              placeholder="Search"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              query={{
                key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
                language: "en",
              }}
            /> */}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Pressable
              onPress={() => setIsEditOn(false)}
              style={styles.submitButton}
            >
              <Text>Submit</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsEditOn(false)}
              style={styles.submitButton}
            >
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <>
          <View>
            {/* <View style={{ display: "flex", flexDirection: "row", margin: 10 }}>
              <Icon name="user-circle-o" size={55} />
              <Pressable
                style={{
                  backgroundColor: "#B76E79",
                  padding: 12,
                  padding: 12,
                  borderRadius: 8,
                  marginLeft: 10,
                  width: "70%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
                onPress={handleUploadPhoto}
              >
                <Text style={styles.submitText}>Upload New Photo</Text>
                <Icon name="edit" size={20} style={{ color: "#fff" }} />
              </Pressable>
            </View> */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldName}>Name: </Text>
              <Text>{userData.name}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldName}>Email: </Text>
              <Text> {userData.email} </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldName}>Organization: </Text>
              <Text> {userData.organization} </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldName}>Phone Number: </Text>
              <Text> {userData.phoneNo} </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldName}>Address: </Text>
              <Text> {userData.address} </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldName}>State: </Text>
              <Text> {userData.state} </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldName}>Country: </Text>
              <Text> {userData.country} </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldName}>Zip Code: </Text>
              <Text> {userData.zipcode} </Text>
            </View>
          </View>
          <Pressable
            onPress={() => setIsEditOn(true)}
            style={styles.submitButton}
          >
            <Text style={styles.submitText}>Edit</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

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

  errorText: {
    color: "red",
    fontSize: 10,
  },
});

export default Profile;
