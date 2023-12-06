import React, {useEffect, useState} from 'react';
import { Alert, StyleSheet, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Picture from './pages/Picture';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './pages/Login';
import CreatePost from './components/uploadPost/CreatePost';
import { FIREBASE_AUTH } from './config/firebase';
import { ActivityIndicator } from 'react-native';
import { User, sendEmailVerification } from 'firebase/auth';

const Tab  = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (authUser) => {
      setUser((prevState) => authUser || null);
      setLoading(false);

      if (authUser && !authUser.emailVerified) {
        try {

          await sendEmailVerification(authUser);
          Alert.alert(
            'Email Verification',
            'A verification email has been sent to your email address. Please verify your email before continuing.',
          );
        } catch (error) {
          console.error('Error sending email verification:', error);
        }
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: () => <Icon name="home" size={25} color="#000" />,
            }}
          />
          <Tab.Screen
            name="Upload"
            component={CreatePost}
            options={{
              tabBarIcon: () => <Icon name="camera" size={25} color="#000" />,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: () => <Icon name="user" size={25} color="#000" />,
            }}
          />
        </Tab.Navigator>
      ) : (

        <Login onSignInSuccess={() => {}} />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }, 
});
