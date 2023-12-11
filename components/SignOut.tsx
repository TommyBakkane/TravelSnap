import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SignOut = () => {
const navigation = useNavigation();

const handleSignOut = async () => {
    const auth = getAuth();

    try {
        await signOut(auth);
        console.log('User signed out successfully');

        // Navigate to the root or initial screen (change 'App' to your root navigator name)
        navigation.navigate('App' as never);
    } catch (error) {
        console.error('Error signing out:', error);
    }
};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SignOut;
