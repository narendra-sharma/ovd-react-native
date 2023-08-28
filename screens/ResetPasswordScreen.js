import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ToastAndroid,
} from "react-native";
import { apiResetPassword } from "../apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const passwords = {
  newPassword: "",
  confirmPassword: "",
};

const ResetPasswordScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState(passwords);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  //handle change in input text
  const handleChange = (value, label) => {
    setFormData({ ...formData, [label]: value });

    switch (label) {
      case "newPassword":
        if (validatePassword(value)) {
          setNewPasswordError(null);
          return true;
        } else {
          return false;
        }
      case "confirmPassword":
        if (validateConfirmPassword(value)) {
          setConfirmPasswordError(null);
          return true;
        } else {
          return false;
        }
    }
  };

  console.log(route);

  //handle password validation
  const validatePassword = (password) => {
    if (password == "") {
      setNewPasswordError("*Required");
      return false;
    }

    let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

    if (reg.test(password) === false) {
      setNewPasswordError(
        "Password must contain min. 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      return false; //return false if in wrong format
    } else {
      return true; //return true if in right format
    }
  };

  //check if the passwords are matching
  const validateConfirmPassword = (value) => {
    if (value == "") {
      setConfirmPasswordError("*Required");
      return false;
    }
    if (value == formData.newPassword) {
      return true;
    } else {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
  };

  //handle form submit
  const handleSubmit = async () => {
    if (
      validatePassword(formData.newPassword) &&
      validateConfirmPassword(formData.confirmPassword) &&
      formData.newPassword === formData.confirmPassword
    ) {
      try {
        const res = await apiResetPassword({
          email: route.params.email,
          password: formData.newPassword,
          password_confirmation: formData.confirmPassword,
        });
        console.log(res);
        if (res.status == 200) {
          // await AsyncStorage.setItem("token", token);
          // await AsyncStorage.setItem("profile", profile);
          ToastAndroid.show(
            "Password changed successfully",
            ToastAndroid.SHORT
          );
          navigation.navigate("Login");
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (
      !validatePassword(formData.newPassword) ||
      !validateConfirmPassword(formData.confirmPassword)
    ) {
      console.log("no");
    }
    if (!validateConfirmPassword(formData.confirmPassword)) {
      console.log("no");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Reset Password</Text>
      {/**********  INPUT PASSWORDS VIEW *********/}
      <View style={{ width: "80%", display: "flex" }}>
        <TextInput
          style={styles.input}
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChangeText={(text) => handleChange(text, "newPassword")}
          secureTextEntry={true}
        />
        {newPasswordError ? (
          <Text style={styles.errorText}>{newPasswordError}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange(text, "confirmPassword")}
          secureTextEntry={true}
        />
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}
      </View>

      <Pressable onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "bold",
  },

  inputContainer: {
    width: "80%",
    display: "flex",
  },

  input: {
    borderWidth: 1,
    height: 35,
    marginBottom: 5,
    marginTop: 10,
    padding: 5,
    borderRadius: 8,
  },

  submitButton: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "80%",
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

export default ResetPasswordScreen;
