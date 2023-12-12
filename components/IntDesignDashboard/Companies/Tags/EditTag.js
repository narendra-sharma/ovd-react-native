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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import Toast from "react-native-root-toast";
import {
  apiAddNewTag,
  apiGetPreFilledTagDetails,
  apiUpdateTagDetails,
} from "../../../../apis/tags";
import { handlererrors } from "../../../../apis/auth";

const AddTag = ({ navigation, route }) => {
  const [formData, setFormData] = useState({});
  const [endDate, setEndDate] = useState();
  const [isEndDatePickerVisible, setEndDateVisibility] = useState(false);
  const [startDate, setStartDate] = useState();

  const [nameError, setNameError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [costError, setCostError] = useState(null);
  const [deadlineError, setDeadlineError] = useState(null);

  console.log("id: ", route.params.id);

  useEffect(() => {
    const getTagDetails = async () => {
      try {
        const res = await apiGetPreFilledTagDetails(route.params.id);
        console.log(res.data);
        setFormData({ ...res.data.tag });
      } catch (error) {
        console.log(error);
        handlererrors(error,navigation)
      }
    };

    getTagDetails();
  }, []);

  //date functions
  const hideEndDatePicker = () => {
    setEndDateVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    setFormData({ ...formData, deadline: moment(date).format("MM/DD/YYYY") });
    setEndDateVisibility(false);
  };

  //validation functions
  const validateTagName = (name) => {
    if (name == "" || name == null) {
      setNameError("Task name is required*");
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

  const validateCost = (cost) => {
    if (cost == "" || cost == null) {
      setCostError("Cost is required*");
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

  //handle form submit
  const handleSubmit = async () => {
    if (
      validateTagName(formData.name) &&
      validateDescription(formData.description) &&
      validateCost(formData.total_cost) &&
      validateEndDate(formData.deadline)
    ) {
      try {
        const res = await apiUpdateTagDetails(
          { ...formData, status: 1 },
          route.params.id
        );
        if (res.status == 200) {
          Toast.show("Tag Updated Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show("Cannot Update Tag", {
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
      validateTagName(formData.name);
      validateDescription(formData.description);
      validateCost(formData.total_cost);
      validateEndDate(formData.deadline);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          padding: 10,
          height: "100%",
        }}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.formContainer}>
            <Text>Tag Name:</Text>
            <TextInput
              style={styles.input}
              name="name"
              value={formData.name}
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
                setNameError(null);
              }}
              placeholder="Tag Name"
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}

            {/* <Text style={styles.fieldName}>Total Cost:</Text>
          <TextInput
            style={styles.input}
            name="total_cost"
            value={formData.total_cost}
            onChangeText={(text) => {
              setFormData({ ...formData, total_cost: text });
              setCostError(null);
            }}
            placeholder="Total Cost"
          />
          {costError ? <Text style={styles.errorText}>{costError}</Text> : null} */}

            <Text style={styles.fieldName}>Tag Description:</Text>
            <TextInput
              style={styles.input}
              name="description"
              value={formData.description}
              onChangeText={(text) => {
                setFormData({ ...formData, description: text });
                setDescriptionError(null);
              }}
              placeholder="Tag Description"
            />
            {descriptionError ? (
              <Text style={styles.errorText}>{descriptionError}</Text>
            ) : null}

            {/* <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
          <Text style={styles.fieldName}>Deadline:</Text>
          <Pressable
            onPress={() => {
              setEndDateVisibility(true);
              // setFormData({
              //   ...formData,
              //   deadline: moment(endDate).format("MM/DD/YYYY"),
              // });
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
            {formData.deadline ? (
              <Text style={{ color: "#000", marginLeft: 10 }}>
                {formData.deadline}
              </Text>
            ) : (
              <Text style={{ color: "#A9A9AC", marginLeft: 10 }}>Deadline</Text>
            )}
          </Pressable>
          {deadlineError ? (
            <Text style={styles.errorText}>{deadlineError}</Text>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default AddTag;

const styles = StyleSheet.create({
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

  bothButtons: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 10,
  },

  uploadFileSec: {
    marginBottom: 10,
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
