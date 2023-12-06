import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import UserInfo from "../components/user/UserInfo";
import ProfileGrid from "../components/user/ProfileGrid";


const Profile: React.FC = () => {
    return (
        <View style={styles.container}>
            <Header />
            <UserInfo />
            <ProfileGrid/>
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
      aspectRatio: 1, // Maintain aspect ratio
    },
  });

export default Profile;