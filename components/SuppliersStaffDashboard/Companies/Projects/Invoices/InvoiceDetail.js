import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import Toast from "react-native-root-toast";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  apiGetUpdateInvoiceData,
  apiUpdateInvoiceDetails,
} from "../../../../../apis/invoices";
import * as DocumentPicker from "expo-document-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { url } from "../../../../../constants";
import { handlererrors } from "../../../../../apis/auth";

const initialFormData = {
  // name: "",
  // company: "",
  // consultant_manager: "",
  // consultant: "",
  // quantity: "",
  // cost: "",
  // tax: "",
  // total_amount: "",
  // description: "",
  status: 1,
  discount: 0,
};

const itemsForm = {
  item_name: "",
  description: "",
  quantity: 0,
  cost: 0,
  tax: 0,
  total_cost: 0,
};

/////////////******** ITEMS FORM **********/////////////////
const ItemForm = ({ item, itemsList, setItemsList, idx }) => {
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
      <Text style={styles.itemsFieldContainer}>Item Name:</Text>
      <Text style={styles.input}> {item?.item_name}</Text>

      <Text style={styles.itemsFieldContainer}>Item Description:</Text>
      <Text style={styles.input}> {item?.description}</Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginRight: "2%" }}>
          <Text style={styles.itemsFieldContainer}>Item Quantity:</Text>
          <Text style={[styles.input, { minWidth: "49%" }]}>
            {item?.quantity}
          </Text>
        </View>

        <View>
          <Text style={styles.itemsFieldContainer}>Cost Per Quantity:</Text>
          <Text style={[styles.input, { minWidth: "49%" }]}>{item?.cost}</Text>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginRight: "2%" }}>
          <Text style={styles.itemsFieldContainer}>Tax:</Text>
          <Text style={[styles.input, { minWidth: "49%" }]}>{item?.tax}</Text>
        </View>

        <View>
          <Text style={styles.itemsFieldContainer}>Total Cost:</Text>
          <Text style={[styles.input, { minWidth: "49%" }]}>
            {item?.total_cost}
          </Text>
        </View>
      </View>
    </View>
  );
};

/////////////******** MAIN ADD QUOTE FORM **********///////////////
const InvoiceDetail = ({ navigation, route }) => {
  const [itemsList, setItemsList] = useState([{ ...itemsForm }]);
  const [formData, setFormData] = useState(initialFormData);
  const [tasksList, setTasksList] = useState([]);

  console.log(route.params.id);

  useEffect(() => {
    try {
      const getAllData = async () => {
        const res = await apiGetUpdateInvoiceData(route?.params?.id);
        console.log("invoice data: ", res?.data?.invoiceData);
        setFormData({
          ...formData,
          invoice_number: res?.data?.invoiceData?.invoice_number,
          project: res?.data?.invoiceData?.project_id,
          projectName: res?.data?.invoiceData?.project?.project_name,
          quotation: res?.data?.invoiceData?.quotes_id,
          quotationName: res?.data?.invoiceData?.quotes?.name,
          admin: res?.data?.invoiceData?.admin_id,
          adminName: res?.data?.invoiceData?.admin?.name,
          company: res?.data?.invoiceData?.company_id,
          companyName: res?.data?.invoiceData?.company?.name,
          customer: res?.data?.invoiceData?.customer_id,
          customerName: res?.data?.invoiceData?.customer?.name,
          consultant_manager: res?.data?.invoiceData?.cons_manager_id,
          consultantManagerName:
            res?.data?.invoiceData?.cosultant_manager?.name,
          consultant_id: res?.data?.invoiceData?.consultant_id,
          consultantName: res?.data?.invoiceData?.consultant?.name,
          description: res?.data?.invoiceData?.description,
          discount_percent: res?.data?.invoiceData?.discount
            ? res?.data?.invoiceData?.discount
            : 0,
          total_amount: res?.data?.invoiceData?.total_cost,
          payment_date: res?.data?.invoiceData?.payment_date,
          note: res?.data?.invoiceData?.note,
          terms_condition: res?.data?.invoiceData?.terms_condition,
          payment_receipt: res?.data?.invoiceData?.payment_receipt,
        });
        setItemsList([...res?.data?.invoiceData?.quotes_item]);
        setTasksList([...res?.data?.tasks]);
        setPaymentDate(res?.data?.invoiceData?.payment_date);
      };
      getAllData();
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data);
      handlererrors(error,navigation)
    }
  }, []);

  //autocompute the values
  useEffect(() => {
    let tempList = itemsList.map((item) => item.total_cost);

    tempList.reduce((subTotal, cost) => {
      subTotal += Number(cost);

      console.log("discount ", Number(formData.discount_percent));

      console.log(
        "total amount",
        Number(subTotal) - (Number(subTotal) * 10) / 100
      );

      setFormData({
        ...formData,
        sub: Number(subTotal),
        total_amount:
          Number(subTotal) -
          (Number(subTotal) * Number(formData.discount_percent)) / 100,
      });
      return Number(subTotal);
    }, 0);
  }, [itemsList, formData.discount_percent]);

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
            <Text style={styles.fieldName}>Invoice Number</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData?.invoice_number} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Project</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData?.projectName} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Quotation</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData?.quotationName} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Admin</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData?.adminName} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Company</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData?.companyName} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Customer</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData?.customerName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Consultant Manager</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>
              {formData?.consultantManagerName}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Consultant </Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData?.consultantName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Description</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData.description} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Total Cost</Text>
            <Text style={styles.span}>:</Text>
            <Text style={styles.fielContent}>{formData.total_amount} </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Items</Text>
            <Text style={styles.span}>:</Text>
          </View>

          <Text style={styles.fieldName}>Tasks:</Text>
          {tasksList.length ? (
            <>
              {tasksList?.map((task, idx) => {
                return (
                  <View style={styles.input}>
                    <Text>
                      {task?.name} - ${task?.cost}
                    </Text>
                  </View>
                );
              })}
            </>
          ) : (
            <Text style={styles.fieldName}>Tasks are empty!</Text>
          )}

          {/******** Display Items List *******/}
          {itemsList.length > 0 &&
            itemsList.map((item, idx) => {
              return (
                <ItemForm
                  item={item}
                  itemsList={itemsList}
                  setItemsList={setItemsList}
                  idx={idx}
                />
              );
            })}

          <Text style={styles.fieldName}>Payment Details:</Text>

          <View style={styles.itemFormContainer}>
            <Text style={styles.fieldName}>Payment Date:</Text>
            <Text style={styles.fielContent}>{formData.payment_date} </Text>

            <Text style={styles.fieldName}>Payment Receipt:</Text>
            <Text style={styles.fielContent}>{formData?.payment_receipt}</Text>

            <Text style={styles.fieldName}>Note:</Text>
            <Text style={styles.fielContent}>{formData?.note}</Text>

            <Text style={styles.fieldName}>Terms & Conditions:</Text>
            <Text style={styles.fielContent}>{formData?.terms_condition}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() =>
            navigation.navigate("Edit Invoice", { id: formData.id })
          }
        >
          <Text style={styles.textStyle}>Edit</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => handleDelete(formData.id)}
        >
          <Text style={styles.textStyle}>Delete</Text>
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
