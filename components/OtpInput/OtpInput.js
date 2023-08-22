import React, { useRef, useState, useEffect } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  Button,
  Pressable,
  SafeAreaView,
} from "react-native";

const OtpInput = ({
  code,
  setCode,
  setIsPinReady,
  maximumLength,
  navigation,
}) => {
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);
  const inputRef = useRef();

  console.log(code);

  // useEffect(() => {
  //   // update pin ready status
  //   setIsPinReady(code.length === maximumLength);
  //   // clean up function
  //   return () => {
  //     setIsPinReady(false);
  //   };
  // }, [code]);

  const boxArray = new Array(maximumLength).fill(0);

  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    inputRef.current.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  return (
    <View style={styles.otpInputContainer}>
      <Text>Enter the 4-digit code:</Text>
      <Pressable onPress={handleOnPress} style={styles.splitOTPBoxesContainer}>
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

      <Pressable
        // onPress={handleSubmit}
        onPress={() => navigation.navigate("Reset Password")}
        style={styles.submitButton}
      >
        <Text style={styles.submitText}> Submit </Text>
      </Pressable>
    </View>
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
    borderRadius: 8,
    width: 300,
    position: "absolute",
    opacity: 0,
  },

  splitOTPBoxesContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  splitBoxes: {
    marginTop: 10,
    borderColor: "#000",
    borderWidth: 1,
    bordeRadius: "5px",
    padding: "12px",
    width: 35,
    height: 40,
  },

  splitBoxesFocused: {
    marginTop: 10,
    borderColor: "pink",
    borderWidth: 1,
    bordeRadius: "5px",
    padding: "12px",
    width: 35,
    height: 40,
  },

  splitBoxText: {
    textAlign: "center",
    color: "#000",
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "64%",
    alignItems: "center",
  },

  submitText: {
    color: "white",
  },
});

export default OtpInput;
