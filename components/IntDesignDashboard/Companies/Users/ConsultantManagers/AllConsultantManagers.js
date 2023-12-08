import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
  TouchableNativeFeedback,
  ActivityIndicator
} from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { apiGetAllUsers } from "../../../../../apis/companies";
import { apiDeleteUser, apiGetUsersFromUsers } from "../../../../../apis/users";
import { handlererrors } from "../../../../../apis/auth";

const randomHexColor = () => {
  return "#b7d0d1";
};

const AllConsultantManagers = ({ navigation }) => {
  const [consultantManagerList, setConsultantManagerList] = useState([]);
  const [deleteFlag, setDeteleFlag] = useState(false);
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleRadius, setRippleRadius] = useState(10);
  const [rippleOverflow, setRippleOverflow] = useState(true);
  const [allList, setAllList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getConsultantManagers = async () => {
        setIsLoading(true);
        try{
        const res = await apiGetUsersFromUsers();
        console.log(res.data);
        // console.log(res.data.data);

        setConsultantManagerList([...res.data.managers]);
        setAllList([...res.data.managers]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        handlererrors(error,navigation)
      }
      };

      getConsultantManagers();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

  //function to delete the user
  const handleDelete = async (user, userId) => {
    const deleteUser = async () => {
      try {
        const res = await apiDeleteUser(userId);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          setDeteleFlag((prev) => !prev);
          Toast.show("User Deleted Successfully", {
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
    Alert.alert(`Delete ${user}`, `Are you sure you want to delete ${user}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteUser() },
    ]);
  };
  const handleSearch = (text) => {
    let filteredData = [...allList]
    if (text && text.length > 0) {
      filteredData = filteredData.filter((item) =>
      item?.name.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
    setConsultantManagerList([...filteredData]);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => {
          navigation.navigate("Add Consultant Manager");
        }}
      >
        <Text style={styles.addText}>
          <Icon name="plus-circle" /> Add New
        </Text>
      </Pressable>
{/* SEARCHBOX CONTAINER */}
<View style={styles.searchboxContainer}>
        <Icon
          style={{
            marginHorizontal: 6,
            // borderRightWidth: 1,
            // borderRightColor: "#d9d9d9",
          }}
          color="#d9d9d9"
          name="search"
          size={20}
        />
        <TextInput
          name="search"
          placeholder="Search"
          onChangeText={(text) => {
            handleSearch(text);
            setSearchTerm(text);
          }}
          style={{
            width: "90%",
            height: "100%",
            // backgroundColor: "pink",
            padding: 8,
          }}
          value={searchTerm}
        />
        {/* {searchTerm && searchTerm.length > 0 && (
        <TouchableOpacity 
          onPress={()=>{
            handleSearch("");
            setSearchTerm("");
          }} 
          style={{ padding: 8 }}
        >
          <Icon
            name="window-close" // Replace with the actual icon name for a close or clear icon
            size={20}
            color="#000000"
          />
        </TouchableOpacity>
      )} */}
      </View>
      {isLoading ? (
        <View style={styles.container}>
<ActivityIndicator color="#B76E79" size="large"/>
</View>
      ) : (consultantManagerList.length>0)?<FlatList
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        // style={{ height: 100 }}
        data={consultantManagerList}
        renderItem={({ item }) => (
          <>
            <Pressable style={styles.listItem}>
              <Pressable
                style={{ width: "76%" }}
                onPress={() => {
                  navigation.navigate("Consultant Manager Details", {
                    id: item.id,
                  });
                  // navigation.setOptions({ title: "Updated!" });
                }}
              >
                <Text style={styles.item}>{item.name}</Text>
              </Pressable>

              <View style={styles.iconsContainer}>
                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    navigation.navigate("Edit Consultant Manager", {
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
                      <Icon
                        name="pen"
                        size={18}
                        color="#444"
                        // color="blue"
                      />
                    </Text>
                  </View>
                </TouchableNativeFeedback>

                <TouchableNativeFeedback
                  onPress={() => {
                    setRippleColor(randomHexColor());
                    handleDelete(item.name, item.id);
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
      />: (
        <View style={styles.container}>
          <Text style={{ fontWeight: "bold"}}>No Consultant Managers Available!</Text>
        </View>  
      )}
      {/* <Signature /> */}
    </ScrollView>
  );
};

export default AllConsultantManagers;

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

  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
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
    width: "20%",
    justifyContent: "space-between",
  },

  rippleView: {
    padding: 2,
    borderRadius: 10,
    overflow: "hidden",
  },

  addButton: {
    margin: 5,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
    marginBottom: 20,
  },

  addText: {
    color: "#fff",
  },
  searchboxContainer: {
    backgroundColor: "#EDEDED",
    marginBottom: 16,
    width: "96%",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 4,
    padding: 4,
  },
});
AllConsultantManagers;
