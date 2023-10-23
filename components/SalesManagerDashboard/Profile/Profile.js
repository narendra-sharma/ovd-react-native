import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { apiGetProfileDetails, apiUpdateProfile } from "../../../apis/auth";
import { useFocusEffect } from "@react-navigation/native";

// import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const res = await apiGetProfileDetails();
          setUserData(res.data.users);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {}, [userData]);

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <>
        <View style={{ width: "80%", maxWidth: "85%" }}>
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
            <Text> {userData.org} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Phone Number: </Text>
            <Text> {userData.phone_number} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Address: </Text>
            <Text> {userData.address} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>State/UT: </Text>
            <Text> {userData.state} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Country: </Text>
            <Text> {userData.country} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Zip Code: </Text>
            <Text> {userData.zip_code} </Text>
          </View>
        </View>
        {/* <Pressable
          onPress={() => navigation.navigate("Edit Profile")}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>Edit</Text>
        </Pressable> */}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    width: "90%",
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
    borderRadius: 5,
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
    borderRadius: 5,
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
