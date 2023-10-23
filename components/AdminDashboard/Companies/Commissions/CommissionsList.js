import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { apiGetAllCommissions } from "../../../../apis/commisions";

const CommissionsList = ({ navigation }) => {
  const [commissionsList, setCommissionsList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          const res = await apiGetAllCommissions();
          console.log("commissions: ", res.data.data);
          setCommissionsList([...res.data.data]);
        } catch (error) {
          console.log(error);
        }
      })();

      return () => (isActive = false);
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
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
      />
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
});
