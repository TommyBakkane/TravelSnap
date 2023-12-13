import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const Header: React.FC = () => {
  return (
      <View style={styles.header}>
        <Icon name="globe" size={32} color="#000" style={styles.logo} />
        <Text style={styles.title}>TravelSnap</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    logo: {
      marginRight: 8,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
    }
  });
  

export default Header;

