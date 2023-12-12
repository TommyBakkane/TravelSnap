import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Modal } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import Settings from '../Settings';
import SignOut from '../SignOut';

const UserInfo = () => {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  const toggleSettingsModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
      <Image
        source={{ uri: user?.photoURL || '' }}
        style={styles.profilePicture}
      />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.displayName}</Text>
        </View>
        <Pressable onPress={toggleSettingsModal}>
          <Icon name="cog" size={25} color="#000" style={styles.icon} />
        </Pressable>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>123</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <SignOut />
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
        visible={modalVisible}
        onRequestClose={toggleSettingsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Settings onClose={() => setModalVisible(false)} />
            <Pressable onPress={toggleSettingsModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
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
