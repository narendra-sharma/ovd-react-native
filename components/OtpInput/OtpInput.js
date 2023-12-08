import React, { useRef, useState, useEffect } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  Button,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { apiVerifyOtp, handlererrors } from "../../apis/auth";
import Countdown from "./ResendOtp";
import ResendOtp from "./ResendOtp";
import Toast from "react-native-root-toast";

const OtpInput = ({
  code,
  setCode,
  setIsPinReady,
  maximumLength,
  navigation,
  isPinReady,
  route,
}) => {
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);
  const inputRef = useRef();

  // console.log(route, code);

  useEffect(() => {
    // update pin ready status
    setIsPinReady(code.length === maximumLength);
    // clean up function
    if (isPinReady) Keyboard.dismiss;
    return () => {
      setIsPinReady(false);
    };
  }, [code]);

  const boxArray = new Array(maximumLength).fill(0);

  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    inputRef.current.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  const handleSubmit = async () => {
    try {
      Toast.show("Please Wait", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      const res = await apiVerifyOtp({
        email: route.params.email,
        otp: code,
      });
      if (res.data.status == true) {
        Toast.show("OTP Verified", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        navigation.navigate("Reset Password", {
          email: route.params.email,
          otp: code,
        });
      } else {
        Toast.show("OTP validation failed", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      console.log(res);
    } catch (error) {
      Toast.show("OTP validation failed", {
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
  };

  return (
    <Pressable style={styles.otpInputContainer} onPress={Keyboard.dismiss}>
      <View style={styles.otpInputContainer}>
        <Text style={{ fontSize: 16 }}>Enter the 4-digit code:</Text>
        <Pressable
          onPress={handleOnPress}
          style={styles.splitOTPBoxesContainer}
        >
          {boxArray.map((num, index) => {
            const emptyInput = "";
            const digit = code[index] || emptyInput;

            const isCurrentValue = index === code.length;
            const isLastValue = index === maximumLength - 1;
            const isCodeComplete = code.length === maximumLength;

            const isValueFocused =
              isCurrentValue || (isLastValue && isCodeComplete);

            return (
              <View
                style={
                  isInputBoxFocused && isValueFocused
                    ? styles.splitBoxesFocused
                    : styles.splitBoxes
                }
                key={index}
              >
                <Text style={styles.splitBoxText}> {digit} </Text>
              </View>
            );
          })}
        </Pressable>

        <TextInput
          value={code}
          onChangeText={setCode}
          maxLength={maximumLength}
          style={styles.textInputHidden}
          ref={inputRef}
          onBlur={handleOnBlur}
        />

        <TouchableOpacity
          disabled={!isPinReady}
          onPress={handleSubmit}
          // onPress={() => navigation.navigate("Reset Password")}
          style={
            isPinReady
              ? styles.submitButton
              : [styles.submitButton, { backgroundColor: "gray" }]
          }
        >
          <Text style={styles.submitText}> Submit </Text>
        </TouchableOpacity>

        <ResendOtp email={route?.params?.email} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  otpInputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textInputHidden: {
    borderWidth: 1,
    height: 35,
    marginBottom: 5,
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    width: 300,
    position: "absolute",
    opacity: 0,
  },

  splitOTPBoxesContainer: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
    marginTop: 12,
  },

  splitBoxes: {
    marginTop: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: "12px",
    width: 40,
    height: 45,
    display: "flex",
    justifyContent: "center",
    borderRadius: 7,
    backgroundColor: "#ffff",
  },

  splitBoxesFocused: {
    marginTop: 10,
    borderColor: "#696cff",
    borderWidth: 1,
    padding: "12px",
    width: 40,
    height: 45,
    display: "flex",
    justifyContent: "center",
    borderRadius: 7,
    backgroundColor: "#ffff",
  },

  splitBoxText: {
    textAlign: "center",
    color: "#000",
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "64%",
    alignItems: "center",
    marginBottom: 15,
  },

  submitText: {
    color: "white",
  },
});

export default OtpInput;
