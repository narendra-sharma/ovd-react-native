import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const EditTask = () => {
  const [taskData, setTaskData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [mode, setMode] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const handleSubmit = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text>Task Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={taskData.taskName}
            onChangeText={(text) =>
              setTaskData({ ...taskData, taskName: text })
            }
            placeholder="Task Name"
          />
          <Text>Status:</Text>
          <TextInput
            style={styles.input}
            name="organization"
            value={taskData.totalCommission}
            onChangeText={(text) =>
              setTaskData({ ...taskData, totalCommission: text })
            }
            placeholder="Total Commission"
          />
          <Text>Tag:</Text>
          <TextInput
            style={styles.input}
            name="tag"
            value={taskData.tag}
            onChangeText={(text) => setTaskData({ ...taskData, tag: text })}
            placeholder="Tag "
          />
          <Text>Task Description:</Text>
          <TextInput
            style={styles.input}
            name="taskDescription"
            value={taskData.taskDescription}
            onChangeText={(text) =>
              setTaskData({ ...taskData, taskDescription: text })
            }
            placeholder="Task Description"
          />
          <Text>Task Cost:</Text>
          <TextInput
            style={styles.input}
            name="totalCost"
            value={taskData.totalCost}
            onChangeText={(text) =>
              setTaskData({ ...taskData, totalCost: text })
            }
            placeholder="Task Cost"
          />
          <Text>{`Start Date:  ${
            selectedDate
              ? moment(selectedDate).format("MM/DD/YYYY")
              : "Please select date"
          }`}</Text>
          <Button title="Show Date Picker" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <Pressable
            onPress={() => showDatepicker()}
            style={styles.input}
            name="startDate"
            value={taskData.startDate}
            // onChangeText={(text) =>
            //   setTaskData({ ...taskData, startDate: text })
            // }
            // placeholder="Start Date"
          />

          <Text>Date of Completion:</Text>
          <TextInput
            style={styles.input}
            name="dateOfCompletion"
            value={taskData.dateOfCompletion}
            onChangeText={(text) =>
              setTaskData({ ...taskData, dateOfCompletion: text })
            }
            placeholder="Enter Date"
          />
          <Text>Contractor:</Text>
          <TextInput
            style={styles.input}
            name="contractor"
            value={taskData.contractor}
            onChangeText={(text) =>
              setTaskData({ ...taskData, contractor: text })
            }
            placeholder="Contractor"
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.submitButton}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "90%",
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
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
  },

  input: {
    width: 300,
    height: 35,
    marginTop: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 8,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "30%",
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
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },
});
