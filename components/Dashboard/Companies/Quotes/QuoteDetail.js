import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";

const QuoteDetail = ({ navigation, route }) => {
  const [quoteData, setQuoteData] = useState({});

  useEffect(() => {
    setQuoteData({ ...route.params });
    navigation.setOptions({
      title: `${route.params.companyName} - ${route.params.customerName}`,
    });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
      <View style={styles.centeredView}>
        <Text style={styles.item}>{quoteData.companyName}</Text>
        <View>
          <Text>Customer: {quoteData.customerName} </Text>
        </View>
        {/* <View>
          <Text>Phone Number: {quoteData.phoneNo} </Text>
        </View>
        <View>
          <Text>Location: {quoteData.address} </Text>
        </View> */}

        <Text>Items: </Text>
        <FlatList
          data={quoteData.items}
          renderItem={({ item }) => (
            <View>
              <Text>description: {item.description}</Text>
              <Text>qty: {item.qty}</Text>
              <Text>totalCostOfLine: {item.totalCostOfLine}</Text>
              <Text>tax: {item.tax}</Text>
              <Text>discount: {item.discount}</Text>
              <Text>cust_details: {item.cust_details}</Text>
            </View>
          )}
        />

        <View>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => navigation.navigate("Edit Quote")}
          >
            <Text style={styles.textStyle}>Edit Quote</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            // onPress={handleDeleteCompany}
          >
            <Text style={styles.textStyle}>Delete Quote</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default QuoteDetail;

const styles = StyleSheet.create({});
