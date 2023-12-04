import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";


const Profile: React.FC = () => {
    return (
        <View style={styles.container}>
            <Header />
            <Text>Profile</Text>
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