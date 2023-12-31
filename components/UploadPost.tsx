import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Image, Pressable } from 'react-native';
import { FIREBASE_APP, FIRESTORE_DB } from '../config/firebase';
import { getStorage} from 'firebase/storage';
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

  const auth = getAuth();
  
  const capitalizeFirstLetter = (text: string) => {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  //this lets the user pcik an image from their phone
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

  //this lets the user take a picture with their phone
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

  //this code uploads the post to the database
  const uploadPost = async () => {
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    setUploading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});

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
        } 
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Post</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={caption}
        onChangeText={(text) => setCaption(capitalizeFirstLetter(text))}
      />

      {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginBottom: 12 }} />}

      <View style={styles.buttonContainer}>
      <Pressable style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </Pressable>

      <Pressable style={styles.imageButton} onPress={takePicture}>
        <Text style={styles.buttonText}>Take a Picture</Text>
      </Pressable>
      </View>

      <Pressable
        style={[styles.uploadButton, { opacity: uploading ? 0.5 : 1 }]}
        onPress={uploadPost}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
      </Pressable>

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
  title: {
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
  },

  imageButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, 
    marginHorizontal: 6,
  },

  uploadButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
});

export default UploadPost;
