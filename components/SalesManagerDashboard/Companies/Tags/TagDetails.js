import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { apiDeleteTag, apiGetPreFilledTagDetails } from "../../../../apis/tags";
import Toast from "react-native-root-toast";
import TasksList from "../Projects/Tasks/TaskList";
import { handlererrors } from "../../../../apis/auth";

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
        handlererrors(error,navigation)
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
        handlererrors(error,navigation)
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
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <View style={{ width: "90%", marginHorizontal: "auto" }}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Name</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}> {tagData.name} </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Tag Description</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{tagData.description}</Text>
        </View>

        {/* <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Tag Cost</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{tagData.total_cost}</Text>
        </View> */}

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldName}>Deadline</Text>
          <Text style={styles.span}>:</Text>
          <Text style={styles.fielContent}>{tagData.deadline}</Text>
        </View>
      </View>

      {tagData?.id && <TasksList navigation={navigation} tagId={tagData?.id} />}

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

  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  buttonsContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "pink",
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

  addButton: {
    margin: 10,
    backgroundColor: "#696cff",
    padding: 12,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "space-around",
  },

  addText: {
    color: "#fff",
  },
});
