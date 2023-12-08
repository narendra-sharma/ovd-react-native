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
import { handlererrors } from "../../../../apis/auth";

const initialCommissionData = {
  customerName: "",
  consultant: "",
  pointOfContact: "",
  projectLocation: "",
};

const EditCommission = ({ navigation }) => {
  const [commissionData, setCommissionData] = useState({});

  const handleSubmit = async () => {
    try {
    } catch (error) {
      console.log(error);
      handlererrors(error,navigation)
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center"}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10, height: '100%' }}
        keyboardShouldPersistTaps="always"
      >
      <View style={{ flex: 1, alignItems: "center", height: "100%", justifyContent: "space-between" }}>
        <View style={styles.formContainer}>
          <Text style={styles.fieldName}>Project Name:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={commissionData.projectName}
            onChangeText={(text) =>
              setCommissionData({ ...commissionData, projectName: text })
            }
            placeholder="Project Name"
          />
          <Text style={styles.fieldName}>Total Commission:</Text>
          <TextInput
            style={styles.input}
            name="organization"
            value={commissionData.totalCommission}
            onChangeText={(text) =>
              setCommissionData({ ...commissionData, totalCommission: text })
            }
            placeholder="Total Commission"
          />
          <Text style={styles.fieldName}>Amount Paid:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={commissionData.amountPaid}
            onChangeText={(text) =>
              setCommissionData({ ...commissionData, amountPaid: text })
            }
            placeholder="Amount Paid"
          />
          <Text style={styles.fieldName}>Amount Pending:</Text>
          <TextInput
            style={styles.input}
            name="phonenumber"
            value={commissionData.amountPending}
            onChangeText={(text) =>
              setCommissionData({ ...commissionData, amountPending: text })
            }
            placeholder="Amount Pending"
          />
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

export default EditCommission;

const styles = StyleSheet.create({
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
