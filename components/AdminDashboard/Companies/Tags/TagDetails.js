import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { apiDeleteTag, apiGetPreFilledTagDetails } from "../../../../apis/tags";
import Toast from "react-native-root-toast";

const TagDetails = ({ navigation, route }) => {
  const [tagData, setTagData] = useState({});

  useEffect(() => {
    const getTagDetails = async () => {
      try {
        const res = await apiGetPreFilledTagDetails(route.params.id);
        console.log(res.data);
        setTagData({ ...res.data.tag });
      } catch (error) {
        console.log(error);
      }
    };

    getTagDetails();
  }, []);

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
          navigation.goBack();
        }
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
    <View style={styles.centeredView}>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Name: </Text>
        <Text> {tagData.name} </Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Tag Description: </Text>
        <Text>{tagData.description}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Tag Cost: </Text>
        <Text>{tagData.total_cost}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldName}>Deadline: </Text>
        <Text>{tagData.deadline}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => navigation.navigate("Edit Tag", tagData)}
        >
          <Text style={styles.textStyle}>Edit Tag Details</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => handleDelete(tagData.name, tagData.id)}
        >
          <Text style={styles.textStyle}>Delete Tag</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TagDetails;

const styles = StyleSheet.create({
  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    padding: 2,
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
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 10,
    // margin: 10,
    padding: 15,
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "pink",
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
