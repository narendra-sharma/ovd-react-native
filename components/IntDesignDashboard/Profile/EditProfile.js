import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/FontAwesome";
import { apiGetProfileDetails, apiUpdateProfile, handlererrors } from "../../../apis/auth";

// import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const initialUserData = {
  // name: "",
  // email: "",
  // organization: "",
  // phonenumber: "",
  // address: "",
  // country: "",
  // state: "",
  // zipcode: "",
  // latitude: "",
  // longitude: "",
};

const EditProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(initialUserData);
  const [isFocus, setIsFocus] = useState(false);

  const [nameError, setNameError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [orgError, setOrgError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [countryError, setCountryError] = useState(null);
  const [stateError, setStateError] = useState(null);
  const [zipcodeError, setZipcodeError] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const res = await apiGetProfileDetails();
        // console.log("we got from api: ", res.data);
        setUserData(res.data.users);
        await AsyncStorage.setItem("profile", JSON.stringify(res.data.users));
        // const user = await AsyncStorage.getItem("profile");
        // const parsedUser = JSON.parse(user);
        // setUserData({
        //   ...parsedUser,
        // });
        // console.log(userData);
      } catch (err) {
        console.log(err);
        handlererrors(err,navigation)
      }
    };

    getProfileData();
  }, []);

  //validation functions
  const validateName = (name) => {
    if (name == "") {
      setNameError("Name is required*");
      return false;
    }
    return true;
  };

  const validateUsername = (username) => {
    if (username == "") {
      setUsernameError("Username is required*");
      return false;
    }
    return true;
  };

  const validateOrg = (org) => {
    if (org == "") {
      setOrgError("Organization is required*");
      return false;
    }
    return true;
  };

  const validatePhone = (num) => {
    if (num == "" || num == null) {
      setPhoneError("Phone number is required*");
      return false;
    }
    // return true;

    let reg = /^[0-9]{8}$/g;

    if (reg.test(num) === false) {
      setPhoneError("Please Enter a valid phone number");
      return false; //return false if in wrong format
    } else {
      setPhoneError(null);
      return true; //return true if in right format
    }
  };

  const validateAddress = (address) => {
    if (address == "") {
      setAddressError("Address is required*");
      return false;
    }
    return true;
  };

  const validateCountry = (country) => {
    if (country == "" || country == null) {
      setCountryError("Country is required*");
      return false;
    }
    return true;
  };

  const validateZipcode = (zipcode) => {
    if (zipcode == "" || zipcode == null) {
      setZipcodeError("Zip code is required*");
      return false;
    }
    return true;
  };

  const validateState = (state) => {
    if (state == "" || state == null) {
      setStateError("State is required*");
      return false;
    }
    return true;
  };

  //handle form submit
  const handleSubmit = async () => {
    if (
      validateName(userData.name) &&
      validateUsername(userData.username) &&
      // validateOrg(userData.org) &&
      validatePhone(userData.phone_number) &&
      validateAddress(userData.address) &&
      // validateCountry(userData.country) &&
      // validateState(userData.state) &&
      validateZipcode(userData.zip_code)
    ) {
      try {
        const res = await apiUpdateProfile({
          ...userData,
          name: userData.name,
          phonenumber: userData.phone_number,
          address: userData.address,
          org: userData.org,
          state: userData.state,
          country: userData.country,
          country_code: userData.country_code,
          latitude: userData.lat,
          longitude: userData.long,
          zipcode: userData.zip_code,
        });
        // console.log(userData);
        //   console.log(res);
        if (res.status == 200) {
          Toast.show("Profile updated successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          const resp = await apiGetProfileDetails();
          console.log("we got from api: ", res.data);
          setUserData(resp.data.users);
          await AsyncStorage.setItem(
            "profile",
            JSON.stringify(resp.data.users)
          );

          navigation.navigate("My Profile");
        }
        //   console.log(res.data);
      } catch (error) {
        console.log(error);
        console.log("errors: ", error?.response?.data);
        handlererrors(error,navigation)

        let msg = "";

        Object.keys(error?.response?.data?.errors).map(
          (key) => (msg += error?.response?.data?.errors[key] + " ")
        );

        if (msg == "") {
          msg += "Server Error";
        }

        Toast.show(msg, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    } else {
      validateUsername(userData.username);
      validateName(userData.name);
      // validateOrg(userData.org);
      validatePhone(userData.phone_number);
      validateAddress(userData.address);
      // validateCountry(userData.country);
      // validateState(userData.state);
      validateZipcode(userData.zip_code);
    }
  };

  // const handleUploadPhoto = async () => {
  //   const options = {
  //     selectionLimit: 1,
  //     mediaType: "photo",
  //     includeBase64: false,
  //   };
  //   const result = await launchImageLibrary(options);
  // };

  // const allCountries = Country.getAllCountries().map((country) => {
  //   return {
  //     label: country.name,
  //     value: country.isoCode,
  //   };
  // });

  // console.log(allCountries);

  // const renderLabel = () => {
  //   if (value || isFocus) {
  //     return (
  //       <Text style={[styles.label, isFocus && { color: "blue" }]}>
  //         Dropdown label
  //       </Text>
  //     );
  //   }
  //   return null;
  // };

  return (
    <View style={styles.centeredView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center" }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={userData.name}
            onChangeText={(text) => {
              setUserData({ ...userData, name: text });
              setNameError(null);
            }}
            placeholder="Name"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          {/* <Text style={styles.fieldName}>Username:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={userData.username}
            onChangeText={(text) => {
              setUserData({ ...userData, username: text });
              setUsernameError(null);
            }}
            placeholder="Username"
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null} */}

          <Text style={styles.fieldName}>Organization:</Text>
          <TextInput
            style={styles.input}
            name="organization"
            placeholder="Organisation"
            value={userData.org}
            onChangeText={(text) => {
              setUserData({ ...userData, org: text });
              setOrgError(null);
            }}
          />
          {orgError ? <Text style={styles.errorText}>{orgError}</Text> : null}
          <Text style={styles.fieldName}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            placeholder="Phone Number"
            value={userData.phone_number}
            onChangeText={(text) => {
              setUserData({ ...userData, phone_number: text });
              setPhoneError(null);
            }}
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
          <Text style={styles.fieldName}>Address:</Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            autoFocus={true}
            listViewDisplayed="auto"
            returnKeyType={"search"}
            fetchDetails={true}
            textInputProps={{
              value: userData.address,
              onChangeText: (text) => {
                setAddressError(null);
                setCountryError(null);
                setStateError(null);
                setZipcodeError(null);
                setUserData({ ...userData, address: text });
              },
            }}
            onPress={(data, details = null) => {
              // console.log("details: ", details);
              console.log(
                "details.address_components: ",
                details.address_components
              );

              // const countryIndex = details.address_components.findIndex(
              //   (obj) => obj.types[0] == "country"
              // );

              // const stateIndex = details.address_components.findIndex(
              //   (obj) => obj.types[0] == "administrative_area_level_1"
              // );

              // const zipIndex = details.address_components.findIndex(
              //   (obj) => obj.types[0] == "postal_code"
              // );

              const countryName =
                details.address_components[
                  details.address_components.findIndex(
                    (obj) => obj.types[0] == "country"
                  )
                ]?.long_name;

              const countryCode =
                details.address_components[
                  details.address_components.findIndex(
                    (obj) => obj.types[0] == "country"
                  )
                ]?.short_name;

              const stateName =
                details.address_components[
                  details.address_components.findIndex(
                    (obj) => obj.types[0] == "administrative_area_level_1"
                  )
                ]?.long_name;

              const areaZip = details.address_components[
                details.address_components.findIndex(
                  (obj) => obj.types[0] == "postal_code"
                )
              ]?.long_name
                ? details.address_components[
                    details.address_components.findIndex(
                      (obj) => obj.types[0] == "postal_code"
                    )
                  ]?.long_name
                : null;

              console.log(
                details.formatted_address,
                " ",
                stateName,
                " ",
                countryName,
                " ",
                countryCode,
                " ",
                areaZip
              );

              // props.notifyChange(details.geometry.location, data);

              setUserData({
                ...userData,
                lat: details.geometry.location.lat,
                long: details.geometry.location.lng,
                address: details.formatted_address,
                state: stateName,
                zip_code: areaZip,
                country_code: countryCode,
                country: countryName,
              });

              //   console.log(userData);
            }}
            query={{
              key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
              language: "en",
              components: "country:sg",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={placesStyle}
          />
          {addressError ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}

          {/* <Text style={styles.fieldName}>Country: </Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={Country.getAllCountries().map((country) => {
              return {
                label: country.name,
                value: country.isoCode,
              };
            })}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Country"
            searchPlaceholder="Search..."
            value={userData.country_code}
            onChange={(item) => {
              setCountryError(null);
              setUserData({
                ...userData,
                country_code: item.value,
                country: item.label,
                state: null,
              });
            }}
          />
          {countryError ? (
            <Text style={styles.errorText}>{countryError}</Text>
          ) : null}

          <Text style={styles.fieldName}>State/UT: </Text>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={State.getStatesOfCountry(userData.country_code).map(
              (state) => {
                return { label: state.name, value: state.name };
              }
            )}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select State/UT"
            searchPlaceholder="Search..."
            value={userData.state}
            onChange={(item) => {
              setUserData({ ...userData, state: item.label });
              setStateError(null);
            }}
          />
          {stateError ? (
            <Text style={styles.errorText}>{stateError}</Text>
          ) : null} */}

          <Text style={styles.fieldName}>Zip Code: </Text>
          <TextInput
            style={styles.input}
            name="zip_code"
            value={userData.zip_code}
            placeholder="Zip Code"
            onChangeText={(text) => {
              setUserData({ ...userData, zip_code: text });
              setZipcodeError(null);
            }}
          />
          {zipcodeError ? (
            <Text style={styles.errorText}>{zipcodeError}</Text>
          ) : null}
        </View>
        <View style={styles.bothButtons}>
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text style={{ color: "#ffff" }}>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.submitButton, styles.cancelBtn]}
          >
            <Text style={{ color: "#696cff" }}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const placesStyle = StyleSheet.create({
  textInputContainer: {
    // backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: "100%",
    borderColor: "gray",
  },
  textInput: {
    backgroundColor: "transparent",
    height: 45,
    color: "#5d5d5d",
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: "gray",
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  listView: {
    color: "black",
    borderColor: "gray",
    maxWidth: "100%",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "blue",
  },
  description: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 14,
    maxWidth: "89%",
  },
});

const styles = StyleSheet.create({
  centeredView: {
    display: "flex",
    padding: 22,
    width: "100%",
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
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

  bothButtons: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 10,
  },

  cancelBtn: {
    backgroundColor: "transparent",
    borderColor: "#696cff",
    borderWidth: 1,
  },

  submitText: {
    color: "white",
    justifyContent: "center",
  },

  opacity: {
    margin: 20,
  },

  fieldName: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
