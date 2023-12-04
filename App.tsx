import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Routes/AppNavigator';
import Login from './pages/Login';
import Header from './components/Header';

const App: React.FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const handleSignInSuccess = () => {
    setIsUserLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {isUserLoggedIn ? (
        <AppNavigator />
      ) : (
        <Login onSignInSuccess={handleSignInSuccess} />
      )}
    </NavigationContainer>
  );
};


export default App;