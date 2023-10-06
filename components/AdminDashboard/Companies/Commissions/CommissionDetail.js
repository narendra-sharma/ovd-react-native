import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";

const CommissionDetail = ({ navigation, route }) => {
  const [commissionData, setCommissionData] = useState({});

  useEffect(() => {
    setCommissionData({ ...route.params });
    navigation.setOptions({
      title: `Commission - ${route.params.projectName}`,
    });
  }, []);

  return (
    <View style={styles.centeredView}>
      <View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Company Name</Text>
          <Text style={styles.span}>:</Text>
          <Text style={[styles.item, styles.fielContent]}>{commissionData.companyName}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Project Name</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{commissionData.projectName} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Total Commission</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{commissionData.totalCommission} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Amount Paid</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{commissionData.amountPaid} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Amount Pending</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{commissionData.amountPending} </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          //  onPress={() => navigation.navigate("Edit Project")}
        >
          <Text style={styles.textStyle}>View Transaction History</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => navigation.navigate("Edit Commission")}
        >
          <Text style={styles.textStyle}>Edit Commission Details</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          // onPress={handleDeleteCompany}
        >
          <Text style={styles.textStyle}>Delete Commission</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CommissionDetail;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  fieldName: {
    width: "40%",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left"
  },

  fielContent: {
    width: "55%",
  },

  span: {
    width: "10%"
  },

  buttonsContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "pink",
  },

  button: {
    margin: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  buttonClose: {
    backgroundColor: "#696cff",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  item: {
    padding: 10,
    fontSize: 16,
  },

  listItem: {
    backgroundColor: "#fff",
    marginBottom: 16,
  },
});
