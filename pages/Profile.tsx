import React from "react";
import { View, Text, StyleSheet } from "react-native";


const Profile: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home page!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    }
});

export default Profile;