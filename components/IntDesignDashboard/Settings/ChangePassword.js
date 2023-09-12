import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ToastAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { apiChangePasswordFromDashboard } from "../../../apis/auth";

const passwords = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = ({ navigation }) => {
  const [formData, setFormData] = useState(passwords);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const passRef = useRef(false);

  useEffect(() => {
    passRef.current = false;
    console.log(passRef.current);
  }, []);

  useEffect(() => {
    setOldPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);
  }, [navigation]);

  // useEffect(() => {});

  //handle change in input text
  const handleChange = (value, label) => {
    setFormData({ ...formData, [label]: value });

    switch (label) {
      case "oldPassword":
        if (validateOldPassword(value)) {
          setOldPasswordError(null);
          return true;
        } else {
          return false;
        }
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

  //check if the passwords are matching
  const validateOldPassword = (value) => {
    if (value == "") {
      setOldPasswordError("*Required");
      return false;
    }
    return true;
  };

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
      validateOldPassword(formData.oldPassword) &&
      formData.newPassword === formData.confirmPassword
    ) {
      try {
        const res = await apiChangePasswordFromDashboard({
          old_password: formData.oldPassword,
          password: formData.newPassword,
          password_confirmation: formData.confirmPassword,
        });
        console.log(res.data);
        if (res.status == 200) {
          ToastAndroid.show(
            "Password changed successfully",
            ToastAndroid.SHORT
          );
          navigation.navigate("Home");
        }
      } catch (error) {
        ToastAndroid.show("Password changed failed", ToastAndroid.SHORT);
        console.log(error);
      }
    }
    if (
      !validateOldPassword(formData.oldPassword) ||
      !validatePassword(formData.newPassword) ||
      !validateConfirmPassword(formData.confirmPassword)
    ) {
      console.log("no");
    }
    if (
      !validatePassword(formData.newPassword) ||
      !validateConfirmPassword(formData.confirmPassword)
    ) {
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
      {/**********  INPUT PASSWORDS VIEW *********/}
      <View style={{ width: "80%", display: "flex" }}>
        <Text>Enter Old Password: </Text>
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
            ref={passRef}
            autoCorrect={false}
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChangeText={(text) => handleChange(text, "oldPassword")}
            secureTextEntry={isOldPasswordVisible ? false : true}
          />
          {formData.oldPassword.length > 0 && passRef ? (
            <Icon
              onPress={() => setIsOldPasswordVisible((prev) => !prev)}
              name={isOldPasswordVisible ? "eye-slash" : "eye"}
              size={20}
            />
          ) : null}
        </View>
        {oldPasswordError ? (
          <Text style={styles.errorText}>{oldPasswordError}</Text>
        ) : null}

        <Text>Enter New Password: </Text>
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
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChangeText={(text) => handleChange(text, "newPassword")}
            secureTextEntry={isNewPasswordVisible ? false : true}
          />
          {formData.newPassword.length > 0 ? (
            <Icon
              onPress={() => setIsNewPasswordVisible((prev) => !prev)}
              name={isNewPasswordVisible ? "eye-slash" : "eye"}
              size={20}
            />
          ) : null}
        </View>
        {newPasswordError ? (
          <Text style={styles.errorText}>{newPasswordError}</Text>
        ) : null}

        <Text>Confirm New Password: </Text>
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
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange(text, "confirmPassword")}
            secureTextEntry={isConfirmPasswordVisible ? false : true}
          />
          {formData.confirmPassword.length > 0 ? (
            <Icon
              onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
              name={isConfirmPasswordVisible ? "eye-slash" : "eye"}
              size={20}
            />
          ) : null}
        </View>
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

export default ChangePassword;

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
