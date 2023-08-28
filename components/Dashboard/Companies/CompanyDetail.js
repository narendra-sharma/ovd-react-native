import { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ToastAndroid,
} from "react-native";
import { mockData } from "./MOCK_DATA";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/FontAwesome";
import ProjectsList from "./Projects/ProjectsList";
import QuotesList from "./Quotes/QuotesList";
import {
  apiDeleteCompany,
  apiGetCompanyDetails,
} from "../../../apis/companies";
import { useFocusEffect } from "@react-navigation/native";
import CommissionsList from "./Commissions/CommissionsList";

const initialCompanyData = {
  companyName: "",
  email: "",
  phoneNo: "",
  address: "Indian bank, jhujhar nagar",
};

const CompanyDetail = ({ navigation, route }) => {
  const [isCompanyEditOn, setIsCompanyEditOn] = useState(false);
  const [companyData, setCompanyData] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getCompanyDetails = async () => {
        try {
          const res = await apiGetCompanyDetails(route.params.id);
          // console.log(res.data);
          setCompanyData(res.data.data);
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
        return <ProjectsList navigation={navigation} />;
      case 1:
        return <QuotesList navigation={navigation} />;
      case 2:
        return <Text>Tasks</Text>;
      case 3:
        return <CommissionsList navigation={navigation} />;
      case 4:
        return <Text>Users</Text>;
      case 5:
        return <Text>Analytics</Text>;
      default:
        return <Text>case default</Text>;
    }
  };

  // console.log(route.params);

  const handleSubmit = () => {
    const index = mockData.findIndex((item) => item.id == companyData.id);
    mockData[index] = { ...mockData[index], companyData };
    setIsCompanyEditOn(false);
  };

  const handleDeleteCompany = async () => {
    const deleteCompany = async () => {
      try {
        const res = await apiDeleteCompany(route.params.id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          ToastAndroid.show("Company Deleted Successfully", ToastAndroid.SHORT);
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
    <>
      {isCompanyEditOn ? (
        <View style={styles.centeredView}>
          <Text>Edit</Text>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text>Company Name:</Text>
              <TextInput
                style={styles.input}
                name="name"
                value={companyData.companyName}
                onChangeText={(text) =>
                  setCompanyData({ ...companyData, companyName: text })
                }
                placeholder="Name"
              />
              <Text>Email:</Text>
              <TextInput
                style={styles.input}
                name="email"
                value={companyData.email}
                onChangeText={(text) =>
                  setCompanyData({ ...companyData, email: text })
                }
              />
              <Text>Phone Number:</Text>
              <TextInput
                style={styles.input}
                name="phoneNo"
                value={companyData.phoneNo}
                onChangeText={(text) =>
                  setCompanyData({ ...companyData, phoneNo: text })
                }
              />
              <Text>Address:</Text>
              <GooglePlacesAutocomplete
                placeholder="Search"
                autoFocus={true}
                // listViewDisplayed="auto"
                returnKeyType={"search"}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  props.notifyChange(details.geometry.location, data);
                }}
                query={{
                  key: "AIzaSyAzXDEebJV9MxtPAPhP1B2w5T3AYK2JOu0",
                  language: "en",
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={200}
                styles={placesStyle}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            ></View>
          </ScrollView>
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.textStyle}>Submit</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setIsCompanyEditOn(false)}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.centeredView}>
          <View style={styles.scrollBoxContainer}>
            <Text style={{ textAlign: "right" }}>
              {/* Swipe  */}
              <Icon name="angle-right" size={20} />
            </Text>

            <ScrollView horizontal={true}>
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
          </View>
          <Text style={styles.item}>{companyData.name}</Text>
          <View>
            <Text>Email: {companyData.email} </Text>
          </View>
          <View>
            <Text>Phone Number: {companyData.phoneNo} </Text>
          </View>
          <View>
            <Text>Location: {companyData.address} </Text>
          </View>

          {renderTabOptions()}

          <View>
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
      )}
    </>
  );
};

export default CompanyDetail;

const placesStyle = StyleSheet.create({
  textInputContainer: {
    backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    maxWidth: "100%",
    minWidth: "90%",
  },
  textInput: {
    height: 45,
    color: "#5d5d5d",
    fontSize: 16,
    borderWidth: 1,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  listView: {
    color: "black",
    backgroundColor: "white",
    maxWidth: "89%",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "blue",
  },
  description: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 14,
    maxWidth: "89%",
  },
});

const styles = StyleSheet.create({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },

  scrollBoxContainer: {
    // display: "flex",
    // flexDirection: "row",
    backgroundColor: "pink",
    // position: "relative",
    paddingTop: 10,
    height: 80,
    marginVertical: 15,
  },

  tabActive: {
    backgroundColor: "yellow",
  },

  scrollBox: {
    height: 24,
    // backgroundColor: "#1faadb",
    margin: 5,
  },

  input: {
    borderWidth: 1,
    width: 300,
    height: 35,
    marginTop: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    minWidth: 80,
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

  fieldName: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },
  buttonClose: {
    backgroundColor: "#B76E79",
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
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
