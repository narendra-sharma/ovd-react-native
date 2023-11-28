import { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/FontAwesome";
import ProjectsList from "./Projects/ProjectsList";
import QuotesList from "./Quotes/QuotesList";
import {
  apiDeleteCompany,
  apiGetCompanyDetails,
} from "../../../apis/companies";
import { useFocusEffect } from "@react-navigation/native";
// import CommissionsList from "./Commissions/CommissionsList";
import UsersList from "./Users/UserList";

const initialCompanyData = {
  companyName: "",
  email: "",
  phoneNo: "",
  address: "Indian bank, jhujhar nagar",
};

const CompanyInfo = ({
  companyData,
  navigation,
  consultantManager,
  consultant,
  contractor,
  customerData,
}) => {
  // console.log(navigation);

  const handleDeleteCompany = async () => {
    const deleteCompany = async () => {
      try {
        const res = await apiDeleteCompany(route.params.id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          Toast.show("Company Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          navigation.navigate("All Companies");
        }
      } catch (error) {
        console.log(error);
      }
    };
    Alert.alert(
      `Delete ${companyData.name}`,
      `Are you sure you want to delete ${companyData.name}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => deleteCompany() },
      ]
    );
  };

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <View style={{ width: "90%", marginHorizontal: "auto" }}>
        {/* <Text style={styles.heading}>{companyData?.name}</Text> */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Name</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{companyData?.name}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>VAT Number</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{companyData?.vat_number}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Email</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{companyData?.email}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Phone Number</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{companyData?.phoneNo}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Customer</Text>
          <Text style={styles.span}>:</Text>
          {customerData?.name !== "" && (
            <Text style={styles.fielContent}>{customerData?.name}</Text>
          )}
        </View>
        {/* <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Consultant Manager: </Text>
          <Text>{consultantManager}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Consultant: </Text>
          <Text>{consultant}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Contractor: </Text>
          <Text>{contractor}</Text>
        </View> */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Address</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {companyData?.address} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>State/UT</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {companyData?.state} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Country</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {companyData?.country} </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Zip Code</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {companyData?.zip_code} </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() =>
            navigation.navigate("Edit Company Details", companyData)
          }
          // onPress={() => setIsCompanyEditOn(true)}
        >
          <Text style={styles.textStyle}>Edit Company Details</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleDeleteCompany}>
          <Text style={styles.textStyle}>Delete Company</Text>
        </Pressable>
      </View>
    </View>
  );
};

const CompanyDetail = ({ navigation, route }) => {
  const [companyData, setCompanyData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [consultantManager, setConsultantManager] = useState("");
  const [consultant, setConsultant] = useState("");
  const [contractor, setContractor] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const tempCmObj = {
      ...users[users.findIndex((obj) => obj.user_type == 3)],
    };
    setConsultantManager(tempCmObj.name);

    const tempConsultObj = {
      ...users[users.findIndex((obj) => obj.user_type == 4)],
    };
    setConsultant(tempConsultObj.name);

    const tempContractObj = {
      ...users[users.findIndex((obj) => obj.user_type == 5)],
    };
    setContractor(tempContractObj.name);
    console.log("c m: ", consultantManager);
  }, [users]);

  const renderUserTypes = () => {
    switch (userData.user_type) {
      case 1:
        return <Text>Super Admin</Text>;
      case 2:
        return <Text>Admin</Text>;
      case 3:
        return <Text>Consultant Manager </Text>;
      case 4:
        return <Text>Consultant </Text>;

      case 5:
        return <Text>Contractor </Text>;
      default:
        return <Text>User </Text>;
    }
  };

  console.log("customer: ", customerData);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getCompanyDetails = async () => {
        try {
          const res = await apiGetCompanyDetails(route.params.id);
          navigation.setOptions({
            title: res.data.data.name,
          });
          setCompanyData(res.data.data);
          const customer = res.data.customers.filter(
            (customer) => customer.id == companyData.customer_id
          );
          // console.log("customer res: ", res.data.customers);
          setCustomerData(customer[0]);

          // setUsers([...res.data.users]);
        } catch (error) {
          console.log(error);
        }
      };
      getCompanyDetails();

      return () => (isActive = false);
    }, [])
  );

  // useEffect(() => {
  //   const getCompanyDetails = async () => {
  //     try {
  //       const res = await apiGetCompanyDetails(route.params.id);
  //       // console.log(res.data);
  //       setCompanyData(res.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getCompanyDetails();
  //   console.log("companyData obj: ", companyData);

  //   navigation.setOptions({
  //     title: companyData.name,
  //   });
  // }, []);

  const tabsData = [
    {
      name: "Details",
    },
    {
      name: "Projects",
    },
    {
      name: "Quotes",
    },
    {
      name: "All Tasks",
    },
    {
      name: "Commissions",
    },
    {
      name: "Users",
    },
    {
      name: "Analytics",
    },
  ];

  const renderTabOptions = () => {
    switch (selectedTab) {
      case 0:
        return (
          <CompanyInfo
            companyData={companyData}
            navigation={navigation}
            consultantManager={consultantManager}
            consultant={consultant}
            contractor={contractor}
            customerData={customerData}
          />
        );
      case 1:
        return <ProjectsList navigation={navigation} />;
      case 2:
        return (
          <QuotesList companyId={companyData.id} navigation={navigation} />
        );
      case 3:
        return <Text>Tasks</Text>;
      // case 4:
      //   return <CommissionsList navigation={navigation} />;
      case 5:
        return <UsersList navigation={navigation} usersList={users} />;
      case 6:
        return <Text>Analytics</Text>;
      default:
        return <Text>case default</Text>;
    }
  };

  // console.log(route.params);

  return (
    <View style={styles.centeredView}>
      <View style={styles.scrollBoxContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          horizontal={true}
        >
          {tabsData.map((tab, index) => {
            return (
              <Pressable
                key={index}
                style={
                  selectedTab === index
                    ? [styles.scrollBox, styles.tabActive]
                    : styles.scrollBox
                }
                onPress={() => setSelectedTab(index)}
              >
                <Text>{tab.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Text style={styles.angleRight}>
          <Icon name="angle-right" size={20} />
        </Text>
      </View>

      {/* <View style={styles.innerContainer}> */}
      {renderTabOptions()}
      {/* </View> */}
    </View>
  );
};

export default CompanyDetail;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 10,
    padding: 10,
    transition: "0.2s",
  },

  buttonsContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollBoxContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "pink",
    // paddingTop: 10,
    height: 80,
    marginVertical: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignContent: "center",
  },

  scrollContainer: {
    // backgroundColor: "yellow",
  },

  tabActive: {
    borderBottomWidth: 1,
    transition: "0.2s",
    // backgroundColor: "yellow",
    borderBottomColor: "#B76E79",
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

  scrollBox: {
    height: 24,
    // backgroundColor: "#1faadb",
    margin: 5,
    // padding: 2,
  },

  angleRight: {
    // backgroundColor: "red",
    marginLeft: 10,
  },

  companyContainer: {
    paddingHorizontal: 16,
    display: "flex",
    height: "80%",
    flexDirection: "column",
    justifyContent: "space-between",
    // borderWidth: 1,
  },

  innerCompanyContainer: {
    // borderWidth: 1,
  },

  heading: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },

  button: {
    margin: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
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

  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  listItem: {
    backgroundColor: "#fff",
    margin: 2,
    width: "80%",
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
  },

  addButton: {
    margin: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    // padding: 2,
  },

  wrapField: {
    flex: 1,
    flexWrap: "wrap",
  },
});
