import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Picture from "../pages/Picture";
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
    return (
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
        <Tab.Screen name="Picture" component={Picture} options={
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
    );
}

export default AppNavigator