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


  // this code is used to get the current user's name and avatar
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

  // this lets the user pick an image from their phone and add it as an avatar
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
  
  //this code is used to update the user's profile based on user inputs
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
          <Pressable onPress={pickImage}>
              <Text style={styles.button}>Upload Avatar</Text>
            </Pressable>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.image} />
            )}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    color: '#fff',
    fontSize: 18,
    padding: 12,
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
    fontSize: 18,
  },
});
export default Settings;