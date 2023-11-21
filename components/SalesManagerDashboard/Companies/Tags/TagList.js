import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { apiDeleteTag, apiGetAllTags } from "../../../../apis/tags";
import Toast from "react-native-root-toast";

const TagsList = ({ navigation }) => {
  const [tagsList, setTagsList] = useState([]);
  const [deleteFlag, setDeleteFlag] = useState(false);

  // console.log(tagsList);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAllTasks = async () => {
        const res = await apiGetAllTags();
        console.log("tags", res.data);

        setTagsList(res.data.tags);
      };

      getAllTasks();

      return () => {
        isActive = false;
      };
    }, [deleteFlag])
  );

  const handleDelete = async (name, id) => {
    const deleteTag = async () => {
      try {
        const res = await apiDeleteTag(id);
        console.log(res.data);
        if (res.data.message == "Deleted successfully") {
          Toast.show("Tag Deleted Successfully", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
        setDeleteFlag((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    };
    Alert.alert(`Delete ${name}`, `Are you sure you want to delete ${name}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteTag() },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        // data={tagsList.sort(sortTasks)}
        data={tagsList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate("Tag Details", item);
            }}
            style={styles.listItem}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                style={{ marginRight: 8, transform: "rotateZ(90deg)" }}
                name="tag"
                size={18}
                color="#444"
              />
              <View>
                <Text style={styles.item}>Name: {item.name}</Text>
                {/* <Text style={styles.subText}>Status: {item.status}</Text> */}
              </View>
            </View>
            <View style={styles.iconsContainer}>
              <Icon
                onPress={() => navigation.navigate("Edit Tag", item)}
                name="pen"
                size={18}
                color="#444"
              />
              <Icon
                onPress={() => handleDelete(item.name, item.id)}
                name="trash-alt"
                size={18}
                color="#444"
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default TagsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "pink",
  },

  button: {
    margin: 10,
    backgroundColor: "#B76E79",
    padding: 12,
    borderRadius: 5,
    width: "50%",
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
    padding: 10,
  },

  item: {
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

  subText: {
    fontSize: 12,
  },
});