import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import Search from "../components/Search";

const SearchPage: React.FC = () => {
    return (
        <View style={styles.container}>
          <Header />
          <Search />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    }
});

export default SearchPage;