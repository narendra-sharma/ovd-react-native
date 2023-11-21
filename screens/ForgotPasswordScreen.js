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
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  //handle change in input
  const handleChange = (text) => {
    setEmail(text);
    validateEmail(text);
  };

  //validate email
  const validateEmail = (email) => {
    if (email == "") {
      setEmailError("Email is required");
      return false;
    }
    // setEmailError(null);
    // return true;

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (!reg.test(email.trim(u))) {
      setEmailError("Please enter a valid email");
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  //handle form submit
  const handleSubmit = async () => {
    try {
      if (validateEmail(email)) {
        const res = await apiSendForgotPasswordCode({ email: email });
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
          navigation.navigate("OTP", { email });
          // navigation.navigate("OTP", { email });
        } else {
          Toast.show("email does not exist", {
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
      <Text style={styles.heading}>Enter your email:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          name="email"
          placeholder="Email"
          value={email}
          onChangeText={(text) => handleChange(text)}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Pressable
          onPress={handleSubmit}
          // onPress={() => setResetTokenExists(true)}
          style={styles.submitButton}
        >
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
    borderRadius: 5,
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
