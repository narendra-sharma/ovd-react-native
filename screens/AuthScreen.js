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
import Icon from "react-native-vector-icons/FontAwesome5";

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
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const checkUserExists = async () => {
      const profile = await AsyncStorage.getItem("profile");
      const parsedProfile = JSON.parse(profile);
      console.log(parsedProfile.user_type);

      if (parsedProfile.user_type) {
        setUserType(parsedProfile.user_type); // Set the user type in the state
      }

      handleUserType(parsedProfile.user_type);
    };

    checkUserExists();
  }, []);

  useEffect(() => {
    const setLocalStorage = async () => {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("profile", profile);
    };

    if (token || profile) setLocalStorage();
  }, [token, profile]);

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

  //handle user type dashboard screen
  const handleUserType = (userCode) => {
    console.log(userCode);
    switch (userCode) {
      case 1:
        //userCode: 1 => admin
        navigation.navigate("Admin Dashboard");
        ToastAndroid.show("Logged in successfully", ToastAndroid.SHORT);
        return;
      case 2:
        //userCode: 2 => admin
        navigation.navigate("Admin Dashboard");
        ToastAndroid.show("Logged in successfully", ToastAndroid.SHORT);
        return;
      case 3:
        //userCode: 3 => Consultant Manager / Sales Manager
        navigation.navigate("Sales Manager Dashboard");
        return;
      case 4:
        //userCode: 4 => Consultant / Interior Designer
        navigation.navigate("Interior Designer Dashboard");
        // setToken(JSON.stringify(res.data.token));
        // setProfile(JSON.stringify(res.data.users));
        return;

      case 18:
        navigation.navigate("Supplier Staff Dashboard");
        return;

      default:
        console.log("a differnt user");
        return;
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
          // handleUserType(16);
          handleUserType(
            res.data.users.user_type,
            res.data.token,
            res.data.users
          );
          // navigation.navigate("Dashboard");
          setToken(JSON.stringify(res.data.token));
          setProfile(JSON.stringify(res.data.users));
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

        <View
          style={[
            {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            },
            styles.input,
          ]}
        >
          <TextInput
            name="password"
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleChange(text, "password")}
            secureTextEntry={isPasswordVisible ? false : true}
          />
          {formData.password.length > 0 ? (
            <Icon
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={20}
            />
          ) : null}
        </View>

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
        // onPress={() => navigation.navigate("OTP")}
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
