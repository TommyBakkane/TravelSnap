import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import UserInfo from "../components/UserInfo";
import SignOut from "../components/SignOut";


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
    postContainer: {
      marginVertical: 8,
    },
    postImage: {
      width: '100%',
      aspectRatio: 1,
    },
  });

export default ProfilePage;