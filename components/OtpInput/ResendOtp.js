import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { apiSendForgotPasswordCode } from "../../apis/auth";
import Toast from "react-native-root-toast";

const ResendOtp = ({ email }) => {
  const timeInSeconds = 60;
  const [time, setTime] = useState(timeInSeconds);
  const [resetCount, setResetCount] = useState(0);
  const timerRef = useRef(time);

  const handleResendOtp = async () => {
    Toast.show("Please wait", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
    setTime(timeInSeconds);
    timerRef.current = timeInSeconds;
    setResetCount((prev) => prev + 1);
    try {
      const res = await apiSendForgotPasswordCode({ email });
      console.log(res.data);
      if (res.status == 200) {
        Toast.show("Code sent", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
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
          <Text style={{ fontSize: 16, marginRight: 8 }}>
            Did not receive OTP?{" "}
          </Text>
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
    // width: "64%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#696cff",
    paddingHorizontal: 4,
  },

  submitText: {
    color: "#696cff",
    display: "flex",
    flexDirection: "row",
    fontSize: 16,
  },
});
