import { View, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../config/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword  } from 'firebase/auth';
import { doc, getFirestore, getDoc } from 'firebase/firestore';

export interface LoginProps {
    onSignInSuccess: () => void
}

const LoginPage: React.FC<LoginProps> = ({ onSignInSuccess }) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH;
    const [isSignedIn, setIsSignedIn] = useState(false)


    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
    
            // Update user profile with the username
            await updateProfile(user, {
                displayName: username,
            });
    
            // Send email verification
            await sendEmailVerification(user);
        } catch (error: any) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const user = response.user;
    
            // Fetch additional user information from Firestore
            const userDocRef = doc(getFirestore(), 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
    
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const retrievedUsername = userData.username;
                console.log('Username:', retrievedUsername);
                setUsername(retrievedUsername); // Set the username in your component state
            }
    
            setIsSignedIn(true);
            onSignInSuccess();
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput value={username} style={styles.input} placeholder="Username" autoCapitalize="none" onChangeText={(text) => setUsername(text)}></TextInput>
                <TextInput value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)} secureTextEntry={true}></TextInput>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff"/> 
                ) : (
                    <>
                        <View style={styles.buttonContainer}>
                            <Button title="Sign In" onPress={signIn} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Create account" onPress={signUp} />
                        </View>
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    )

}

export default LoginPage;

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
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    buttonContainer: {
        marginTop: 10,
    }
});
