import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { getAuth, onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL as getDownloadURLStorage } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

interface SettingsProps {
  onClose: () => void;
}
const Settings: React.FC<SettingsProps> = ({ onClose }) => {

  const auth = getAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        const storage = getStorage();
        const reference = storageRef(storage, `avatars/${auth.currentUser?.uid}`);
        const uploadTask = uploadBytesResumable(reference, blob);
  
        uploadTask.on('state_changed', null, null, async () => {
          const downloadURL = await getDownloadURLStorage(reference);
          setAvatarUrl(downloadURL);
        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  
  const handleUpdateProfile = async () => {
    try {
      if (newUsername.trim() !== '' || avatarUrl) {
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          if (newUsername.trim() !== '') {
            await updateProfile(currentUser, { displayName: newUsername } as any);
          }
  
          if (avatarUrl) {
            await updateProfile(currentUser, { photoURL: avatarUrl } as any);
          }
  
          setNewUsername('');
          setUser(currentUser);
        }
      }
      onClose();
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

          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.image} />
            )}
            <Pressable onPress={pickImage}>
              <Text style={styles.button}>Upload Avatar</Text>
            </Pressable>
          </View>

          <Pressable onPress={handleUpdateProfile} >
            <Text style={styles.button}>Update Profile</Text>
          </Pressable>
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
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  button: {
    color: 'white',
    fontSize: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#3498db',
    textAlign: 'center',
    marginTop: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
  },
  infoText: {
    marginTop: 16,
    color: '#888',
  },
});

export default Settings;