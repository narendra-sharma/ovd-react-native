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

const initialFormData = {
  name: "",
  company: "",
  consultant_manager: "",
  consultant: "",
  quantity: "",
  cost: "",
  tax: "",
  discount: "",
  total_amount: "",
  description: "",
  status: 1,
};

const AddQuote = ({ navigation }) => {
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

  useEffect(() => {
    const getAllData = async () => {
      const res = await apiGetCreateQuoteDropdownData();
      // console.log("dropdown api", res.data);
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

  //handle new quote submit
  const handleSubmit = async () => {
    if (
      validateCompanyName(formData.company) &&
      // validateCustomer(formData.customer) &&
      // validateProject(formData.project) &&
      validateCm(formData.consultant_manager) &&
      // validateConsultant(formData.consultant) &&
      validateTitle(formData.name) &&
      validateCost(formData.cost) &&
      validateTax(formData.tax) &&
      validateDiscount(formData.discount) &&
      validateTotalAmount(formData.total_amount) &&
      validateDescription(formData.description)
    ) {
      try {
        console.log(formData);
        const res = await apiAddQuote({
          ...formData,
          consultant_manager: formData.consultantManager,
          consultant: formData.consultant,
          status: 1,
        });
        console.log("response: ");
        console.log(res);
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
        Toast.show("An error has occurred", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log(error);
      }
    } else {
      validateCompanyName(formData.company);
      // validateCustomer(formData.customer);
      // validateProject(formData.project);
      validateCm(formData.consultant_manager);
      // validateConsultant(formData.consultant);
      // validateQuantity(formData.quantity);
      validateCost(formData.cost);
      validateTax(formData.tax);
      validateDiscount(formData.discount);
      validateTotalAmount(formData.total_amount);
      validateDescription(formData.description);
      validateTitle(formData.name);
    }
  };

  return (
    <View style={styles.mainContainer}>
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

          <Text style={styles.fieldName}>Assign Consultant Manager:</Text>
          <DropdownMenu
            data={consultantManagerList}
            placeholder="Select Consultant Manager"
            value={formData.consultant_manager}
            setValue={setFormData}
            label="consultant_manager"
            originalObj={formData}
            setErrorState={setCmError}
          />
          {cmError ? <Text style={styles.errorText}>{cmError}</Text> : null}

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
          ) : null}

          <Text style={styles.fieldName}>Total Amount:</Text>
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
          ) : null}

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

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Text>Submit</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.submitButton}
          >
            <Text>Cancel</Text>
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
  mainContainer: {
    padding: 22,
  },

  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
    height: 35,
    marginTop: 2,
    // marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 8,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
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
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 5,
  },
});
