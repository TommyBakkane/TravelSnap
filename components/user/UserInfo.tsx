import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import SettingsPage from '../../pages/SettingsPage';

const UserInfo = () => {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const navigation = useNavigation();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      setUser(user);
    } else {
      console.log('User is logged out');
      setUser(null);
    }
  });

  const toggleSettingsModal = () => {
    setSettingsModalVisible(!isSettingsModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: 'https://placekitten.com/200/200' }}
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.displayName}</Text>
        </View>
        <TouchableOpacity onPress={toggleSettingsModal}>
          <Icon name="cog" size={25} color="#000" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>123</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>
      <Text style={styles.biography}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel
        consectetur mauris. Integer commodo facilisis felis, non aliquam turpis
        euismod in.
      </Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSettingsModalVisible}
        onRequestClose={toggleSettingsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SettingsPage />
            <TouchableOpacity onPress={toggleSettingsModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      padding: 20,
    },
    profilePicture: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginLeft: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    statLabel: {
      color: '#666',
    },
    biography: {
      marginTop: 16,
      fontSize: 16,
      lineHeight: 22,
    },
    icon: {
      marginLeft: 16,
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
  });

export default UserInfo;
