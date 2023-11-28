import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  Alert,
  TextInput,
  Image,
} from "react-native";
import Toast from "react-native-root-toast";
import { useFocusEffect } from "@react-navigation/native";

const itemsForm = {
  itemName: "",
  itemDescription: "",
  quantity: "",
  itemCostPerQuantity: "",
  itemTax: "",
  itemTotalCost: "",
};

/////////////******** ITEMS FORM **********/////////////////
const ItemForm = ({ item, itemsList, setItemsList, idx, productsList }) => {
  // console.log("productsList", productsList);
  return (
    <View style={styles.itemFormContainer}>
      <Text
        style={[
          styles.itemsFieldContainer,
          { textAlign: "center", fontSize: 16 },
        ]}
      >
        Item {idx + 1}
      </Text>
      <Text style={styles.itemsFieldContainer}>Product :</Text>
      <Text style={styles.input}>
        {
          productsList[
            productsList.findIndex((obj) => obj.value == item.product_id)
          ]?.label
        }
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginRight: "2%" }}>
          <Text style={styles.itemsFieldContainer}>Item Quantity:</Text>
          <Text style={[styles.input, { minWidth: "49%" }]}>{item?.qty}</Text>
        </View>

        <View>
          <Text style={styles.itemsFieldContainer}>Cost Per Quantity:</Text>
          <Text style={[styles.input, { minWidth: "49%" }]}>
            {
              productsList[
                productsList.findIndex((obj) => obj.value == item.product_id)
              ]?.itemTotalCost
            }
          </Text>
        </View>
      </View>

      <View>
        <Text style={styles.itemsFieldContainer}>Total Cost:</Text>
        <Text style={[styles.input, { minWidth: "49%" }]}>
          {Number(item.qty) * Number(item.price)}
        </Text>
      </View>
    </View>
  );
};

/**************** Main Component *****************/
const InvoiceDetail = ({ navigation, route }) => {
  const [quoteData, setQuoteData] = useState({});
  const [itemsList, setItemsList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [image, setImage] = useState(null);

  // console.log("params got: ", route.params);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllData = async () => {
        const res = await apiGetQuoteDetails(route.params.id);
        // console.log("quotes res:", res.data.quotes);
        setQuoteData({ ...res?.data?.quotation });
        // console.log([...res?.data?.quotes?.quotes_items]);
        setItemsList([...res?.data?.quotation?.products]);
        // console.log("items list ", itemsList);
        //   setCustomerList([...]);
        //   setProjectList([...]);

        var new_url = url.slice(0, -5);
        setImage(`${new_url}${res?.data?.quotation?.url}`);

        const productsRes = await apiGetAllProducts();
        const tempProducts = productsRes?.data?.products?.map((product) => {
          return {
            label: `${product?.name} ${product?.dimension}`,
            value: product.id,
            itemTotalCost: product.price,
          };
        });
        setProductsList([...tempProducts]);
      };
      getAllData();

      return () => (isActive = false);
    }, [])
  );

  //function to delete the quote
  const handleDelete = async (id) => {
    const deleteQuote = async () => {
      try {
        const res = await apiDeleteQuote(id);
        console.log(res.data);
        if (res?.data?.status == true) {
          // setDeteleFlag((prev) => !prev);
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
  const showStatus = () => {
    console.log("status ", quoteData?.status);
    switch (quoteData?.status) {
      case "1":
        return "Drafted";
      case "2":
        return "In Review";
      case "3":
        return "Declined";
      case "4":
        "Accepted";
      default:
        return "Default";
    }
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
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ width: "95%", marginHorizontal: "auto" }}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Quote</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{quoteData?.quotation_no} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Status</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{showStatus()} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Valid Upto</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{quoteData?.valid_upto} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Customer</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>
              {quoteData?.customer?.username}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Details</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{quoteData.details} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Amount</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{quoteData.amount} </Text>
          </View>

          {image && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Image</Text>
                <Text style={styles.span}>:</Text>
              </View>
              <Image
                source={{ uri: image }}
                style={{ width: 150, height: 150, margin: 10 }}
              />
            </>
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Items</Text>
            <Text style={styles.span}>:</Text>
          </View>

          {/******** Display Items List *******/}
          {itemsList.length > 0 &&
            itemsList.map((item, idx) => {
              return (
                <ItemForm
                  item={item}
                  itemsList={itemsList}
                  setItemsList={setItemsList}
                  idx={idx}
                  productsList={productsList}
                />
              );
            })}
        </View>
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

export default InvoiceDetail;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    // margin: 5,
    padding: 2,
  },

  fieldName: {
    width: "40%",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },

  fielContent: {
    width: "55%",
  },

  span: {
    width: "10%",
  },

  buttonsContainer: {
    display: "flex",
    padding: 10,
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
    borderRadius: 5,
    width: "100%",
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

  itemFormContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 15,
    borderRadius: 5,
  },

  input: {
    width: "100%",
    fontSize: 16,
    marginTop: 2,
    padding: 8,
    borderRadius: 5,
    paddingHorizontal: 8,
    // height: 44,
    minWidth: "100%",
    borderColor: "gray",
    borderWidth: 0.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "pink",
  },

  itemsFieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    // padding: 2,
  },
});
