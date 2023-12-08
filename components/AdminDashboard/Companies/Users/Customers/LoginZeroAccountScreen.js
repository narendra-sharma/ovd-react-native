//import InAppBrowser from "react-native-inappbrowser-reborn";
import * as InAppPurchases from 'expo-in-app-purchases';
import { handlererrors } from '../../../../../apis/auth';

//const CREATE_CUSTOMER = "https://ovd.dev.visionvivante.com/api/auth/create-user";

const LoginZeroAccountScreen = async () => {

    try {
        const result = await InAppPurchases.connectAsync(`https://ovd.dev.visionvivante.com/xero/auth/authorize?redirect_uri=exp://192.168.1.20:8081/`);
        console.log(result);
      } catch (error) {
        console.log("Login Zero Account",error);
        console.error(error);
        handlererrors(error,navigation)
      }
            
    // const url = `https://ovd.dev.visionvivante.com/xero/auth/authorize?redirect_uri=exp://192.168.1.20:8081/`
    // try {
    //   if (await InAppBrowser.isAvailable()) {
    //     InAppBrowser.openAuth(url, deepLink, {
    //       // iOS Properties
    //       ephemeralWebSession: false,
    //       // Android Properties
    //       showTitle: false,
    //       enableUrlBarHiding: true,
    //       enableDefaultShare: false
    //     }).then((response) => {
    //       if (
    //         response.type === 'success' &&
    //         response.url
    //       ) {
    //         Linking.openURL(response.url)
    //       }
    //     })
    //   } else{ 
    //     console.log("Login Zero Account=====>",error);
    //     Linking.openURL(url)
    // }
    // } catch (error) {
    //     console.log("Login Zero Account",error);
    //   Linking.openURL(url)
    // }

};

// const checkLoginZeroAccountStatus = async () => {
//     try {
//       // Replace 'your-api-endpoint' with the actual endpoint for checking the status
//       const response = await fetch('https://ovd.dev.visionvivante.com/api/auth/xero-auth', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       if (response.status == "true") {
//         return true
//       } else if (response.status == "false") {
//          return false
//       } else {
//         console.log("Something Went Wrong");
//       }
//     } catch (error) {
//       console.error('Error checking login zero account status:', error);
//     }
//   };

export default LoginZeroAccountScreen;