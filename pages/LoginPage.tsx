import { View, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, Modal, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../config/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword  } from 'firebase/auth';
import { doc, getFirestore, getDoc } from 'firebase/firestore';
import SignUp from '../components/SignUp';




const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH;
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [isSignUpModalVisible, setSignUpModalVisible] = useState(false);

    const toggleSignUpModal = () => {
        setSignUpModalVisible(!isSignUpModalVisible);
    };


    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const user = response.user;

            const userDocRef = doc(getFirestore(), 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
    
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const retrievedUsername = userData.username;
                console.log('Username:', retrievedUsername);
                setUsername(retrievedUsername); 
            }
    
            setIsSignedIn(true);
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
                <TextInput value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)} secureTextEntry={true}></TextInput>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff"/> 
                ) : (
                    <>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={signIn}>
                            <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={toggleSignUpModal}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isSignUpModalVisible}
                            onRequestClose={toggleSignUpModal}
                        >
                            <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <SignUp />
                                <TouchableOpacity onPress={toggleSignUpModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                        </Modal>
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
      },
      closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
      },
      closeButtonText: {
        color: 'blue',
        fontSize: 16,
      },
      button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
});
