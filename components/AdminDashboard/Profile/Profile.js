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
          // console.log("we got from api: ", res.data);
          setUserData(res.data.users);
          // await AsyncStorage.setItem("profile", JSON.stringify(res.data.users));
          // const user = await AsyncStorage.getItem("profile");
          // // console.log("local storage: ", user);
          // const parsedUser = JSON.parse(user);
          // setUserData({
          //   ...parsedUser,
          // });
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

  // useEffect(() => {
  //   const getProfileData = async () => {
  //     try {
  //       const res = await apiGetProfileDetails();
  //       console.log("we got from api: ", res.data);
  //       setUserData(res.data.users);
  //       // await AsyncStorage.setItem("profile", JSON.stringify(res.data.users));
  //       // const user = await AsyncStorage.getItem("profile");
  //       // // console.log("local storage: ", user);
  //       // const parsedUser = JSON.parse(user);
  //       // setUserData({
  //       //   ...parsedUser,
  //       // });
  //       console.log("local storage: ", userData);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   getProfileData();
  // }, []);

  useEffect(() => {}, [userData]);

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <>
        <View style={{ width: "85%", marginHorizontal: "auto" }}>
          {/* <View style={{ display: "flex", flexDirection: "row", margin: 10 }}>
              <Icon name="user-circle-o" size={55} />
              <Pressable
                style={{
                  backgroundColor: "#B76E79",
                  padding: 12,
                  padding: 12,
                  borderRadius: 5,
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
            <Text style={styles.fieldName}>Name </Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{userData.name}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Email</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {userData.email} </Text>
          </View>
          {/* <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Username</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {userData.username} </Text>
          </View> */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Organization</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {userData.org} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Phone Number</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {userData.phone_number} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Address</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {userData.address} </Text>
          </View>
          {/* <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>State/UT </Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {userData.state} </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Country</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {userData.country} </Text>
          </View> */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Zip Code</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}> {userData.zip_code} </Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Edit Profile")}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>Edit</Text>
        </Pressable>
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
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
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
    marginTop: 30,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    alignContent: "space-around",
    backgroundColor: "#696cff",
    marginBottom: 12,
  },

  submitText: {
    color: "white",
  },

  opacity: {
    margin: 20,
  },

  fieldName: {
    width: "40%",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },

  fielContent: {
    width: "50%",
  },

  span: {
    width: "10%",
  },

  errorText: {
    color: "red",
    fontSize: 13,
  },
});

export default Profile;
