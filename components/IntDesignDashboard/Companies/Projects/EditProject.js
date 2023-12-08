import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-root-toast";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import {
  apiAddNewProject,
  apiGetPreFilledProjectDetails,
  apiGetProjectsDropdownData,
  apiGetQuotationsByCompanyId,
  apiUpdateProjectDetails,
} from "../../../../apis/projects";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as DocumentPicker from "expo-document-picker";
import { url } from "../../../../constants";
import { handlererrors } from "../../../../apis/auth";

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
  number: "",
};

const EditProject = ({ navigation, route }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);
  const [startDate, setStartDate] = useState();
  const [isStartDatePickerVisible, setStartDateVisibility] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [quotationList, setQuotationList] = useState([]);
  const [document, setDocument] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);

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
  const [documentError, setDocumentError] = useState(null);

  useEffect(() => {
    const getAllData = async () => {
      const res = await apiGetPreFilledProjectDetails(route.params.id);
      console.log("edit project data: ", res.data);
      setFormData({ ...res.data.project });
      const tempCompanies = res.data.companies.map((company) => {
        return { label: company.name, value: company.id };
      });
      setCompanyList([...tempCompanies]);

      // const tempConsultants = res.data.consultant.map((consultant) => {
      //   return { label: consultant.name, value: consultant.id };
      // });
      // setConsultantList([...tempConsultants]);

      // const tempCustomers = res.data.customers.map((customer) => {
      //   return { label: customer.name, value: customer.id };
      // });
      // setCustomersList([...tempCustomers]);
    };

    getAllData();
  }, []);

  useEffect(() => {
    const getQuotations = async () => {
      const res = await apiGetQuotationsByCompanyId(formData.company_id);
      console.log("quotes", res.data);

      const tempQuotes = res.data.data.map((quote) => {
        return { label: quote.name, value: quote.id };
      });

      setQuotationList([...tempQuotes]);
    };

    getQuotations();
  }, [formData.company_id]);

  //handle file upload
  const UploadFile = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    console.log(result.assets[0].uri);
    if (result.assets[0].uri) {
      setIsFilePicked(true);

      setDocument({
        document: result.assets[0].uri,
        fileName: result.assets[0].name,
        fileType: result.assets[0].mimeType,
      });

      // console.log(docs);
    }
  };

  //date functions
  const hideStartDatePicker = () => {
    setStartDateVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    setFormData({ ...formData, start_date: date });
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
      setFormData({ ...formData, end_date: date });
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

    let reg = /^[0-9]{8}$/g;

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

  //handle submit
  const handleSubmit = async () => {
    if (
      validateProjectName(formData.project_name) &&
      validateCompanyName(formData.company) &&
      validateQuotation(formData.quotes_id) &&
      validateDescription(formData.description) &&
      validatePhone(formData.contact_number) &&
      validateStartDate(formData.start_date) &&
      // validateEndDate(formData.end_date) &&
      validateHours(formData.estimated_hours) &&
      validateAddress(formData.address)
      // &&
      // validateBilling(formData.billing_type)
    ) {
      const form_data = new FormData();

      for (var key in formData) {
        form_data.append(key, formData[key]);
      }

      form_data.append("start_date", moment(startDate).format("MM/DD/YYYY"));
      form_data.append("company", formData.company_id);
      form_data.append("name", formData.project_name);
      form_data.append("estimated_hour", formData.estimated_hours);
      form_data.append("deadline", formData.end_date);
      form_data.append("number", formData.contact_number);
      form_data.append("quotation", formData.quotes_id);

      if (isFilePicked)
        form_data.append("document", {
          uri: document.document,
          type: document.fileType,
          name: document.fileName,
        });
      else {
        let obj = {
          uri: `${url.slice(0, -4)}${formData.document}`,
          name: formData.document,
        };

        const docType = obj.uri.substring(obj.uri.lastIndexOf(".") + 1);
        if (docType == "jpg" || docType == "jpeg") obj.type = "image/jpeg";
        else if (docType == "png") obj.type = "image/png";
        else if (docType == "doc") obj.type = "application/msword";
        else if (docType == "docx")
          obj.type =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (docType == "pdf") obj.type = "application/pdf";
        form_data.append("document", obj);
      }
      try {
        // console.log("edit project obj:", {
        //   ...formData,
        //   company: formData.company_id,
        //   customer: formData.customer_id,
        //   name: formData.project_name,
        //   consultant: formData.consultant_id,
        //   estimated_hour: formData.estimated_hours,
        //   deadline: formData.end_date,
        //   number: formData.contact_number,
        // });
        const res = await apiUpdateProjectDetails(form_data, route.params.id);
        console.log("res: ", res);
        if (res.status == 200) {
          Toast.show("Project Updated", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show("Project Update Failed", {
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
    } else {
      validateProjectName(formData.project_name);
      validateCompanyName(formData.company);
      validateQuotation(formData.quotes_id);
      validateDescription(formData.description);
      validatePhone(formData.contact_number);
      validateStartDate(formData.start_date);
      // validateEndDate(formData.end_date);
      validateHours(formData.estimated_hours);
      validateAddress(formData.address);
      // validateBilling(formData.billing_type);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        estimated_hours
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text style={styles.fieldName}>Project Name:</Text>
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

          <Text style={styles.fieldName}>Company:</Text>
          <DropdownMenu
            data={companyList}
            placeholder="Select Company"
            value={formData.company_id}
            setValue={setFormData}
            label="company_id"
            originalObj={formData}
            setErrorState={setCompanyError}
          />
          {companyError ? (
            <Text style={styles.errorText}>{companyError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Quotation:</Text>
          <DropdownMenu
            data={quotationList}
            placeholder="Select Quotation"
            value={formData.quotes_id}
            setValue={setFormData}
            label="quotes_id"
            originalObj={formData}
            setErrorState={setQuotationError}
          />
          {quotationError ? (
            <Text style={styles.errorText}>{quotationError}</Text>
          ) : null}

          {/*<Text>Customer:</Text>
          <DropdownMenu
            data={customersList}
            placeholder="Select Customer"
            value={formData.customer_id}
            setValue={setFormData}
            label="customer_id"
            originalObj={formData}
            setErrorState={setCustomerError}
          />
          {customerError ? (
            <Text style={styles.errorText}>{customerError}</Text>
          ) : null}

           <Text>Tags:</Text>
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

          <Text style={styles.fieldName}>Task Description:</Text>
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

          <Text style={styles.fieldName}>Phone Number:</Text>
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

          {/* <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          /> */}
          <Text style={styles.fieldName}>Start Date:</Text>
          <Pressable
            // onPress={() => {
            //   setStartDateVisibility(true);
            //   setStartDateError(null);
            // }}
            style={[
              styles.input,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#d9d9d9",
                backgroundColor: "#e5e5e5",
              },
            ]}
            name="start_date"
            value={formData.start_date}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {formData.start_date ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(formData.start_date).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>
                Start Date
              </Text>
            )}
          </Pressable>
          {startDateError ? (
            <Text style={styles.errorText}>{startDateError}</Text>
          ) : null}

          {/* <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          /> */}
          <Text style={styles.fieldName}>Deadline:</Text>
          <Pressable
            // onPress={() => {
            //   setEndDateVisibility(true);
            //   setDeadlineError(null);
            // }}
            style={[
              styles.input,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#d9d9d9",
                backgroundColor: "#e5e5e5",
              },
            ]}
            name="startDate"
            value={formData.deadline}
          >
            <Icon name="calendar-alt" size={25} color="#A9A9AC" />
            {formData.end_date ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {moment(formData.end_date).format("MM/DD/YYYY")}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>Deadline</Text>
            )}
          </Pressable>
          {/* {deadlineError ? (
            <Text style={styles.errorText}>{deadlineError}</Text>
          ) : null} */}

          <Text style={styles.fieldName}>Total Estimated Hours:</Text>
          <TextInput
            style={styles.input}
            name="estimated_hours"
            value={formData.estimated_hours}
            onChangeText={(text) => {
              setFormData({ ...formData, estimated_hours: text });
              setDescriptionError;
            }}
            placeholder="Total Estimated Hours"
          />
          {hoursError ? (
            <Text style={styles.errorText}>{hoursError}</Text>
          ) : null}

          {/* <Text>Assign Consultant:</Text>
          <DropdownMenu
            data={consultantList}
            placeholder="Select Consultant"
            value={formData.consultant_id}
            setValue={setFormData}
            label="consultant_id"
            originalObj={formData}
            setErrorState={setConsultantError}
          />
          {consultantError ? (
            <Text style={styles.errorText}>{consultantError}</Text>
          ) : null} */}

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
              components: "country:sg",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={placesStyle}
          />
          {addressError ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}

          <View style={styles.uploadFileSec}>
            <Text style={[styles.file, styles.fieldName]}>Upload File</Text>
            <View style={styles.button}>
              <TouchableOpacity>
                <Button
                  title="upload your file"
                  color="black"
                  onPress={() => {
                    UploadFile();
                    setDocumentError(null);
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          {isFilePicked ? (
            <Text>{document?.document}</Text>
          ) : (
            <Text style={{ color: "#000" }}>{formData?.document}</Text>
          )}

          {/* <Text style={styles.fieldName}>Billing Type:</Text>
          <DropdownMenu
            data={[
              { label: "Net Banking", value: 1 },
              { label: "Credit Card", value: 2 },
              { label: "Debit Card", value: 3 },
              { label: "UPI", value: 4 },
            ]}
            placeholder="Select Company"
            value={Number(formData.billing_type)}
            setValue={setFormData}
            label="billing_type"
            originalObj={formData}
            setErrorState={setBillingError}
          />
          {billingError ? (
            <Text style={styles.errorText}>{billingError}</Text>
          ) : null} */}
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

export default EditProject;

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
    marginTop: 10,
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
