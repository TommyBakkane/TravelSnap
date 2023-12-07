import { View, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../config/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export interface LoginProps {
    onSignInSuccess: () => void
}

const LoginPage: React.FC<LoginProps> = ({ onSignInSuccess }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH;
    const [isSignedIn, setIsSignedIn] = useState(false)

    const signIn = async () => {
        setLoading(true)
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
            console.log(response)
            setIsSignedIn(true)
            onSignInSuccess();
        } catch (error: any) {
            console.log(error)
            alert('Sign in failed: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async () => {
        setLoading(true)
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            console.log(response)
            
            const user = response.user;
            await sendEmailVerification(user);
        } catch (error: any) {
            console.log(error)
            alert('Sign in failed: ' + error.message)
        } finally {
            setLoading(false)
        }
    }



    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
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
