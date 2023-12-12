// Import necessary components from React Navigation
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native';

const RegistrationPage: React.FC<{ onRegistrationSuccess: () => void }> = ({ onRegistrationSuccess }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const createAccount = async () => {
    setLoading(true);
    try {

        const auth = getAuth();
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;

        await updateProfile(user, {
            displayName: username,
        });

        const userDocRef = doc(getFirestore(), 'users', user.uid);
        await setDoc(userDocRef, { username, email });

      onRegistrationSuccess();

    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
        <TextInput value={username} style={styles.input} placeholder="Username" autoCapitalize="none" onChangeText={(text) => setUsername(text)} />
        <TextInput value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)} secureTextEntry={true} />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.buttonContainer}>
            <Button title="Create account" onPress={createAccount} />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: '#fff',
      width: '80%',
    },
    buttonContainer: {
      marginTop: 20,
    },
    activityIndicator: {
      marginTop: 20,
    },
  });
  

export default RegistrationPage; 