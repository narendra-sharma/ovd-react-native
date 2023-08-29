import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet, FlatList } from "react-native";

const CustomDrawer = () => {
  return (
    <View style={styles.drawerContainer}>
      <Text>Logo, Your Name</Text>
      <FlatList
        data={[{ key: "About" }, { key: "Home" }, { key: "Profile" }]}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
};

const CustomDrawerIcon = ({ navigation }) => {
  const [isDrawn, setIsDrawn] = useState(false);
  return (
    <View>
      <Pressable onPress={() => setIsDrawn(true)}>
        <Text>Click</Text>
      </Pressable>
      {isDrawn ? <CustomDrawer /> : null}
    </View>
  );
};

export default CustomDrawerIcon;

const styles = StyleSheet.create({
  drawerContainer: {
    height: "100%",
    width: 150,
    position: "fixed",
    zIndex: "99999 !important",
    backgroundColor: "#fff",
    borderRightColor: "black",
    borderRightWidth: "1px",
    marginTop: -25,
  },
});
