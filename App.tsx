import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Routes/AppNavigator';
import LoginPage from './pages/LoginPage';
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
        <LoginPage onSignInSuccess={handleSignInSuccess} />
      )}
    </NavigationContainer>
  );
};


export default App;