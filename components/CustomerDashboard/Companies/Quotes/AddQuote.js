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
import {
  apiAddQuote,
  apiGetConsultantsForQuotes,
  apiGetCreateQuoteDropdownData,
} from "../../../../apis/quotes";
import Icon from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  itemName: "",
  itemDescription: "",
  itemQuantity: 0,
  itemCostPerQuantity: 0,
  itemTax: 0,
  itemTotalCost: 0,
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

    if (
      label == "itemQuantity" ||
      label == "itemCostPerQuantity" ||
      label == "itemTax"
    ) {
      tempList[idx].itemTotalCost = (
        tempList[idx].itemQuantity * tempList[idx].itemCostPerQuantity +
        (tempList[idx].itemQuantity *
          tempList[idx].itemCostPerQuantity *
          tempList[idx].itemTax) /
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
        name="itemName"
        value={item?.itemName}
        onChangeText={(text) => handleChange(text, "itemName")}
        placeholder="Item Name"
      />
      {itemsValidations[idx]?.itemName ? (
        <Text style={styles.errorText}>{itemsValidations[idx].itemName}</Text>
      ) : null}

      <Text style={styles.fieldName}>Item Description:</Text>
      <TextInput
        style={styles.input}
        name="itemDescription"
        value={item?.itemDescription}
        onChangeText={(text) => handleChange(text, "itemDescription")}
        placeholder="Description"
      />
      {itemsValidations[idx]?.itemDescription ? (
        <Text style={styles.errorText}>
          {itemsValidations[idx].itemDescription}
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
            name="itemQuantity"
            value={item?.itemQuantity}
            onChangeText={(text) => handleChange(text, "itemQuantity")}
            placeholder="Quantity"
          />
          {itemsValidations[idx]?.itemQuantity ? (
            <Text style={styles.errorText}>
              {itemsValidations[idx].itemQuantity}
            </Text>
          ) : null}
        </View>

        <View>
          <Text style={styles.fieldName}>Cost Per Quantity:</Text>
          <TextInput
            style={[styles.input, { minWidth: "49%" }]}
            name="itemCostPerQuantity"
            value={item?.itemCostPerQuantity}
            onChangeText={(text) => handleChange(text, "itemCostPerQuantity")}
            placeholder="Cost Per Quantity"
          />
          {itemsValidations[idx]?.itemCostPerQuantity ? (
            <Text style={styles.errorText}>
              {itemsValidations[idx].itemCostPerQuantity}
            </Text>
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
            name="itemTax"
            value={item?.itemTax}
            onChangeText={(text) => handleChange(text, "itemTax")}
            placeholder="Tax %"
          />
          {itemsValidations[idx]?.itemTax ? (
            <Text style={styles.errorText}>
              {itemsValidations[idx].itemTax}
            </Text>
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
            {item?.itemTotalCost}
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
const AddQuote = ({ navigation }) => {
  const [itemsList, setItemsList] = useState([{ ...itemsForm }]);
  const [formData, setFormData] = useState(initialFormData);

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
  const [consultantList, setConsultantList] = useState([]);
  const [consultantManagerList, setConsultantManagerList] = useState([]);
  const [cmError, setCmError] = useState(null);
  const [consultantError, setConsultantError] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [responseError, setResponseError] = useState(null);
  const [itemsValidations, setItemsValidations] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const res = await apiGetCreateQuoteDropdownData();
      console.log("dropdown api", res.data);
      const tempCompanies = res.data.company.map((company) => {
        return { label: company.name, value: company.id };
      });
      setCompanyList([...tempCompanies]);

      const tempCms = res.data.consultant_manager.map((cm) => {
        return { label: cm.name, value: cm.id };
      });
      setConsultantManagerList([...tempCms]);

      //   setCustomerList([...]);
      //   setProjectList([...]);
    };
    getAllData();

    (async() => {
      const user = await AsyncStorage.getItem("profile")
      setFormData({...formData, consultant_manager: JSON.parse(user).id })
    })();
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
        item.itemName != "" &&
        item.itemDescription != "" &&
        item.itemQuantity != "" &&
        item.itemCostPerQuantity != "" &&
        item.itemTax != "" &&
        item.itemTotalCost != "" &&
        reg.test(item.itemQuantity) == true &&
        reg.test(item.itemCostPerQuantity) == true &&
        reg.test(item.itemTax) == true
      ) {
        console.log("no errors apparently");
        temp.push({});
      } else {
        let obj = {};
        if (item.itemName == "") {
          obj.itemName = "Name is required*";
        }

        if (item.itemDescription == "") {
          obj.itemDescription = "Description is required*";
        }

        if (item.itemQuantity == "") {
          obj.itemQuantity = "Quantity is required*";
        } else {
          if (reg.test(item.itemQuantity) == false) {
            obj.itemQuantity = "Only number values are allowed";
          }
        }

        if (item.itemCostPerQuantity == "") {
          obj.itemCostPerQuantity = "Cost per quantity is required*";
        } else {
          if (reg.test(item.itemCostPerQuantity) == false) {
            obj.itemCostPerQuantity = "Only number values are allowed";
          }
        }

        if (item.itemTax == "") {
          obj.itemTax = "Tax is required*";
        } else {
          if (reg.test(item.itemTax) == false) {
            obj.itemTax = "Only number values are allowed";
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
    if (
      validateCompanyName(formData.company) &&
      // validateCustomer(formData.customer) &&
      // validateProject(formData.project) &&
      validateCm(formData.consultant_manager) &&
      // validateConsultant(formData.consultant) &&
      validateTitle(formData.name, "Title") &&
      // validateCost(formData.cost) &&
      // validateTax(formData.tax) &&
      validateDiscount(formData.discount_percent) &&
      validateTotalAmount(formData.total_amount) &&
      validateDescription(formData.description) &&
      itemValidations()
    ) {
      //refine data according to api
      let item_name = [];
      let item_description = [];
      let quantity = [];
      let cost = [];
      let tax = [];
      let total_cost = [];

      itemsList.map((item) => {
        item_name.push(item.itemName);
        item_description.push(item.itemDescription);
        quantity.push(item.itemQuantity);
        cost.push(item.itemCostPerQuantity);
        tax.push(item.itemTax);
        total_cost.push(item.itemTotalCost);
      });

      try {
        console.log(formData);
        const res = await apiAddQuote({
          ...formData,
          consultant_manager: formData.consultant_manager,
          consultant: formData.consultant,
          status: 1,
          item_name: item_name,
          item_description: item_description,
          quantity: quantity,
          cost: cost,
          tax: tax,
          total_cost: total_cost,
        });
        console.log("response: ");
        console.log(res.data);
        if (res.status == 200) {
          Toast.show("New Quote Added", {
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
        console.log(error);
        console.log("errors: ", error?.response?.data);

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
    } else {
      validateCompanyName(formData.company);
      // validateCustomer(formData.customer);
      // validateProject(formData.project);
      validateCm(formData.consultant_manager);
      // validateConsultant(formData.consultant);
      // validateQuantity(formData.quantity);
      // validateCost(formData.cost);
      // validateTax(formData.tax);
      validateDiscount(formData.discount_percent);
      validateTotalAmount(formData.total_amount);
      validateDescription(formData.description);
      validateTitle(formData.name);
      itemValidations();
    }
  };

  //autocompute the values
  useEffect(() => {
    let tempList = itemsList.map((item) => item.itemTotalCost);

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
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center", padding: 10 }}
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

          <Text style={styles.fieldName}>Company Name:</Text>
          <DropdownMenu
            data={companyList}
            placeholder="Select Company"
            value={formData.company}
            setValue={setFormData}
            label="company"
            originalObj={formData}
            setErrorState={setNameError}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          {/* <Text style={styles.fieldName}>Assign Consultant Manager:</Text>
          <DropdownMenu
            data={consultantManagerList}
            placeholder="Select Consultant Manager"
            value={formData.consultant_manager}
            setValue={setFormData}
            label="consultant_manager"
            originalObj={formData}
            setErrorState={setCmError}
          />
          {cmError ? <Text style={styles.errorText}>{cmError}</Text> : null} */}

          <Text style={styles.fieldName}>Assign Consultant:</Text>
          <DropdownMenu
            data={consultantList}
            placeholder="Select Consultant"
            value={formData.consultant}
            setValue={setFormData}
            label="consultant"
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
            value={formData.customer}
            setValue={setFormData}
            label="customer"
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
            value={formData.project}
            setValue={setFormData}
            label="project"
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
          ) : null} */}

          {/* <Text style={styles.fieldName}>Cost:</Text>
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
          {costError ? <Text style={styles.errorText}>{costError}</Text> : null} */}

          {/* <Text style={styles.fieldName}>Tax:</Text>
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
          {taxError ? <Text style={styles.errorText}>{taxError}</Text> : null} */}

          {/* <Text style={styles.fieldName}>Discount:</Text>
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

          {/* <Text style={styles.fieldName}>Total Amount:</Text>
          <TextInput
            style={styles.input}
            name="total_amount"
            value={formData.total_amount}
            onChangeText={(text) => {
              setFormData({ ...formData, total_amount: text });
              setTotalAmountError(null);
            }}
            placeholder="Total Amount"
          />
          {totalAmountError ? (
            <Text style={styles.errorText}>{totalAmountError}</Text>
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
                  value={formData.discount_percent}
                  onChangeText={(text) => {
                    setFormData({ ...formData, discount_percent: text });
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

export default AddQuote;

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
