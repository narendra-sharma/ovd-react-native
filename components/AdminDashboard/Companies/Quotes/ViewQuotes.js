import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QuotesList from "./QuotesList";

const ViewQuotes = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>All Quotes</Text>
      <QuotesList navigation={navigation} />
    </View>
  );
};

export default ViewQuotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    width: "100%",
    height: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
