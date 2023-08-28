import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View, StyleSheet, ToastAndroid } from "react-native";
import { apiSendForgotPasswordCode } from "../../apis/auth";

const ResendOtp = ({ email }) => {
  const timeInSeconds = 10;
  const [time, setTime] = useState(timeInSeconds);
  const [resetCount, setResetCount] = useState(0);
  const timerRef = useRef(time);

  const handleResendOtp = async () => {
    ToastAndroid.show("Please Wait", ToastAndroid.SHORT);
    setTime(timeInSeconds);
    timerRef.current = timeInSeconds;
    setResetCount((prev) => prev + 1);
    try {
      const res = await apiSendForgotPasswordCode({ email });
      console.log(res.data);
      if (res.status == 200) {
        ToastAndroid.show("Code Sent", ToastAndroid.SHORT);
      }
    } catch (error) {
      timerRef.current = 0;
      console.log(error);
    }
  };

  console.log(timerRef.current);
  useEffect(() => {
    const timerId = setInterval(() => {
      timerRef.current -= 1;

      if (timerRef.current < 0) {
        clearInterval(timerId);
      } else {
        setTime(timerRef.current);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [resetCount]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        width: 400,
        padding: 10,
      }}
    >
      {time > 0 ? (
        <Text>Resend Code in: {time} seconds</Text>
      ) : (
        <>
          <Text>Did not receive OTP? </Text>
          <Pressable onPress={handleResendOtp} style={styles.submitButton}>
            <Text style={styles.submitText}>Resend Code</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default ResendOtp;

const styles = StyleSheet.create({
  submitButton: {
    // marginTop: 20,
    // backgroundColor: "#B76E79",
    // padding: 8,
    borderRadius: 8,
    // width: "64%",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#B76E79",
    paddingHorizontal: 4,
  },

  submitText: {
    color: "#B76E79",
    display: "flex",
    flexDirection: "row",
  },
});
