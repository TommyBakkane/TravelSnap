import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import UserInfo from "../components/UserInfo";


const ProfilePage: React.FC = () => {
    return (
        <View style={styles.container}>
            <Header />
            <UserInfo />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
  });

export default ProfilePage;