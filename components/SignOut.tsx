import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

const SignOut = () => {

  //this code lets the user sign out for the app
const handleSignOut = async () => {
    const auth = getAuth();

    try {
        await signOut(auth);
        console.log('User signed out successfully');
    } catch (error) {
        console.log(error);
    }
};

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
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
