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
import { Country, State, City } from "country-state-city";
import { apiGetAllCompanies } from "../../../../apis/companies";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  apiAddQuote,
  apiGetQuoteDetails,
  apiUpdateQuoteDetails,
  apiGetConsultantsForQuotes,
  apiGetCreateQuoteDropdownData,
} from "../../../../apis/quotes";

const initialFormData = {
  name: "",
  company: "",
  company_id: "",
  // customer_id: "",
  // project_id: "",
  quantity: "",
  cost: "",
  tax: "",
  discount: "",
  total_cost: "",
  description: "",
  status: 1,
};

const itemsForm = {
  itemName: "",
  itemDescription: "",
  quantity: "",
  itemCostPerQuantity: "",
  itemTax: "",
  itemTotalCost: "",
};

/////////////******** ITEMS FORM **********/////////////////
const ItemForm = ({ item, itemsList, setItemsList, idx }) => {
  const handleRemoveItem = () => {
    let tempList = itemsList.filter((item, index) => index != idx);
    console.log("temp list", tempList);
    setItemsList([...tempList]);
  };

  //handle change input text
  const handleChange = (text, label) => {
    let tempList = [...itemsList];

    tempList[idx][label] = text;

    if (label == "quantity" || label == "cost" || label == "tax") {
      tempList[idx].total_cost = (
        tempList[idx].quantity * tempList[idx].cost +
        (tempList[idx].quantity * tempList[idx].cost * tempList[idx].tax) / 100
      ).toFixed(2);
    }

    setItemsList([...tempList]);
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

      <Text style={styles.fieldName}>Item Description:</Text>
      <TextInput
        style={styles.input}
        name="description"
        value={item?.description}
        onChangeText={(text) => handleChange(text, "description")}
        placeholder="Description"
      />

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

const EditQuote = ({ navigation, route }) => {
  const [nameError, setNameError] = useState(null);
  const [customerError, setCustomerError] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [cmError, setCmError] = useState(null);
  const [consultantError, setConsultantError] = useState(null);
  const [quantityError, setQuantityError] = useState(null);
  const [costError, setCostError] = useState(null);
  const [taxError, setTaxError] = useState(null);
  const [discountError, setDiscountError] = useState(null);
  const [totalAmountError, setTotalAmountError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [titleError, setTitleError] = useState(null);

  const [itemsList, setItemsList] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [companyList, setCompanyList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [consultantManagerList, setConsultantManagerList] = useState([]);

  // console.log(route.params.id);

  useEffect(() => {
    const getAllData = async () => {
      const res = await apiGetQuoteDetails(route.params.id);
      console.log("quotes data:", res.data);
      setFormData({ ...res.data.quotes });

      const tempCompanies = res.data.companies.map((company) => {
        return { label: company.name, value: company.id };
      });
      setCompanyList([...tempCompanies]);

      const tempCms = res.data.consManager.map((cm) => {
        return { label: cm.name, value: cm.id };
      });
      setConsultantManagerList([...tempCms]);

      setItemsList([...res?.data?.quotes?.quotes_items]);
    };
    getAllData();
  }, []);

  useEffect(() => {
    const getConsultantData = async () => {
      const res = await apiGetConsultantsForQuotes(formData.consultant_manager);
      // console.log("consultants", res.data);

      const tempConsultants = res.data.data.map((consultant) => {
        return { label: consultant.name, value: consultant.id };
      });
      setConsultantList([...tempConsultants]);
    };

    getConsultantData();
  }, [formData.consultant_manager]);

  //validation functions
  const validateTitle = (name) => {
    if (name == "") {
      setTitleError("Title is required*");
      return false;
    }
    return true;
  };

  const validateCompanyName = (name) => {
    if (name == "" || null) {
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

  // const validateQuantity = (quantity) => {
  //   if (quantity == "" || quantity == null) {
  //     setQuantityError("*Required");
  //     return false;
  //   }

  //   // setProjectError(null);
  //   // return true;

  //   let reg = /^\d*\.?\d*$/;

  //   if (reg.test(quantity) === false) {
  //     setQuantityError("Only number values are allowed");
  //     return false; //return false if in wrong format
  //   } else {
  //     setQuantityError(null);
  //     return true; //return true if in right format
  //   }
  // };

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
    if (total_amount == "" || total_amount == null) {
      setTotalAmountError("Amount is required*");
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

  //handle new quote submit
  const handleSubmit = async () => {
    if (
      validateCompanyName(formData.company) &&
      // validateCustomer(formData.customer) &&
      // validateProject(formData.project) &&
      // validateQuantity(formData.quantity) &&
      // validateCost(formData.cost) &&
      // validateTax(formData.tax) &&
      // validateDiscount(formData.discount) &&
      validateTotalAmount(formData.total_cost) &&
      validateDescription(formData.description) &&
      validateTitle(formData.name) &&
      validateCm(formData.cons_manager_id)
    ) {
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

      try {
        console.log(formData);
        const res = await apiUpdateQuoteDetails(
          {
            ...formData,
            company: formData.company_id,
            consultant_manager: formData.cons_manager_id,
            consultant: formData.consultant_id,
            total_amount: formData.total_cost,
            item_name: item_name,
            item_description: item_description,
            quantity: quantity,
            cost: cost,
            tax: tax,
            total_cost: total_cost,
          },
          route.params.id
        );
        console.log("response: ");
        console.log(res?.data);
        if (res?.data?.quotes == "Data updated successfully") {
          Toast.show("Quote Updated", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.goBack();
        } else {
          Toast.show("Cannot Update Quote", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      } catch (error) {
        Toast.show("Error in while editing quote", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error);
      }
      // setFormData(initialFormData);
    } else {
      validateCompanyName(formData.company);
      // validateCustomer(formData.customer);
      // validateProject(formData.project);
      // validateQuantity(formData.quantity);
      // validateCost(formData.cost);
      // validateTax(formData.tax);
      // validateDiscount(formData.discount);
      validateTotalAmount(formData.total_cost);
      validateDescription(formData.description);
      validateTitle(formData.name);
      validateCm(formData.cons_manager_id);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center" }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formContainer}>
          <Text style={styles.fieldName}>Title:</Text>
          <TextInput
            style={styles.input}
            name="name"
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              setTitleError(null);
            }}
            placeholder="Title"
          />
          {titleError ? (
            <Text style={styles.errorText}>{titleError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Company:</Text>
          <DropdownMenu
            data={companyList}
            placeholder="Select Company"
            value={formData.company_id}
            setValue={setFormData}
            label="company_id"
            originalObj={formData}
            setErrorState={setNameError}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text style={styles.fieldName}>Assign Consultant Manager:</Text>
          <DropdownMenu
            data={consultantManagerList}
            placeholder="Select Consultant Manager"
            value={formData.cons_manager_id}
            setValue={setFormData}
            label="cons_manager_id"
            originalObj={formData}
            setErrorState={setCmError}
          />
          {cmError ? <Text style={styles.errorText}>{cmError}</Text> : null}

          <Text style={styles.fieldName}>Assign Consultant:</Text>
          <DropdownMenu
            data={consultantList}
            placeholder="Select Consultant"
            value={formData.consultant_id}
            setValue={setFormData}
            label="consultant_id"
            originalObj={formData}
            setErrorState={setConsultantError}
          />
          {consultantError ? (
            <Text style={styles.errorText}>{consultantError}</Text>
          ) : null}

          {/* <Text style={styles.fieldName}>Customer:</Text>
          <DropdownMenu
            data={[
              { label: "John the Customer", value: 1 },
              { label: "Johnny the Customer", value: 2 },
              { label: "Jake the Customer", value: 3 },
              { label: "Jason the Customer", value: 4 },
              { label: "Jack the Customer", value: 5 },
            ]}
            placeholder="Select Customer"
            value={formData.customer_id}
            setValue={setFormData}
            label="customer_id"
            originalObj={formData}
            setErrorState={setCustomerError}
          />
          {customerError ? (
            <Text style={styles.errorText}>{customerError}</Text>
          ) : null}

          <Text style={styles.fieldName}>Project:</Text>
          <DropdownMenu
            data={[
              { label: "Haity", value: 1 },
              { label: "Alpha", value: 2 },
              { label: "Zaam-Dox", value: 3 },
              { label: "Duobam", value: 4 },
              { label: "Overhold", value: 5 },
            ]}
            placeholder="Select Project"
            value={formData.project_id}
            setValue={setFormData}
            label="project_id"
            originalObj={formData}
            setErrorState={setProjectError}
          />
          {projectError ? (
            <Text style={styles.errorText}>{projectError}</Text>
          ) : null} 
           <Text style={styles.fieldName}>Quantity:</Text>
          <TextInput
            style={styles.input}
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChangeText={(text) => {
              setFormData({ ...formData, quantity: text });
              setQuantityError(null);
            }}
          />
          {quantityError ? (
            <Text style={styles.errorText}>{quantityError}</Text>
          ) : null} 
           <Text style={styles.fieldName}>Cost:</Text>
          <TextInput
            style={styles.input}
            name="cost"
            value={formData.cost}
            onChangeText={(text) => {
              setFormData({ ...formData, cost: text });
              setCostError(null);
            }}
            placeholder="Cost"
          />
          {costError ? <Text style={styles.errorText}>{costError}</Text> : null}

          <Text style={styles.fieldName}>Tax:</Text>
          <TextInput
            style={styles.input}
            name="tax"
            value={formData.tax}
            onChangeText={(text) => {
              setFormData({ ...formData, tax: text });
              setTaxError(null);
            }}
            placeholder="Tax"
          />
          {taxError ? <Text style={styles.errorText}>{taxError}</Text> : null}

          <Text style={styles.fieldName}>Discount:</Text>
          <TextInput
            style={styles.input}
            name="discount"
            value={formData.discount}
            onChangeText={(text) => {
              setFormData({ ...formData, discount: text });
              setDiscountError(null);
            }}
            placeholder="Discount"
          />
          {discountError ? (
            <Text style={styles.errorText}>{discountError}</Text>
          ) : null} */}

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

          <Pressable
            style={[
              styles.addButton,
              { width: "100%", alignSelf: "center", marginVertical: 10 },
            ]}
            onPress={() => {
              setItemsList([...itemsList, { ...itemsForm }]);
            }}
          >
            <Text style={styles.addText}>
              <Icon name="plus-circle" /> Add Item
            </Text>
          </Pressable>

          <Text style={styles.fieldName}>Total Amount:</Text>
          <TextInput
            style={styles.input}
            name="total_cost"
            value={formData.total_cost}
            onChangeText={(text) => {
              setFormData({ ...formData, total_cost: text });
              setTotalAmountError(null);
            }}
            placeholder="Total Amount"
          />
          {totalAmountError ? (
            <Text style={styles.errorText}>{totalAmountError}</Text>
          ) : null}
        </View>

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

export default EditQuote;

const DropdownMenu = ({
  data,
  placeholder,
  value,
  setValue,
  label,
  originalObj,
  setErrorState,
}) => {
  return (
    <Dropdown
      style={styles.dropdown}
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
  mainContainer: {
    padding: 10,
  },

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
    padding: 8,
    borderRadius: 5,
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

  opacity: {
    margin: 20,
  },

  errorText: {
    color: "red",
    fontSize: 10,
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 5,
  },

  itemFormContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 15,
    borderRadius: 5,
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
});
