import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableNativeFeedback,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  apiDeleteInvoice,
  apiGetAllInvoices,
} from "../../../../../apis/invoices";
import { handlererrors } from "../../../../../apis/auth";

const randomHexColor = () => {
  return "#b7d0d1";
};

const InvoiceList = ({ navigation, companyId, projectId }) => {
  const [invoicesList, setInvoicesList] = useState([]);
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleOverflow, setRippleOverflow] = useState(true);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [tempState, setTempState] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllInvoices = async () => {
        const res = await apiGetAllInvoices(projectId);
        console.log("invoices: ", res.data);
        setInvoicesList(res.data.data);
      };

      getAllInvoices();

      return () => (isActive = false);
    }, [deleteFlag])
  );

  // useEffect(() => {
  //   const getAllInvoices = async () => {
  //     const res = await apiGetAllInvoices();
  //     console.log(res.data.quotations);
  //     //listing of quotes for a specific company
  //     if (companyId) {
  //       const quotes = res.data.quotations.filter(
  //         (quote) => quote.company_id == companyId
  //       );
  //       setInvoicesList(quotes);
  //     } else {
  //       //listing all quotes
  //       setInvoicesList(res.data.quotations);
  //     }
  //   };

  //   getAllInvoices();
  // }, []);

  //function to delete the quote
  const handleDelete = async (id) => {
    const deleteQuote = async () => {
      try {
        const res = await apiDeleteInvoice(id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("Invoice Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          // navigation.navigate("All Companies");
        }
      } catch (error) {
        console.log(error);
        handlererrors(error,navigation)
      }
    };
    Alert.alert(
      `Delete Invoice`,
      `Are you sure you want to delete this invoice?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => deleteQuote() },
      ]
    );
  };

  const handleDownloadQuotation = async (id) => {
    try {
      const res = await apiDownloadQuote(id);
      console.log("pdf", res.config.url);
      // console.log(res.data);
      // // setTempState(res.data);
      // const pdfBlob = new Blob([res.data], { type: "application/pdf" });

      // // Create a URL for the blob
      // const pdfUrl = URL.createObjectURL(pdfBlob);

      Linking.openURL(res.config.url);
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
  };

  return (
    <View style={styles.container}>
      <FlatList
        // style={{ height: 100 }}
        data={invoicesList}
        renderItem={({ item }) => (
          <>
            <Pressable style={styles.listItem}>
              <Pressable
                style={{ width: "70%" }}
                onPress={() => {
                  navigation.navigate("Invoice Details", item);
                }}
              >
                <Text style={styles.item}>{item.invoice_number}</Text>
              </Pressable>

              <View style={styles.iconsContainer}>
                {/* Edit the invoice */}
                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    navigation.navigate("Edit Invoice", {
                      id: item.id,
                    });
                    // setRippleOverflow(!rippleOverflow);
                  }}
                  background={TouchableNativeFeedback.Ripple(
                    rippleColor,
                    rippleOverflow
                  )}
                >
                  <View style={styles.touchable}>
                    <Text style={styles.text}>
                      <Icon name="pen" size={18} color="#444" />
                    </Text>
                  </View>
                </TouchableNativeFeedback>

                {/* Delete the invoice */}
                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    handleDelete(item.id);
                    // setRippleOverflow(!rippleOverflow);
                  }}
                  background={TouchableNativeFeedback.Ripple(
                    rippleColor,
                    rippleOverflow
                  )}
                >
                  <View style={styles.touchable}>
                    <Text style={styles.text}>
                      <Icon name="trash-alt" size={18} color="#444" />
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </Pressable>
          </>
        )}
      />
      {/* <Text>{JSON.stringify(tempState)}</Text> */}
    </View>
  );
};

export default InvoiceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: "100%",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    minWidth: "98%",
    maxWidth: "98%",
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
    // maxW,
  },

  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    padding: 2,
    marginHorizontal: 8,
    width: "25%",
    justifyContent: "space-between",
  },

  addButton: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
