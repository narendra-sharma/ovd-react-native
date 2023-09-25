import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { apiAuth } from "../apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import Toast from "react-native-root-toast";

const initialValues = {
  username: "",
  password: "",
};

const AuthScreen = ({ navigation }) => {
  //state for password and username
  const [formData, setFormData] = useState(initialValues);
  //state for email error
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const checkUserExists = async () => {
      const profile = await AsyncStorage.getItem("profile");
      const firstLogin = await AsyncStorage.getItem("firstLogin");
      const parsedProfile = JSON.parse(profile);
      console.log(parsedProfile.user_type);

      if (parsedProfile.user_type) {
        setUserType(parsedProfile.user_type); // Set the user type in the state
      }

      // if (JSON.parse(firstLogin) == 1) {
      handleUserType(parsedProfile.user_type);
      // }
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
      case "username":
        return validateUsername(value);
      case "password":
        return validatePassword(value);
      default:
        return;
    }
  };

  //handle email validation
  const validateUsername = (username) => {
    if (username == "") {
      setUsernameError("Username is required");
      return false;
    }

    setUsernameError(null);
    return true;

    // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    // if (reg.test(email) === false) {
    //   setUsernameError("Please Enter a valid email address");
    //   return false; //return false if in wrong format
    // } else {
    //   setUsernameError(null);
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
        Toast.show("This is a message", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        return;
      case 2:
        //userCode: 2 => admin
        navigation.navigate("Admin Dashboard");
        Toast.show("Logged in successfully", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
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
    if (formData.password.length > 0 && validateUsername(formData.username)) {
      //call the api function
      try {
        const res = await apiAuth(formData);
        console.log(res.data);
        setToken(JSON.stringify(res.data.token));
        setProfile(JSON.stringify(res.data.users));
        if (res.data.first_login == 0) {
          navigation.navigate("First Login");
        } else if (res.status == 200) {
          // handleUserType(16);
          handleUserType(
            res.data.users.user_type,
            res.data.token,
            res.data.users
          );
          // navigation.navigate("Dashboard");
        }
        // await AsyncStorage.setItem("firstLogin", res.data.first_login);
      } catch (error) {
        Toast.show("Invalid Credentials", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error);
      }

      // window.localStorage.setItem("token", JSON.stringify(res.data.token));
      // const token = window.localStorage.getItem("token");
      // console.log(token);

      // console.log(jwtDecode(res.data.token));
    }
    if (!validateUsername(formData.username)) {
      //   setUsernameError("Please enter a valid email address");
      console.log(usernameError);
    }
    if (formData.password.length == 0) {
      setPasswordError("Password is required");
      console.log("password is missing");
    }
  };

  return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", position: "relative" }}>
        <View style={styles.containerMain}>

          <Text style={styles.heading}>Login</Text>

        {/**********  INPUTS VIEW *********/}
        <View style={{ width: "100%", display: "flex" }}>
          <TextInput
            style={styles.input}
            name="username"
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => handleChange(text, "username")}
            type="username"
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}

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
              style={styles.passwordInput}
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
            <Text style={{textAlign:'center'}}>Forgot Password? Click here</Text>
          </Pressable>
        </View>
      </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",

    fontWeight: "bold",
  },
  containerMain: {
    width: "85%",
    marginHorizontal: "auto",
  },
  input: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    borderWidth: 1,
    height: 44,
    marginBottom: 5,
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    width: "100%",
  },
  passwordInput: {
    fontSize: 16,
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
    textAlign: "center",
    fontSize: 16,
  },

  opacity: {
    margin: 20,
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
