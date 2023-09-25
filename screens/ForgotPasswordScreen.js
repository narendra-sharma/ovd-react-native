import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
} from "react-native";
import { apiSendForgotPasswordCode } from "../apis/auth";
import Toast from "react-native-root-toast";

const ForgotPasswordScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(null);

  //handle change in input
  const handleChange = (text) => {
    setUsername(text);
    validateUsername(text);
  };

  //validate username
  const validateUsername = (username) => {
    if (username == "") {
      setUsernameError("Username is required");
      return false;
    }
    setUsernameError(null);
    return true;

    // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    // if (!reg.test(username)) {
    //   setUsernameError("Please enter a valid username");
    //   return false;
    // } else {
    //   setUsernameError(null);
    //   return true;
    // }
  };

  //handle form submit
  const handleSubmit = async () => {
    try {
      if (validateUsername(username)) {
        const res = await apiSendForgotPasswordCode({ username: username });
        console.log(res.data);
        if (res.data.success == true) {
          Toast.show("Code Sent", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.navigate("OTP", { username });
          // navigation.navigate("OTP", { username });
        } else {
          Toast.show("Username does not exist", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      }
    } catch (error) {
      Toast.show("Something went wrong!", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={styles.heading}>Enter your username:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          name="username"
          placeholder="Username"
          value={username}
          onChangeText={(text) => handleChange(text)}
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}

        <Pressable
        onPress={handleSubmit}
        // onPress={() => setResetTokenExists(true)}
        style={styles.submitButton}>
        
        <Text style={styles.submitText}>Submit</Text>
      </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },

  inputContainer: {
    width: "85%",
    marginHorizontal: "auto",
  },

  input: {
    borderWidth: 1,
    height: 44,
    marginBottom: 5,
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    width: "100%",
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 34,
    width: "100%",
    alignItems: "center",
  },

  submitText: {
    color: "white",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});

export default ForgotPasswordScreen;
