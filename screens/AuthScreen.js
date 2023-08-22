import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
  ToastAndroid,
} from "react-native";
import { apiAuth } from "../apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

//
const initialValues = {
  email: "",
  password: "",
};

const AuthScreen = ({ navigation }) => {
  //state for password and email
  const [formData, setFormData] = useState(initialValues);
  //state for email error
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  //handle change in input text
  const handleChange = (value, label) => {
    setFormData({ ...formData, [label]: value });

    switch (label) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return;
    }
  };

  //handle email validation
  const validateEmail = (email) => {
    if (email == "") {
      setEmailError("Email is required");
      return false;
    }

    setEmailError(null);
    return true;

    // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    // if (reg.test(email) === false) {
    //   setEmailError("Please Enter a valid email address");
    //   return false; //return false if in wrong format
    // } else {
    //   setEmailError(null);
    //   return true; //return true if in right format
    // }
  };

  //handle password validation
  const validatePassword = (password) => {
    if (password == "") {
      setPasswordError("Password is required");
      return false;
    } else {
      setPasswordError(null);
      return true;
    }
  };

  //handle form submit
  const handleSubmit = async () => {
    if (formData.password.length > 0 && validateEmail(formData.email)) {
      //call the api function
      try {
        const res = await apiAuth(formData);
        console.log(res.data);
        if (res.status == 200) {
          navigation.navigate("Dashboard");
          ToastAndroid.show("Logged in successfully", ToastAndroid.SHORT);
          await AsyncStorage.setItem("token", JSON.stringify(res.data.token));
          await AsyncStorage.setItem("profile", JSON.stringify(res.data.users));
        }
      } catch (error) {
        ToastAndroid.show(
          "Invalid Credentials",
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        );
        console.log(error);
      }

      // window.localStorage.setItem("token", JSON.stringify(res.data.token));
      // const token = window.localStorage.getItem("token");
      // console.log(token);

      // console.log(jwtDecode(res.data.token));
    }
    if (!validateEmail(formData.email)) {
      //   setEmailError("Please enter a valid email address");
      console.log(emailError);
    }
    if (formData.password.length == 0) {
      setPasswordError("Password is required");
      console.log("password is missing");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.heading}>Login</Text>

      {/**********  INPUTS VIEW *********/}
      <View style={{ width: "80%", display: "flex" }}>
        <TextInput
          style={styles.input}
          name="email"
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleChange(text, "email")}
          type="email"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={styles.input}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => handleChange(text, "password")}
          secureTextEntry={true}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      <Pressable
        onPress={handleSubmit}
        // onPress={() => navigation.navigate("Dashboard")}
        style={styles.submitButton}
      >
        <Text style={styles.submitText}> Login </Text>
      </Pressable>
      <Pressable
        style={styles.opacity}
        onPress={() => navigation.navigate("Forgot Password")}
      >
        <Text>Forgot Password? Click here</Text>
      </Pressable>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    width: 300,
    height: 35,
    marginBottom: 5,
    marginTop: 10,
    padding: 5,
    borderRadius: 8,
    width: "100%",
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },

  submitText: {
    color: "white",
  },

  opacity: {
    margin: 20,
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
