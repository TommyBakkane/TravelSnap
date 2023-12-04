import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from "../components/Header";
import Feed from "../components/Feed";


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
