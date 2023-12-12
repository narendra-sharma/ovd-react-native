import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const AnalyticsGraphs = ({ title, labels, data, bottomTitle }) => {
  const [graphData, setGraphData] = useState(data);

  const renderTitle = () => {
    return (
      <View style={{ marginVertical: 30 }}>
        <Text
          style={{
            color: "#000000",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {title}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 24,
          }}
        >
          {labels.map((label) => (
            <View
              key={label.label}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 1,
                  backgroundColor: label.frontColor,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  width: label.width,
                  height: 20,
                  color: "#697a8d",
                }}
              >
                {label.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      console.log(data);
      setGraphData(data);

      return () => (isActive = false);
    }, [data])
  );

  //   useFocusEffect(
  //     useCallback(() => {

  //     }, [data])
  //   );

  return (
    <View style={styles.boxesContainer}>
      {renderTitle()}
      <BarChart width={400} rulesType="solid" data={graphData} />
      <Text
        style={{
          color: "#697a8d",
          textAlign: "center",
        }}
      >
        {bottomTitle}
      </Text>
    </View>
  );
};

export default AnalyticsGraphs;

const styles = StyleSheet.create({
  boxesContainer: {
    width: "100%",
  },
});
