import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { FIREBASE_APP, FIRESTORE_DB } from '../config/firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const storage = getStorage(FIREBASE_APP);

const UploadPost = () => {
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Sorry, we need media library permissions to make this work.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1, // Set quality to 1 to avoid double compression
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
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const imageName = new Date().getTime().toString();
  
      const imageRef = storageRef(storage, `images/${imageName}`);
      await uploadBytes(imageRef, blob);
  
      const downloadURL = await getDownloadURL(imageRef);
  
      // Assuming you have a 'posts' collection in your Firestore database
      const userPostsCollectionRef = collection(FIRESTORE_DB, 'posts');
      const userPostsDocRef = await addDoc(userPostsCollectionRef, {
        image: selectedImage,
        caption,
        likes: 0,
        dislikes: 0,
        comments: [],
        timestamp: new Date().getTime(),
      });
  
      console.log('Post uploaded successfully:', downloadURL);
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
  
      <TouchableOpacity
        style={styles.pickImageButton}
        onPress={pickImage}  
      >
        <Text style={styles.pickImageButtonText}>Pick an Image</Text>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={[styles.uploadButton, { opacity: uploading ? 0.5 : 1 }]}
        onPress={uploadPost}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Text>
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
    alignItems: 'center', // Center items horizontally
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
    width: '80%', // Adjust the width as needed
  },
  uploadButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%', // Adjust the width as needed
    marginTop: 12, // Add spacing
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
    width: '80%', // Adjust the width as needed
    marginTop: 12, // Add spacing
  },
  pickImageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default UploadPost;
