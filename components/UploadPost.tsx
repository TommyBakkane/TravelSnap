import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { FIREBASE_APP, FIRESTORE_DB } from '../config/firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getAuth } from 'firebase/auth';
import * as Location from 'expo-location';

const storage = getStorage(FIREBASE_APP);

const UploadPost = () => {
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const auth = getAuth();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        setSelectedImage(manipResult.uri);
      } catch (error) {
        console.error('Error manipulating image:', error);
      }
    }
  };

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        setSelectedImage(manipResult.uri);
      } catch (error) {
        console.error('Error manipulating image:', error);
      }
    }
  };

  const uploadPost = async () => {
    if (!selectedImage) {
      console.log('Please select an image first.');
      return;
    }

    setUploading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        console.log(currentLocation);

        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const imageName = new Date().getTime().toString();

        const imageRef = storageRef(storage, `images/${imageName}`);
        await uploadBytes(imageRef, blob);

        const downloadURL = await getDownloadURL(imageRef);


        const locationData =
          currentLocation && currentLocation.coords
            ? {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }
            : null;

        if (locationData) {
          const userPostsCollectionRef = collection(FIRESTORE_DB, 'posts');
          const userPostsDocRef = await addDoc(userPostsCollectionRef, {
            userId: auth?.currentUser?.displayName,
            image: selectedImage,
            caption,
            likes: 0,
            dislikes: 0,
            comments: [],
            location: locationData,
          });

          console.log('Post uploaded successfully:', downloadURL);
          console.log(userPostsDocRef);
        } else {
          console.log('Location data is undefined or has unexpected structure.');
        }
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error uploading post:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload a Post</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={caption}
        onChangeText={(text) => setCaption(text)}
      />

      {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginBottom: 12 }} />}

      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.pickImageButtonText}>Pick an Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pickImageButton} onPress={takePicture}>
        <Text style={styles.pickImageButtonText}>Take a Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.uploadButton, { opacity: uploading ? 0.5 : 1 }]}
        onPress={uploadPost}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="large" color="blue" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '80%', 
  },
  uploadButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginTop: 12, 
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickImageButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginTop: 12,
  },
  pickImageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UploadPost;
