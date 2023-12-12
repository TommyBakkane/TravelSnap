import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import PicturePage from "../pages/PicturePage";
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchPage from "../pages/SearchPage";

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
    return (
        <Tab.Navigator
        screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
        }}
        >
        <Tab.Screen name="Home" component={HomePage} options={
            {tabBarIcon: () => (
            <Icon name="home" size={25} color="#000" />
            )}
        } />
        <Tab.Screen name="Search" component={SearchPage} options={
            {tabBarIcon: () => (
            <Icon name="search" size={25} color="#000" />
            )}
        } />
        <Tab.Screen name="Picture" component={PicturePage} options={
            {tabBarIcon: () => (
            <Icon name="camera" size={25} color="#000" />
            )}
        } />
        <Tab.Screen name="Profile" component={ProfilePage} options={
            {tabBarIcon: () => (
            <Icon name="user" size={25} color="#000" />
            )}
        } />
        </Tab.Navigator>
    );
}

export default AppNavigator