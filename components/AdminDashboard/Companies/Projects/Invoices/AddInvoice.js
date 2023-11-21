import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import Toast from "react-native-root-toast";
// import { apiCreateNewCompany, apiGetAllUsers } from "../../../apis/companies";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  apiAddInvoice,
  apiGetCreateInvoiceData,
} from "../../../../../apis/invoices";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const initialFormData = {
  name: "",
  company: "",
  consultant_manager: "",
  consultant: "",
  quantity: "",
  cost: "",
  tax: "",
  total_amount: "",
  description: "",
  status: 1,
  discount_percent: 0,
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
const ItemForm = ({
  item,
  itemsList,
  setItemsList,
  idx,
  itemsValidations,
  setItemsValidations,
}) => {
  const handleRemoveItem = () => {
    let tempList = itemsList.filter((item, index) => index != idx);
    console.log("temp list", tempList);
    setItemsList([...tempList]);
  };

  //handle change input text
  const handleChange = (text, label) => {
    let tempList = [...itemsList];
    let tempErrList = [...itemsValidations];

    if (tempErrList[idx]) {
      tempErrList[idx][label] = null;
    }

    tempList[idx][label] = text;

    if (label == "quantity" || label == "cost" || label == "tax") {
      tempList[idx].total_cost = (
        Number(tempList[idx].quantity) * Number(tempList[idx].cost) +
        (Number(tempList[idx].quantity) *
          Number(tempList[idx].cost) *
          Number(tempList[idx].tax)) /
          100
      ).toFixed(2);
    }
    setItemsList([...tempList]);
    setItemsValidations([...tempErrList]);
    // console.log("items list", itemsList);
  };

  return (
    <View style={styles.itemFormContainer}>
      <Text style={[styles.fieldName, { textAlign: "center", fontSize: 16 }]}>
        Item {idx + 1}
      </Text>
      <Text style={styles.fieldName}>Item Name:</Text>
      <TextInput
        style={styles.input}
        name="item_name"
        value={item?.item_name}
        onChangeText={(text) => handleChange(text, "item_name")}
        placeholder="Item Name"
      />
      {itemsValidations[idx]?.item_name ? (
        <Text style={styles.errorText}>{itemsValidations[idx].item_name}</Text>
      ) : null}

      <Text style={styles.fieldName}>Item Description:</Text>
      <TextInput
        style={styles.input}
        name="description"
        value={item?.description}
        onChangeText={(text) => handleChange(text, "description")}
        placeholder="Description"
      />
      {itemsValidations[idx]?.description ? (
        <Text style={styles.errorText}>
          {itemsValidations[idx].description}
        </Text>
      ) : null}

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginRight: "2%" }}>
          <Text style={styles.fieldName}>Item Quantity:</Text>
          <TextInput
            style={[styles.input, { minWidth: "49%" }]}
            name="quantity"
            value={item?.quantity}
            onChangeText={(text) => handleChange(text, "quantity")}
            placeholder="Quantity"
          />
          {itemsValidations[idx]?.quantity ? (
            <Text style={styles.errorText}>
              {itemsValidations[idx].quantity}
            </Text>
          ) : null}
        </View>

        <View>
          <Text style={styles.fieldName}>Cost Per Quantity:</Text>
          <TextInput
            style={[styles.input, { minWidth: "49%" }]}
            name="cost"
            value={item?.cost}
            onChangeText={(text) => handleChange(text, "cost")}
            placeholder="Cost Per Quantity"
          />
          {itemsValidations[idx]?.cost ? (
            <Text style={styles.errorText}>{itemsValidations[idx].cost}</Text>
          ) : null}
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
          <Text style={styles.fieldName}>Tax:</Text>
          <TextInput
            style={[styles.input, { minWidth: "49%" }]}
            name="tax"
            value={item?.tax}
            onChangeText={(text) => handleChange(text, "tax")}
            placeholder="Tax %"
          />
          {itemsValidations[idx]?.tax ? (
            <Text style={styles.errorText}>{itemsValidations[idx].tax}</Text>
          ) : null}
        </View>

        <View>
          <Text style={styles.fieldName}>Total Cost:</Text>
          <Text
            style={[
              styles.input,
              { minWidth: "49%", backgroundColor: "#e5e5e5", color: "gray" },
            ]}
          >
            {item?.total_cost}
          </Text>
        </View>
      </View>

      <Pressable
        style={[styles.addButton, { width: "50%", alignSelf: "center" }]}
        onPress={handleRemoveItem}
      >
        <Text style={styles.addText}>
          <Icon name="minus-circle" /> Remove Item
        </Text>
      </Pressable>
    </View>
  );
};

/////////////******** MAIN ADD QUOTE FORM **********///////////////
const AddInvoice = ({ navigation }) => {
  const [itemsList, setItemsList] = useState([{ ...itemsForm }]);
  const [formData, setFormData] = useState(initialFormData);
  const [projectsList, setProjectsList] = useState([]);
  const [invoiceDate, setInvoiceDate] = useState();
  const [isInvoiceDatePickerVisible, setInvoiceDateVisibility] =
    useState(false);

  const [nameError, setNameError] = useState(null);
  const [titleError, setTitleError] = useState(null);
  const [customerError, setCustomerError] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [quantityError, setQuantityError] = useState(null);
  const [costError, setCostError] = useState(null);
  const [taxError, setTaxError] = useState(null);
  const [discountError, setDiscountError] = useState(null);
  const [totalAmountError, setTotalAmountError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [cmError, setCmError] = useState(null);
  const [consultantError, setConsultantError] = useState(null);
  const [responseError, setResponseError] = useState(null);
  const [itemsValidations, setItemsValidations] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const res = await apiGetCreateInvoiceData();
      const tempProjects = res?.data?.projects?.map((project) => {
        return {
          label: project.project_name,
          value: project.id,
          ...project,
        };
      });
      setProjectsList([...tempProjects]);
      setFormData({ ...formData, invoice_number: res?.data?.invoice_number });
    };
    getAllData();
  }, []);

  useEffect(() => {
    const getConsultantData = async () => {
      const res = await apiGetConsultantsForQuotes(formData.consultant_manager);
      // console.log("consultants", res.data);
    };

    getConsultantData();
  }, [formData.consultant_manager]);

  //validation functions
  const validateTitle = (name, label = "Name") => {
    if (name == "") {
      setTitleError(`${label} is required*`);
      return false;
    }
    return true;
  };

  const validateCompanyName = (name) => {
    if (name == "") {
      setNameError("Company is required*");
      return false;
    }
    return true;
  };

  const validateCm = (cm) => {
    if (cm == "" || null) {
      setCmError("Consultant manager is required*");
      return false;
    }
    return true;
  };

  const validateConsultant = (consultant) => {
    if (consultant == "" || null) {
      setConsultantError("Consultant is required*");
      return false;
    }
    return true;
  };

  // const validateCustomer = (customer) => {
  //   if (customer == "") {
  //     setCustomerError("Required*");
  //     return false;
  //   }
  //   return true;
  // };

  // const validateProject = (project) => {
  //   if (project == "") {
  //     setProjectError("Required*");
  //     return false;
  //   }
  //   return true;
  // };

  const validateQuantity = (quantity) => {
    if (quantity == "" || quantity == null) {
      setQuantityError("Qunatity is required*");
      return false;
    }

    // setProjectError(null);
    // return true;

    let reg = /^\d*\.?\d*$/;

    if (reg.test(quantity) === false) {
      setQuantityError("Only number values are allowed");
      return false; //return false if in wrong format
    } else {
      setQuantityError(null);
      return true; //return true if in right format
    }
  };

  const validateCost = (cost) => {
    if (cost == "" || cost == null) {
      setCostError("Cost is required*");
      return false;
    }
    // return true;

    let reg = /^\d*\.?\d*$/;

    if (reg.test(cost) === false) {
      setCostError("Only number values are allowed");
      return false; //return false if in wrong format
    } else {
      setCostError(null);
      return true; //return true if in right format
    }
  };

  const validateTax = (tax) => {
    if (tax == "") {
      setTaxError("Tax is required*");
      return false;
    }
    // return true;

    let reg = /^\d*\.?\d*$/;

    if (reg.test(tax) === false) {
      setTaxError("Only number values are allowed");
      return false; //return false if in wrong format
    } else {
      setTaxError(null);
      return true; //return true if in right format
    }
  };

  const validateDiscount = (discount) => {
    if (discount == "") {
      setDiscountError("Discount is required*");
      return false;
    }
    // return true;

    let reg = /^\d*\.?\d*$/;

    if (reg.test(discount) === false) {
      setDiscountError("Only number values are allowed");
      return false; //return false if in wrong format
    } else {
      setDiscountError(null);
      return true; //return true if in right format
    }
  };

  const validateTotalAmount = (total_amount) => {
    if (total_amount == "") {
      setTotalAmountError("Total amount is required*");
      return false;
    }
    // return true;

    let reg = /^\d*\.?\d*$/;

    if (reg.test(total_amount) === false) {
      setTotalAmountError("Only number values are allowed");
      return false; //return false if in wrong format
    } else {
      setTotalAmountError(null);
      return true; //return true if in right format
    }
  };

  const validateDescription = (description) => {
    if (description == "" || description == null) {
      setDescriptionError("Description is required*");
      return false;
    }
    return true;
  };

  const itemValidations = () => {
    let temp = [];
    let flag = true;
    let reg = /^\d*\.?\d*$/;

    itemsList.map((item, idx) => {
      if (
        item.item_name != "" &&
        item.description != "" &&
        item.quantity != "" &&
        item.cost != "" &&
        item.tax != "" &&
        item.total_cost != "" &&
        reg.test(item.quantity) == true &&
        reg.test(item.cost) == true &&
        reg.test(item.tax) == true
      ) {
        console.log("no errors apparently");
        temp.push({});
      } else {
        let obj = {};
        if (item.item_name == "") {
          obj.item_name = "Name is required*";
        }

        if (item.description == "") {
          obj.description = "Description is required*";
        }

        if (item.quantity == "") {
          obj.quantity = "Quantity is required*";
        } else {
          if (reg.test(item.quantity) == false) {
            obj.quantity = "Only number values are allowed";
          }
        }

        if (item.cost == "") {
          obj.cost = "Cost per quantity is required*";
        } else {
          if (reg.test(item.cost) == false) {
            obj.cost = "Only number values are allowed";
          }
        }

        if (item.tax == "") {
          obj.tax = "Tax is required*";
        } else {
          if (reg.test(item.tax) == false) {
            obj.tax = "Only number values are allowed";
          }
        }

        temp.push(obj);
        flag = false;
      }
    });

    setItemsValidations([...temp]);
    console.log("items validations: ", temp);

    return flag;
  };

  //handle new quote submit
  const handleSubmit = async () => {
    // if (
    //   validateCompanyName(formData.company) &&
    //   // validateCustomer(formData.customer) &&
    //   // validateProject(formData.project) &&
    //   validateCm(formData.consultant_manager) &&
    //   // validateConsultant(formData.consultant) &&
    //   validateTitle(formData.name, "Title") &&
    //   // validateCost(formData.cost) &&
    //   // validateTax(formData.tax) &&
    //   // validateDiscount(formData.discount_percent) &&
    //   validateTotalAmount(formData.total_amount) &&
    //   validateDescription(formData.description) &&
    //   itemValidations()
    // )
    // {
    //refine data according to api
    let item_name = [];
    let item_description = [];
    let quantity = [];
    let cost = [];
    let tax = [];
    let total_cost = [];

    itemsList.map((item) => {
      item_name.push(item.item_name);
      item_description.push(item.description);
      quantity.push(item.quantity);
      cost.push(item.cost);
      tax.push(item.tax);
      total_cost.push(item.total_cost);
    });

    let tasksString = JSON.stringify(formData?.tasks?.map((task) => task?.id));
    tasksString = [tasksString.substring(1, tasksString.length - 1)];
    console.log(tasksString);

    try {
      console.log(formData);
      const res = await apiAddInvoice({
        ...formData,
        status: 1,
        item_name: item_name,
        item_description: item_description,
        quantity: quantity,
        cost: cost,
        tax: tax,
        total_cost: total_cost,
        quotation: formData?.quotes?.id,
        admin: formData?.assign_to?.id,
        company: formData?.company?.id,
        customer: formData?.customer?.id,
        consultant_manager: formData?.consultant_manager?.id,
        consultant: formData?.consultant?.id,
        total_amount: formData?.total_amount,
        tasks_id: tasksString,
      });
      console.log("response: ");
      console.log(res.data);
      if (res.status == 200) {
        Toast.show("New Invoice Added", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        navigation.goBack();
        setFormData(initialFormData);
      } else {
        Toast.show("Cannot Add New Quote", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    } catch (error) {
      Toast.show("An error has occurred", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      console.log(error);
      console.log(error?.response?.data);
    }

    // } else {
    //   validateCompanyName(formData.company);
    //   // validateCustomer(formData.customer);
    //   // validateProject(formData.project);
    //   validateCm(formData.consultant_manager);
    //   // validateConsultant(formData.consultant);
    //   // validateQuantity(formData.quantity);
    //   // validateCost(formData.cost);
    //   // validateTax(formData.tax);
    //   // validateDiscount(formData.discount_percent);
    //   validateTotalAmount(formData.total_amount);
    //   validateDescription(formData.description);
    //   validateTitle(formData.name);
    //   itemValidations();
    // }
  };

  //autocompute the values
  useEffect(() => {
    let tempList = itemsList.map((item) => item.total_cost);

    tempList.reduce((subTotal, cost) => {
      subTotal += Number(cost);

      console.log("discount ", Number(formData.discount));

      console.log(
        "total amount",
        Number(subTotal) - (Number(subTotal) * 10) / 100
      );

      setFormData({
        ...formData,
        sub: Number(subTotal),
        total_amount:
          Number(subTotal) -
          (Number(subTotal) * Number(formData.discount)) / 100,
      });
      return Number(subTotal);
    }, 0);
  }, [itemsList, formData.discount]);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text style={styles.fieldName}>Invoice Number:</Text>
          <TextInput
            style={styles.input}
            name="invoice_number"
            value={formData?.invoice_number}
            editable={false}
            placeholder="Invoice Number"
          />

          <Text style={styles.fieldName}>Project:</Text>
          <Dropdown
            style={styles.dropdown}
            placeholder="Select Project"
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={projectsList}
            maxHeight={300}
            labelField="project_name"
            valueField="id"
            containerStyle={styles.listStyle}
            dropdownPosition="bottom"
            value={formData?.project}
            onChange={(item) => {
              setFormData({
                ...formData,
                project: item.value,
                ...item,
                discount: item?.quotes_items[0]?.discount_percent,
              });
              setItemsList([...item?.quotes_items]);
              // console.log(item.value);
              // setErrorState(null);
            }}
          />

          <Text style={styles.fieldName}>Quotation:</Text>
          <TextInput
            style={styles.input}
            name="quotation"
            value={formData?.quotes?.name}
            // onChangeText={(text) => {
            //   setFormData({ ...formData, name: text });
            //   setTitleError(null);
            // }}
            placeholder="Admin"
            editable={false}
          />

          <Text style={styles.fieldName}>Admin:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={formData?.assign_to?.username}
            // onChangeText={(text) => {
            //   setFormData({ ...formData, name: text });
            //   setTitleError(null);
            // }}
            placeholder="Admin"
            editable={false}
          />
          {titleError ? (
            <Text style={styles.errorText}>{titleError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Company Name:</Text>
          <TextInput
            style={styles.input}
            name="company"
            value={formData?.company?.name}
            editable={false}
            placeholder="Company Name"
          />
          {titleError ? (
            <Text style={styles.errorText}>{titleError}</Text>
          ) : null}
          {/* <DropdownMenu
            data={companyList}
            placeholder="Select Company"
            value={formData.company}
            setValue={setFormData}
            label="company"
            originalObj={formData}
            setErrorState={setNameError}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null} */}

          <Text style={styles.fieldName}>Assign Consultant Manager:</Text>
          <TextInput
            style={styles.input}
            name="company"
            value={formData?.consultant_manager?.username}
            editable={false}
            placeholder="Company Name"
          />
          {/* <DropdownMenu
            data={consultantManagerList}
            placeholder="Select Consultant Manager"
            value={formData.consultant_manager}
            setValue={setFormData}
            label="consultant_manager"
            originalObj={formData}
            setErrorState={setCmError}
          /> */}
          {cmError ? <Text style={styles.errorText}>{cmError}</Text> : null}

          <Text style={styles.fieldName}>Assign Consultant:</Text>
          <TextInput
            style={styles.input}
            name="company"
            value={formData?.consultant?.username}
            editable={false}
            placeholder="Company Name"
          />
          {/* <DropdownMenu
            data={consultantList}
            placeholder="Select Consultant"
            value={formData.consultant}
            setValue={setFormData}
            label="consultant"
            originalObj={formData}
            setErrorState={setConsultantError}
          /> */}
          {consultantError ? (
            <Text style={styles.errorText}>{consultantError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Tasks:</Text>
          {formData?.tasks?.length > 0 ? (
            <>
              {formData?.tasks?.map((task, idx) => {
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
            <Text style={styles.fieldName}>Tasks are required!</Text>
          )}

          <Text style={styles.fieldName}>Description:</Text>
          <TextInput
            style={styles.input}
            name="description"
            value={formData.description}
            onChangeText={(text) => {
              setFormData({ ...formData, description: text });
              setDescriptionError(null);
            }}
            placeholder="Description"
          />
          {descriptionError ? (
            <Text style={styles.errorText}>{descriptionError}</Text>
          ) : null}
        </View>

        {itemsList.map((item, idx) => {
          return (
            <ItemForm
              item={item}
              itemsList={itemsList}
              setItemsList={setItemsList}
              idx={idx}
              itemsValidations={itemsValidations}
              setItemsValidations={setItemsValidations}
            />
          );
        })}

        <Pressable
          style={[
            styles.addButton,
            { width: "95%", alignSelf: "center", marginVertical: 10 },
          ]}
          onPress={() => {
            setItemsList([...itemsList, { ...itemsForm }]);
          }}
        >
          <Text style={styles.addText}>
            <Icon name="plus-circle" /> Add Item
          </Text>
        </Pressable>

        {itemsList.length > 0 && (
          <View style={styles.itemFormContainer}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ marginRight: "2%" }}>
                <Text style={styles.fieldName}>Subtotal:</Text>
                <Text
                  style={[
                    styles.input,
                    {
                      minWidth: "49%",
                      backgroundColor: "#e5e5e5",
                      color: "gray",
                    },
                  ]}
                >
                  {formData.sub}
                </Text>
                {/* <TextInput
                  style={[styles.input, { minWidth: "49%" }]}
                  name="name"
                  // value={quantity}
                  onChangeText={(text) => {
                    // setFormData({ ...formData, name: text });
                    // setTitleError(null);
                  }}
                  placeholder="Subtotal"
                /> */}
              </View>

              <View>
                <Text style={styles.fieldName}>Discount:</Text>
                <TextInput
                  style={[styles.input, { minWidth: "49%" }]}
                  name="discount_percent"
                  value={formData?.discount}
                  onChangeText={(text) => {
                    setFormData({ ...formData, discount: text });
                    setDiscountError(null);
                  }}
                  placeholder="Discount %"
                />
                {discountError ? (
                  <Text style={styles.errorText}>{discountError}</Text>
                ) : null}
              </View>
            </View>

            <Text style={styles.fieldName}>Total Amount:</Text>
            <Text
              style={[
                styles.input,
                {
                  minWidth: "49%",
                  backgroundColor: "#e5e5e5",
                  color: "gray",
                },
              ]}
            >
              {formData.total_amount}
            </Text>
            {/* <TextInput
              style={[styles.input, { backgroundColor: "#e5e5e5" }]}
              name="total_amount"
              value={formData.total_amount}
              onChangeText={(text) => {
                setFormData({ ...formData, total_amount: text });
                setTotalAmountError(null);
              }}
              placeholder="Total Amount"
            /> */}
            {totalAmountError ? (
              <Text style={styles.errorText}>{totalAmountError}</Text>
            ) : null}
          </View>
        )}

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
      </ScrollView>
    </View>
  );
};

export default AddInvoice;

const DropdownMenu = ({
  data,
  placeholder,
  value,
  setValue,
  label,
  originalObj,
  setErrorState,
  editable = true,
}) => {
  return (
    <Dropdown
      style={styles.dropdown}
      editable={editable}
      placeholder={placeholder}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      containerStyle={styles.listStyle}
      dropdownPosition="bottom"
      value={value}
      onChange={(item) => {
        setValue({ ...originalObj, [label]: item.value });
        setErrorState(null);
      }}
    />
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 5,
    // padding: 2,
  },

  fieldName: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
  },

  input: {
    width: "100%",
    fontSize: 16,
    marginTop: 2,
    // padding: 5,
    borderRadius: 5,
    padding: 8,
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

  submitText: {
    color: "white",
    justifyContent: "center",
  },

  opacity: {
    margin: 20,
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },

  dropdown: {
    height: 44,
    marginTop: 2,
    fontSize: 16,
    padding: 5,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    width: "100%",
  },

  button: {
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
    margin: 10,
    marginHorizontal: "auto",
  },
  addButton: {
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
    marginTop: 20,
    marginHorizontal: "auto",
  },
  addText: {
    color: "#fff",
  },

  itemFormContainer: {
    width: "95%",
    backgroundColor: "#fff",
    padding: 12,
    margin: 8,
    borderRadius: 5,
  },
});
