import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import UploadPost from "../components/UploadPost";


const PicturePage: React.FC = () => {
    return (
        <View style={styles.container}>
          <Header />
          <UploadPost />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
  });

export default PicturePage;