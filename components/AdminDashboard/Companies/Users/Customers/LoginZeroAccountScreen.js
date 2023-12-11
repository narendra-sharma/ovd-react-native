import Toast from 'react-native-root-toast';

const LoginZeroAccountScreen = ({navigation}) => {

      const checkurl = checkLoginZeroAccountStatus();
      try {
        if(checkurl){
          Toast.show("Please Contact the Admin for this problem,while we add new customer", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.navigate("Home");
        } else {
          navigation.navigate("Add Customer")
        } 
        }
      catch (error) {
        console.log("Error is occuring ====>",error);
      }
};

const checkLoginZeroAccountStatus = async () => {
    try {
      const response = await fetch('https://ovd.dev.visionvivante.com/api/auth/xero-auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      if (data.status == "false" || data.message == "Unauthenticated") {
         return false 
      } else if (data.status == "true") {
        return true 
     } else {
        console.log("Something is Went Wrong");
      }
    } catch (error) {
      console.error('Error checking login zero account status:', error);
    }
  };

export default LoginZeroAccountScreen;