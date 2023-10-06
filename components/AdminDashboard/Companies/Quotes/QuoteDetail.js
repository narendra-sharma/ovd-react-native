import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import Toast from "react-native-root-toast";
import { apiGetQuoteDetails, apiDeleteQuote } from "../../../../apis/quotes";
import { useFocusEffect } from "@react-navigation/native";

const QuoteDetail = ({ navigation, route }) => {
  const [quoteData, setQuoteData] = useState({});
  const [deleteFlag, setDeteleFlag] = useState(false);

  console.log("params got: ", route.params);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllData = async () => {
        const res = await apiGetQuoteDetails(route.params.id);
        console.log("quotes res:", res.data.company);
        setQuoteData({ ...res.data.quotes });
        //   setCustomerList([...]);
        //   setProjectList([...]);
      };
      getAllData();

      return () => (isActive = false);
    }, [])
  );

  const handleDelete = async (id) => {
    const deleteQuote = async () => {
      try {
        const res = await apiDeleteQuote(id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("Quote Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    };
    Alert.alert(`Delete Quote`, `Are you sure you want to delete this quote?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteQuote() },
    ]);
  };

  // useEffect(() => {
  //   const getAllData = async () => {
  //     const res = await apiGetQuoteDetails(route.params.id);
  //     console.log("quotes res:", res.data.company);
  //     setQuoteData({ ...res.data.quotes });
  //     //   setCustomerList([...]);
  //     //   setProjectList([...]);
  //   };
  //   getAllData();
  //   // navigation.setOptions({
  //   //   title: `${route.params.company} - ${route.params.customer}`,
  //   // });
  // }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between",}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
      <View style={{width: "90%", marginHorizontal: "auto"}}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Company</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData?.company?.name} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Customer</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData.customer_id} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Project</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData.project_id} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Quantity</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData.quantity} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Cost</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData.cost} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Tax</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData.tax} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Discount</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData.discount} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Total Cost</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData.total_cost} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Description</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{quoteData.description} </Text>
        </View>
      
      </View>
        {/* <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Items: </Text>
        </View>
        <FlatList
          data={quoteData.items}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Description: </Text>
                <Text>{item.description}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Quantity: </Text>
                <Text>{item.qty}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Total Cost of Line: </Text>
                <Text>{item.totalCostOfLine}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Tax: </Text>
                <Text> {item.tax}%</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Discount: </Text>
                <Text>{item.discount}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Customer Details: </Text>
              </View>
              <Text>{item.cust_details}</Text>
            </View>
          )}
        /> */}

      </ScrollView>
      <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() =>
              navigation.navigate("Edit Quote", { id: quoteData.id })
            }
          >
            <Text style={styles.textStyle}>Edit Quote</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => handleDelete(quoteData.id)}
          >
            <Text style={styles.textStyle}>Delete Quote</Text>
          </Pressable>
        </View>
    </View>
  );
};

export default QuoteDetail;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 22,
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
