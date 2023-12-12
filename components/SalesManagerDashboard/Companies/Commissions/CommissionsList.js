import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { apiGetAllCommissions } from "../../../../apis/commisions";
import { TextInput } from "react-native-gesture-handler";
import { handlererrors } from "../../../../apis/auth";

const CommissionsList = ({ navigation }) => {
  const [commissionsList, setCommissionsList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        setIsLoading(true);
        try {
          const res = await apiGetAllCommissions();
          console.log("commissions: ", res.data.data);
          setCommissionsList([...res.data.data]);
          setAllList([...res.data.data]);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          handlererrors(error,navigation)
        }
      })();

      return () => (isActive = false);
    }, [])
  );
  const handleSearch = (text) => {
    let filteredData = [...allList]
    if (text && text.length > 0) {
      filteredData = filteredData.filter((proj) =>
      proj?.project_name.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
    setCommissionsList([...filteredData]);
  };
  return (
    <View style={styles.container}>
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
      ) : (commissionsList.length>0) ? <FlatList
        // style={{ height: 100 }}
        data={commissionsList}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                navigation.navigate("Commission Details", item);
                // navigation.setOptions({ title: "Updated!" });
              }}
              style={styles.listItem}
            >
              <Text style={styles.item}>{item.project_name}</Text>
              <View style={styles.iconsContainer}>
                <Icon
                  onPress={() => navigation.navigate("Edit Commission", item)}
                  name="pen"
                  size={22}
                  color="#444"
                />
                <Icon
                  // onPress={() => handleDelete(item.name, item.id)}
                  name="trash-alt"
                  size={22}
                  color="#444"
                />
              </View>
            </Pressable>
          </>
        )}
      />: (
        <View style={styles.container}>
          <Text style={{ fontWeight: "bold"}}>No Commissions Available!</Text>
        </View>
      )}
    </View>
  );
};

export default CommissionsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    // backgroundColor: "pink",
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
