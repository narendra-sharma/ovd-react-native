import React, { useState } from "react";
import OtpInput from "../components/OtpInput/OtpInput";

const OtpInputScreen = ({ navigation }) => {
  const [otpCode, setOtpCode] = useState("");
  const [isPinReady, setIsPinReady] = useState(false);
  const maximumCodeLength = 4;

  return (
    <>
      <OtpInput
        code={otpCode}
        setCode={setOtpCode}
        setIsPinReady={setIsPinReady}
        maximumLength={maximumCodeLength}
        navigation={navigation}
      />
    </>
  );
};

export default OtpInputScreen;
