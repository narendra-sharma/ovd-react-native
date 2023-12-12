import Toast from 'react-native-root-toast';
import { apiGetZeroAuth } from '../../../../../apis/users';
import { useEffect } from 'react';


const LoginZeroAccountScreen = ({navigation}) => {
     
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await apiGetZeroAuth();
        const checkdata = res.data;
        console.log("Response Data 111===>" ,checkdata);
        if (checkdata.status === "true" || checkdata.message === "You are connect with xero.") {
          navigation.navigate("Add Customer")
       } else if(checkdata.status === "false" || checkdata.message === "Unauthenticated"){
          const errorMessage = "Please Contact the Admin for this problem";
          Toast.show(errorMessage, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.navigate("Home");
        } else {
          console.log("Something Went Wrong");
        } 
        }
      catch (error) {
        console.log("Error is occuring ====>",error);
      }
    };
    fetchdata();
  },[navigation]);

      return null;
};

export default LoginZeroAccountScreen;
