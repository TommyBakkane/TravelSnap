import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Picture from './pages/Picture';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './pages/Login';
import CreatePost from './components/uploadPost/CreatePost';


const Tab  = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={Home} options={
          {tabBarIcon: () => (
            <Icon name="home" size={25} color="#000" />
          )}
        } />
        <Tab.Screen name="Upload" component={CreatePost} options={
          {tabBarIcon: () => (
            <Icon name="camera" size={25} color="#000" />
          )}
        } />
        <Tab.Screen name="Profile" component={Profile} options={
          {tabBarIcon: () => (
            <Icon name="user" size={25} color="#000" />
          )}
        } />
      </Tab.Navigator>
    </NavigationContainer> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;