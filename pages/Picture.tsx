import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";


const Picture: React.FC = () => {
    return (
        <View style={styles.container}>
            <Header />
            <Text>Picture</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
  });

export default Picture;