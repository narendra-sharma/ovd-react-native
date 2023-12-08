import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import Toast from "react-native-root-toast";
import { useFocusEffect } from "@react-navigation/native";
import { apiDeleteUser, apiGetUserDetails } from "../../../../../apis/users";
import { handlererrors } from "../../../../../apis/auth";

const ConsultantDetails = ({ navigation, route }) => {
  const [userData, setUserData] = useState({});

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getUserDetails = async () => {
        const res = await apiGetUserDetails(route.params.id);
        setUserData({ ...userData, ...res.data.users });
        console.log("user by id: ", res.data.users);
      };

      getUserDetails();
      return () => (isActive = false);
    }, [])
  );

  //function to delete the user
  const handleDelete = async (user, userId) => {
    const deleteUser = async () => {
      try {
        const res = await apiDeleteUser(userId);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          //   setDeteleFlag((prev) => !prev);
          Toast.show("User Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
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

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <View style={{ width: "90%", marginHorizontal: "auto" }}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Name</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.name} </Text>
        </View>
        {/* <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Username</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.username} </Text>
        </View> */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Email</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.email} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Phone Number</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.phone_number} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Organisation</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.org} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Address</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.address} </Text>
        </View>
        {/* <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Country</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.country} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>State / UT</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.state} </Text>
        </View> */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Zip Code</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {userData.zip_code} </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          // onPress={() => setIsCompanyEditOn(true)}
        >
          <Text
            style={styles.textStyle}
            onPress={() =>
              navigation.navigate("Edit Consultant", {
                id: userData.id,
              })
            }
          >
            Edit
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            handleDelete(userData.name, userData.id);
          }}
        >
          <Text style={styles.textStyle}>Delete User</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ConsultantDetails;

const styles = StyleSheet.create({
  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  fieldName: {
    width: "40%",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },

  fielContent: {
    width: "55%",
  },

  span: {
    width: "10%",
  },

  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  buttonsContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  button: {
    margin: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  buttonClose: {
    backgroundColor: "#696cff",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
