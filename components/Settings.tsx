import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL as getDownloadURLStorage } from 'firebase/storage';

const Settings: React.FC = () => {
  const auth = getAuth();
  const storage = getStorage();
  const [user, setUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setAvatarUrl(user.photoURL);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  

  const handleUpdateProfile = async () => {
    try {
      if (newUsername.trim() !== '') {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateProfile(currentUser, { displayName: newUsername } as any);
        }
      }
      setNewUsername('');
      setUser(auth.currentUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {user && (
        <View>
            <TextInput
            placeholder="Enter new name"
            value={newUsername}
            onChangeText={(text) => setNewUsername(text)}
            style={styles.input}
          />

          <View style={styles.avatarContainer}>
            {avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
            <TouchableOpacity >
              <Text style={styles.uploadText}>Upload Avatar</Text>
            </TouchableOpacity>
          </View>

          

          <Button title="Update Profile" onPress={handleUpdateProfile} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  uploadText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  infoText: {
    marginTop: 16,
    color: '#888',
  },
});

export default Settings;
