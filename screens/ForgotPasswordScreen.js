import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  ToastAndroid,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { apiSendForgotPasswordCode, handlererrors } from "../apis/auth";
import Toast from "react-native-root-toast";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //handle change in input
  const handleChange = (text) => {
    setEmail(text);
    validateEmail(text);
  };

  //validate email
  const validateEmail = (email) => {
    if (email == "") {
      setEmailError("Email is required*");
      return;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (!reg.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  //handle form submit
  const handleSubmit = async () => {
    if (validateEmail(email)) {
      try {
        setIsLoading(true);
        const res = await apiSendForgotPasswordCode({ email: email });
        console.log(res.data);
        // console.log(res);
        if (res.status == 200) {
          Toast.show("Code Sent", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.navigate("OTP", { email });
        }
        setIsLoading(false);
        // navigation.navigate("OTP", { email });
      } catch (error) {
        setIsLoading(false);
        Toast.show("Invalid Email", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error.response.data);
        handlererrors(error,navigation)
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text style={styles.heading}>Enter your email address</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          name="email"
          placeholder="Email"
          value={email}
          onChangeText={(text) => handleChange(text)}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      <Pressable
        onPress={() => {
          handleSubmit();
          Keyboard.dismiss();
        }}
        // onPress={() => setResetTokenExists(true)}
        style={styles.submitButton}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size={22} />
        ) : (
          <Text style={styles.submitText}> Submit </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B1C47",
    marginBottom: 10,
  },

  inputContainer: {
    width: "85%",
    display: "flex",
  },

  input: {
    width: "100%",
    height: 50,
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: "100%",
    backgroundColor: "#EDEDED",
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#696cff",
    padding: 15,
    borderRadius: 8,
    width: "85%",
    alignItems: "center",
  },

  submitText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  errorText: {
    color: "red",
    fontSize: 10,
    marginBottom: 8,
  },
});

export default ForgotPasswordScreen;
