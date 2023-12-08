import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { apiChangePasswordFromDashboard, handlererrors } from "../../../apis/auth";
import Toast from "react-native-root-toast";
import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { useCustomActiveScreenStatus } from "../../../Contexts/ActiveScreenContext";

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

  const isFocused = useIsFocused();
  if (isFocused) {
    const { setActiveScreen } = useCustomActiveScreenStatus();
    setActiveScreen("Change Password");
  }

  const passRef = useRef(false);

  useEffect(() => {
    passRef.current = false;
    console.log(passRef.current);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      setOldPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);

      return () => (isActive = false);
    }, [])
  );

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
      setOldPasswordError("Current password is required");
      return false;
    }
    return true;
  };

  //handle password validation
  const validatePassword = (password) => {
    if (password == "") {
      setNewPasswordError("New password is required");
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
      setConfirmPasswordError("Confirm password is required");
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
          Toast.show("Password changed successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.navigate("Home");
        }
      } catch (error) {
        Toast.show("Password change failed", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error);
        handlererrors(error,navigation)
      }
    } else {
      validateOldPassword(formData.oldPassword);
      validatePassword(formData.newPassword);
      validateConfirmPassword(formData.confirmPassword);
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
      <View style={{ width: "100%", display: "flex", paddingHorizontal: 15 }}>
        <Text style={styles.fieldName}>Enter Current Password:</Text>
        <View
          style={[
            {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
            styles.input,
          ]}
        >
          <TextInput
            style={{ width: "100%" }}
            ref={passRef}
            autoCorrect={false}
            name="oldPassword"
            placeholder="Current Password"
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

        <Text style={styles.fieldName}>Enter New Password: </Text>
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
            style={{ width: "100%" }}
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

        <Text style={styles.fieldName}>Confirm New Password: </Text>
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
            style={{ width: "100%" }}
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

        <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </View>
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
    width: "100%",
    fontSize: 16,
    marginTop: 2,
    padding: 5,
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 44,
    minWidth: "100%",
    borderColor: "gray",
    borderWidth: 0.5,
  },

  submitButton: {
    marginTop: 15,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  fieldName: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
  },

  submitText: {
    color: "white",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
