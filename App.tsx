// App.tsx

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginPage from './pages/LoginPage';
import AppNavigator from './Routes/AppNavigator';
import { User } from 'firebase/auth';

const Stack = createStackNavigator();

const App = () => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
