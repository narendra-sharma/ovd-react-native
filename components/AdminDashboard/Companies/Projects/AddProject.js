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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import {
  apiAddNewProject,
  apiGetProjectsDropdownData,
  apiGetQuotationsByCompanyId,
} from "../../../../apis/projects";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const initialFormData = {
  name: "",
  company: "",
  customer: "",
  // tags: [],
  description: "",
  start_date: "",
  deadline: "",
  estimated_hour: "",
  consultant: "",
  status: 1,
  address: "",
  lat: "",
  long: "",
  billing_type: "",
  contact_number: "",
};

const AddProject = ({ navigation }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);
  const [startDate, setStartDate] = useState();
  const [isStartDatePickerVisible, setStartDateVisibility] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [quotationList, setQuotationList] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [nameError, setNameError] = useState(null);
  const [companyError, setCompanyError] = useState(null);
  const [quotationError, setQuotationError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [deadlineError, setDeadlineError] = useState(null);
  const [hoursError, setHoursError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [billingError, setBillingError] = useState(null);

  useEffect(() => {
    const getAllData = async () => {
      const res = await apiGetProjectsDropdownData();
      console.log("res: ", res.data);
      const tempCompanies = res.data.companies.map((company) => {
        return { label: company.name, value: company.id };
      });
      setCompanyList([...tempCompanies]);

      const tempConsultants = res.data.consultants.map((consultant) => {
        return { label: consultant.name, value: consultant.id };
      });
      setConsultantList([...tempConsultants]);

      const tempCustomers = res.data.customers.map((customer) => {
        return { label: customer.name, value: customer.id };
      });
      setCustomersList([...tempCustomers]);
      console.log(customersList);
    };

    getAllData();
  }, []);

  useEffect(() => {
    const getQuotations = async () => {
      const res = await apiGetQuotationsByCompanyId(formData.company);
      console.log("quotes", res.data);

      const tempQuotes = res.data.data.map((quote) => {
        return { label: quote.name, value: quote.id };
      });

      setQuotationList([...tempQuotes]);
    };

    getQuotations();
  }, [formData.company]);

  //date functions
  const hideStartDatePicker = () => {
    setStartDateVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const hideEndDatePicker = () => {
    setEndDateVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    if (
      moment(startDate).format("MM/DD/YYYY") <=
      moment(date).format("MM/DD/YYYY")
    ) {
      setEndDate(date);
    } else {
      setDeadlineError("Deadline cannot be before the start date");
    }
    hideEndDatePicker();
  };

  //validation functions
  const validateProjectName = (name) => {
    if (name == "" || name == null) {
      setNameError("Project name is required*");
      return false;
    }
    return true;
  };

  const validateCompanyName = (name) => {
    if (name == "") {
      setCompanyError("Company name is required*");
      return false;
    }
    return true;
  };

  const validateQuotation = (quote) => {
    if (quote == "" || quote == null) {
      setQuotationError("Quotation is required*");
      return false;
    }
    return true;
  };

  const validateDescription = (description) => {
    if (description == "" || description == null) {
      setDescriptionError("Description is required*");
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

    let reg = /^[0-9]{10}$/g;

    if (reg.test(num) === false) {
      setPhoneError("Please Enter a valid phone number");
      return false; //return false if in wrong format
    } else {
      setPhoneError(null);
      return true; //return true if in right format
    }
  };

  const validateStartDate = (date) => {
    if (date == "" || date == null) {
      setStartDateError("Start date is required*");
      return false;
    }
    return true;
  };

  const validateEndDate = (date) => {
    if (date == "" || date == null) {
      setDeadlineError("Deadline is required*");
      return false;
    }
    return true;
  };

  const validateHours = (hours) => {
    if (hours == "" || hours == null) {
      setHoursError("Estimated hours is required*");
      return false;
    }
    return true;
  };

  const validateAddress = (address) => {
    if (address == "" || address == null) {
      setAddressError("Address is required*");
      return false;
    }
    return true;
  };

  const validateBilling = (billing) => {
    if (billing == "" || billing == null) {
      setBillingError("Billing type is required*");
      return false;
    }
    return true;
  };

  //handle form submit
  const handleSubmit = async () => {
    if (
      validateProjectName(formData.project_name) &&
      validateCompanyName(formData.company) &&
      validateQuotation(formData.quotation) &&
      validateDescription(formData.description) &&
      validatePhone(formData.contact_number) &&
      validateStartDate(formData.start_date) &&
      validateEndDate(formData.deadline) &&
      validateHours(formData.estimated_hour) &&
      validateAddress(formData.address) &&
      validateBilling(formData.billing_type)
    ) {
      try {
        console.log("add project obj:", formData);
        const res = await apiAddNewProject({
          ...formData,
        });
        if (res.status == 200) {
          Toast.show("New Project Added", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show("Cannot Add New Project", {
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
        console.log(error);
      }
    } else {
    }
    validateProjectName(formData.project_name);
    validateCompanyName(formData.company);
    validateQuotation(formData.quotation);
    validateDescription(formData.description);
    validatePhone(formData.contact_number);
    validateStartDate(formData.start_date);
    validateEndDate(formData.deadline);
    validateHours(formData.estimated_hour);
    validateAddress(formData.address);
    validateBilling(formData.billing_type);
  };

  return (
    <View style={{ flex: 1, alignItems: "center"}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Project Name:</Text>
          <TextInput
            style={styles.input}
            name="project_name"
            value={formData.project_name}
            onChangeText={(text) => {
              setFormData({ ...formData, project_name: text });
              setNameError(null);
            }}
            placeholder="Project Name"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text>Company:</Text>
          <DropdownMenu
            data={companyList}
            placeholder="Select Company"
            value={formData.company}
            setValue={setFormData}
            label="company"
            originalObj={formData}
            setErrorState={setCompanyError}
          />
          {companyError ? (
            <Text style={styles.errorText}>{companyError}</Text>
          ) : null}

          <Text>Quotation:</Text>
          <DropdownMenu
            data={quotationList}
            placeholder="Select Quotation"
            value={formData.quotation}
            setValue={setFormData}
            label="quotation"
            originalObj={formData}
            setErrorState={setQuotationError}
          />
          {quotationError ? (
            <Text style={styles.errorText}>{quotationError}</Text>
          ) : null}

          {/* <Text>Customer:</Text>
          <DropdownMenu
            data={customersList}
            placeholder="Select Customer"
            value={formData.customer}
            setValue={setFormData}
            label="customer"
            originalObj={formData}
            setErrorState={setCustomerError}
          />
          {customerError ? (
            <Text style={styles.errorText}>{customerError}</Text>
          ) : null}

          <Text>Assign Consultant:</Text>
          <DropdownMenu
            data={consultantList}
            placeholder="Select Consultant"
            value={formData.consultant}
            setValue={setFormData}
            label="consultant"
            originalObj={formData}
            setErrorState={setConsultantError}
          />
          {consultantError ? (
            <Text style={styles.errorText}>{consultantError}</Text>
          ) : null} */}

          {/* <Text>Tags:</Text>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            data={[
              { label: "Carpentry", value: 1 },
              { label: "Electrical", value: 2 },
              { label: "Piping", value: 3 },
              { label: "Sewerage", value: 4 },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={selectedTags}
            onChange={(item) => {
              setSelectedTags(item);
            }}
            selectedStyle={styles.selectedStyle}
          />
          {tagsError ? <Text style={styles.errorText}>{tagsError}</Text> : null} */}

          <Text>Project Description:</Text>
          <TextInput
            style={styles.input}
            name="description"
            value={formData.description}
            onChangeText={(text) => {
              setFormData({ ...formData, description: text });
              setDescriptionError(null);
            }}
            placeholder="Task Description"
          />
          {descriptionError ? (
            <Text style={styles.errorText}>{descriptionError}</Text>
          ) : null}

          <Text>Phone Number:</Text>
          <TextInput
            style={styles.input}
            name="contact_number"
            value={formData.contact_number}
            onChangeText={(text) => {
              setFormData({ ...formData, contact_number: text });
              setPhoneError(null);
            }}
            placeholder="Number"
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          <Text>Start Date:</Text>
          <Pressable
            onPress={() => {
              setStartDateVisibility(true);
              setFormData({
                ...formData,
                start_date: moment(startDate).format("MM/DD/YYYY"),
              });
              setStartDateError(null);
            }}
            style={[
              styles.input,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#d9d9d9",
              },
            ]}
            name="startDate"
            value={formData.start_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {startDate ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(startDate).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                Start Date
              </Text>
            )}
          </Pressable>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />
          {startDateError ? (
            <Text style={styles.errorText}>{startDateError}</Text>
          ) : null}

          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
          <Text>Deadline:</Text>
          <Pressable
            onPress={() => {
              setEndDateVisibility(true);
              setFormData({
                ...formData,
                deadline: moment(endDate).format("MM/DD/YYYY"),
              });
              setDeadlineError(null);
            }}
            style={[
              styles.input,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#d9d9d9",
              },
            ]}
            name="startDate"
            value={formData.deadline}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {endDate ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(endDate).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>Deadline</Text>
            )}
          </Pressable>
          {deadlineError ? (
            <Text style={styles.errorText}>{deadlineError}</Text>
          ) : null}

          <Text>Total Estimated Hours:</Text>
          <TextInput
            style={styles.input}
            name="estimated_hour"
            value={formData.estimated_hour}
            onChangeText={(text) => {
              setFormData({ ...formData, estimated_hour: text });
              setHoursError(null);
            }}
            placeholder="Total Estimated Hours"
          />
          {hoursError ? (
            <Text style={styles.errorText}>{hoursError}</Text>
          ) : null}

          <Text>Address:</Text>
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
                zipcode: areaZip,
                country_code: countryCode,
                country: countryName,
              });
            }}
            query={{
              key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
              language: "en",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={placesStyle}
          />
          {addressError ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Billing Type:</Text>
          <DropdownMenu
            data={[
              { label: "Net Banking", value: 1 },
              { label: "Credit Card", value: 2 },
              { label: "Debit Card", value: 3 },
              { label: "UPI", value: 4 },
            ]}
            placeholder="Select Company"
            value={formData.billing_type}
            setValue={setFormData}
            label="billing_type"
            originalObj={formData}
            setErrorState={setBillingError}
          />
          {billingError ? (
            <Text style={styles.errorText}>{billingError}</Text>
          ) : null}
        </View>

        <View style={styles.bothButtons}>
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.btnText}>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.submitButton, styles.cancelBtn]}
          >
            <Text style={styles.btnTextCancel}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddProject;

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
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
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
    color: "#A9A9AC",
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
    padding: 10
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
    marginBottom: 15,
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
  },

  cancelBtn: {
    backgroundColor: "transparent",
    borderColor: "#696cff",
    borderWidth: 1
  },

  submitButton: {
    marginTop: 15,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 34,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  btnText: {
    color: "#ffff"
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

  btnTextCancel: {
    color: "#696cff"
  },

  dropdown: {
    height: 44,
    fontSize: 16,
    padding: 5,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 15,
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
