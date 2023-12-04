import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Feed from "../components/Feed";
import Header from "../components/Header";


const Home: React.FC = () => {

  return (
      <View style={styles.container}>
          <Header />
          <Feed />
      </View>

  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
  });
  

export default Home;
