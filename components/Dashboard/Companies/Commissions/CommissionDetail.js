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
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <View style={styles.centeredView}>
        <Text style={styles.item}>{commissionData.companyName}</Text>
        <View>
          <Text>Project Name: {commissionData.projectName} </Text>
        </View>
        <View>
          <Text>Total Commission: {commissionData.totalCommission} </Text>
        </View>
        <View>
          <Text>Amount Paid: {commissionData.amountPaid} </Text>
        </View>
        <View>
          <Text>Amount Pending: {commissionData.amountPending} </Text>
        </View>

        <View>
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
    </View>
  );
};

export default CommissionDetail;

const styles = StyleSheet.create({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  scrollBoxContainer: {
    // display: "flex",
    // flexDirection: "row",
    backgroundColor: "pink",
    // position: "relative",
    paddingTop: 10,
    height: 80,
    marginVertical: 15,
  },

  tabActive: {
    backgroundColor: "yellow",
  },

  scrollBox: {
    height: 24,
    backgroundColor: "#1faadb",
    margin: 5,
  },

  input: {
    borderWidth: 1,
    width: 300,
    height: 35,
    marginTop: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
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
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },
  buttonClose: {
    backgroundColor: "#B76E79",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "80%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
    alignItems: "center",
  },

  item: {
    padding: 10,
    fontSize: 16,
  },

  addButton: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
