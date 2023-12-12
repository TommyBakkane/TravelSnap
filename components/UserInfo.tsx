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
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: user?.photoURL || '' }}
          style={styles.profilePicture}
        />
      </View>

      <View style={styles.spacing} />

      <View style={styles.itemContainer}>
        <View style={styles.userInfo}>
          <Text style={styles.usernameText}>{user?.displayName}</Text>
          <Pressable onPress={toggleSettingsModal}>
            <Icon name="cog" size={25} color="#000" style={styles.icon} />
          </Pressable>
        </View>
      </View>

      <View style={styles.spacing} />

      <View style={styles.itemContainer}>
        <SignOut />
      </View>

      <View style={styles.spacing} />

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  itemContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  icon: {
    marginLeft: 16,
  },
  spacing: {
    height: 16,
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
    height: '50%',
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
