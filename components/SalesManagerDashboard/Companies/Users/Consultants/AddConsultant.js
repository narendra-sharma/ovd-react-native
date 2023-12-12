import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import Toast from "react-native-root-toast";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import { apiCreateNewUser } from "../../../../../apis/users";
import { apiGetAllUsers } from "../../../../../apis/companies";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handlererrors } from "../../../../../apis/auth";

const CONSULTANT_USER_TYPE = 4;

const initialFormData = {
  name: "",
  username: "",
  email: "",
  parent_id: "",
  org: "",
  phone_number: "",
  address: "",
  zip_code: "",
  country: "",
  country_code: "",
  state: "",
  user_type: CONSULTANT_USER_TYPE,
  lat: "",
  long: "",
};

const AddConsultant = ({ navigation }) => {
  const [formData, setFormData] = useState(initialFormData);

  const [nameError, setNameError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [orgError, setOrgError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [countryError, setCountryError] = useState(null);
  const [stateError, setStateError] = useState(null);
  const [zipcodeError, setZipcodeError] = useState(null);
  const [responseError, setResponseError] = useState(null);
  const [cmError, setCmError] = useState(null);
  const [commissionError, setCommissionError] = useState(null);

  const [consultantManagerList, setConsultantManagerList] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await apiGetAllUsers();
      // console.log(res.data.data);

      const consultantManager = res.data.data.filter(
        (user) => user.user_type == 3
      );

      // const tempConsultantManager = consultantManager.map((manager) => {
      //   return { label: manager.name, value: manager.id };
      // });

      // setConsultantManagerList([...tempConsultantManager]);

      
        (async() => {
          const user = await AsyncStorage.getItem("profile")
          setFormData({...formData, parent_id: JSON.parse(user).id })
        })();
      
    };
    getAllUsers();
  }, []);
  

  //validation functions
  const validateName = (name) => {
    if (name == "") {
      setNameError("Name is required*");
      return false;
    }
    return true;
  };

  const validateCommission = (commission) => {
    if (commission == "" || commission == null) {
      setCommissionError("Commision is required*");
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

  const validateCm = (cm) => {
    if (cm == "" || null) {
      setCmError("Consultant manager is required*");
      return false;
    }
    return true;
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

  const validateEmail = (email) => {
    if (email == "" || email == null) {
      setEmailError("Email is required*");
      return false;
    }

    // setEmailError(null);
    // return true;

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (reg.test(email) === false) {
      setEmailError("Please Enter a valid email address");
      return false; //return false if in wrong format
    } else {
      setEmailError(null);
      return true; //return true if in right format
    }
  };

  //handle submit
  const handleSubmit = async () => {
    if (
      validateName(formData.name) &&
      // validateUsername(formData.username) &&
      // validateOrg(formData.org) &&
      validateCommission(formData.commission) &&
      validatePhone(formData.phone_number) &&
      // validateCm(formData.parent_id) &&
      validateAddress(formData.address) &&
      // validateCountry(formData.country) &&
      // validateState(formData.state) &&
      validateZipcode(formData.zip_code) &&
      validateEmail(formData.email)
    ) {
      try {
        console.log("final form data: ", formData);
        const res = await apiCreateNewUser({
          ...formData,
        });
        console.log("response: ");
        console.log(res);
        if (
          res.data.message ==
          "Added Successfully, We have e-mailed your login details."
        ) {
          Toast.show("New Consultant Added", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show("Cannot Add New Consultant", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
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
      // setFormData(initialFormData);
    } else {
      // validateUsername(formData.username);
      validateName(formData.name);
      // validateOrg(formData.org);
      validatePhone(formData.phone_number);
      validateAddress(formData.address);
      // validateCountry(formData.country);
      // validateState(formData.state);
      validateZipcode(formData.zip_code);
      validateEmail(formData.email);
      validateCm(formData.parent_id);
      validateCommission(formData.commission);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text style={styles.fieldName}>Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              setNameError(null);
            }}
            placeholder="Name"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          {/* <Text style={styles.fieldName}>Username: </Text>
          <TextInput
            style={styles.input}
            name="username"
            value={formData.username}
            onChangeText={(text) => {
              setFormData({ ...formData, username: text });
              setUsernameError(null);
            }}
            placeholder="Username"
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null} */}

          <Text style={styles.fieldName}>Email:</Text>
          <TextInput
            style={styles.input}
            name="email"
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              setEmailError(null);
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChangeText={(text) => {
              setFormData({ ...formData, phone_number: text });
              setPhoneError(null);
            }}
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          {/* <Text style={styles.fieldName}>Assign Consultant Manager:</Text>
          <DropdownMenu
            data={consultantManagerList}
            placeholder="Select Consultant Manager"
            value={formData.parent_id}
            setValue={setFormData}
            label="parent_id"
            originalObj={formData}
            setErrorState={setCmError}
          />
          {cmError ? <Text style={styles.errorText}>{cmError}</Text> : null} */}

          <Text style={styles.fieldName}>Commision: </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={[
              { label: "30%", value: 30 },
              { label: "40%", value: 40 },
              { label: "50%", value: 50 },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Commission"
            value={formData.commission}
            onChange={(item) => {
              setFormData({
                ...formData,
                commission: item.value,
              });
              setCommissionError(null);
            }}
          />
          {commissionError ? (
            <Text style={styles.errorText}>{commissionError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Organisation:</Text>
          <TextInput
            style={styles.input}
            name="org"
            placeholder="Organisation"
            value={formData.org}
            onChangeText={(text) => {
              setFormData({ ...formData, org: text });
              setOrgError(null);
            }}
          />
          {orgError ? <Text style={styles.errorText}>{orgError}</Text> : null}

          <Text style={styles.fieldName}>Address:</Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            autoFocus={true}
            listViewDisplayed="auto"
            returnKeyType={"search"}
            fetchDetails={true}
            textInputProps={{
              value: formData.address,
              onChangeText: (text) => {
                setFormData({ ...formData, address: text });
                setAddressError(null);
                setCountryError(null);
                setStateError(null);
                setZipcodeError(null);
              },
            }}
            onPress={(data, details = null) => {
              // console.log("details: ", details);
              console.log(
                "details.address_components: ",
                details.address_components
              );

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

              setFormData({
                ...formData,
                lat: details.geometry.location.lat,
                long: details.geometry.location.lng,
                address: details.formatted_address,
                state: stateName,
                zip_code: areaZip,
                country_code: countryCode,
                country: countryName,
              });
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
            style={[styles.dropdown]}
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
            value={formData.country_code}
            onChange={(item) => {
              setFormData({
                ...formData,
                country_code: item.value,
                country: item.label,
                state: null,
              });
              setCountryError(null);
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
            data={State.getStatesOfCountry(formData.country_code).map(
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
            value={formData.state}
            onChange={(item) => {
              setFormData({ ...formData, state: item.label });
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
            value={formData.zip_code}
            onChangeText={(text) => {
              setFormData({ ...formData, zip_code: text });
              setZipcodeError(null);
            }}
            placeholder="Zip Code"
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

export default AddConsultant;

const DropdownMenu = ({
  data,
  placeholder,
  value,
  setValue,
  label,
  originalObj,
  setErrorState,
}) => {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholder={placeholder}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      containerStyle={styles.listStyle}
      dropdownPosition="bottom"
      value={value}
      onChange={(item) => {
        setValue({ ...originalObj, [label]: item.value });
        setErrorState(null);
      }}
    />
  );
};

const placesStyle = StyleSheet.create({
  textInputContainer: {
    // backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    // maxWidth: "100%",
    // minWidth: "90%",
    borderColor: "gray",
    width: "100%",
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
  mainContainer: {
    padding: 22,
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
    marginBottom: 5,
  },

  fieldName: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
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

  submitText: {
    color: "white",
    justifyContent: "center",
  },

  opacity: {
    margin: 20,
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },

  dropdown: {
    height: 44,
    fontSize: 16,
    marginTop: 2,
    padding: 5,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 5,
  },
});