import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Modal } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import Settings from './Settings';
import SignOut from './SignOut';

const UserInfo = () => {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // this code is used to get the current user's information
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  //this code is used to toggle the settings modal on and off.
  const toggleSettingsModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: user?.photoURL || '' }}
          style={styles.profilePicture}
        />
        <Text style={styles.username}>{user?.displayName}</Text>
      </View>



      <View style={styles.itemContainer}>
          <Pressable onPress={toggleSettingsModal}>
            <Icon name="cog" size={25} color="#000" style={styles.icon} />
          </Pressable>
        <SignOut />
      </View>

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
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  userInfo: {
    marginBottom: 24,
 
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  icon: {
    marginBottom: 32,
    fontSize: 32,
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
    height: '80%',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  setting: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default UserInfo;
