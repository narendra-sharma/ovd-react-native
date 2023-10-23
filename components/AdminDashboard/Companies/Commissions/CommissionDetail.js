import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { apiGetCommissionDetails } from "../../../../apis/commisions";

const CommissionDetail = ({ navigation, route }) => {
  const [commissionData, setCommissionData] = useState({});

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        const res = await apiGetCommissionDetails(route.params.id);
        console.log("commission details: ", res?.data?.data);
        setCommissionData({ ...res?.data?.data });
      })();

      return () => (isActive = false);
    }, [])
  );

  return (
    <View style={styles.centeredView}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        contentContainerStyle={{ padding: 4 }}
      >
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Project Name</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {commissionData?.project_name}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Company Name</Text>
          <Text style={styles.span}></Text>
          <Text style={styles.fieldContent}>
            {commissionData?.company?.name}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Consultant Manager</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {commissionData?.consultant_manager?.username}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Consultant</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {commissionData?.consultant?.username}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Address</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>{commissionData?.address}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Contact Number</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {commissionData?.contact_number}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Estimated Hours</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {commissionData?.estimated_hours}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Contact Number</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {commissionData?.contact_number}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Project Duration</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {commissionData?.start_date} - {commissionData?.end_date}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Quotation Amount</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {commissionData?.quotes?.total_cost}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Project Cost</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>{commissionData?.total_cost}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Description</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>{commissionData?.description}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Manager's Commission</Text>
          <Text style={styles.span}>:</Text>
          {commissionData?.consultant_id ? (
            <Text style={styles.fieldContent}>
              {(commissionData?.quotes?.total_cost -
                commissionData?.total_cost) *
                (commissionData?.cons_manager_commission / 100)}
            </Text>
          ) : (
            <Text style={styles.fieldContent}>
              {(commissionData?.quotes?.total_cost -
                commissionData?.total_cost) *
                (commissionData?.cons_manager_commission / 100) +
                (commissionData?.quotes?.total_cost -
                  commissionData?.total_cost) *
                  (commissionData?.cons_commission / 100)}
            </Text>
          )}
        </View>

        {commissionData?.consultant_id ? (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Consultant's Commission</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fieldContent}>
              {(commissionData?.quotes?.total_cost -
                commissionData?.total_cost) *
                (commissionData?.cons_commission / 100)}
            </Text>
          </View>
        ) : null}

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Total Commission</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fieldContent}>
            {(commissionData?.quotes?.total_cost - commissionData?.total_cost) *
              (commissionData?.cons_manager_commission / 100) +
              (commissionData?.quotes?.total_cost -
                commissionData?.total_cost) *
                (commissionData?.cons_commission / 100)}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          //  onPress={() => navigation.navigate("Edit Project")}
        >
          <Text style={styles.textStyle}>View Transaction History</Text>
        </Pressable>
        {/* <Pressable
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
        </Pressable> */}
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
    textAlign: "left",
  },

  fieldContent: {
    width: "55%",
  },

  span: {
    width: "10%",
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
