import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginPage from '../pages/LoginPage';
import AppNavigator from './AppNavigator';
import { User } from 'firebase/auth';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/DetailPage';

const Stack = createStackNavigator();

const NavigationStack: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="MainApp"
            component={AppNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen 
          name="Login" 
          component={LoginPage}
          options={{ headerShown: false }} 
          />
        )}
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Details" component={DetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;