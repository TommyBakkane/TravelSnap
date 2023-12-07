// PostUpload.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator  } from 'react-native';
import ImagePicker, { ImagePickerResponse, ImageLibraryOptions, MediaType } from 'react-native-image-picker';
import { FIREBASE_APP, FIRESTORE_DB } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage(FIREBASE_APP)

const UploadPost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const options = {
    title: 'Select Image',
    mediaType: 'photo' as MediaType,  // Specify the media type as 'photo'
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  } as ImageLibraryOptions;

  const handleImagePicker = () => {
    ImagePicker.launchImageLibrary(options, (response) => {
      const imageResponse = response as ImagePickerResponse;
  
      if (!imageResponse.didCancel) {
        // Check if 'assets' is present and not empty
        if (imageResponse.assets && imageResponse.assets.length > 0) {
          const firstAssetUri = imageResponse.assets[0].uri;
  
          // Ensure 'setImage' is only called with a valid URI
          if (firstAssetUri) {
            setImage(firstAssetUri);
          } else {
            console.log('ImagePicker Error: URI is undefined in the response');
          }
        } else {
          console.log('ImagePicker Error: No assets found in the response');
        }
      } else {
        console.log('User cancelled image picker');
      }
    });
  };


  const handleUpload = async () => {
    try {
      // Allow the user to pick an image before proceeding with the upload
      await handleImagePicker();

      // Check if the image was selected
      if (!image) {
        console.log('Please select an image');
        return;
      }

      // Set uploading to true to show a loading indicator
      setUploading(true);

      // Convert image to blob(lol)
      const response = await fetch(image);
      const blob = await response.blob();

      // Create a unique file name
      const fileName = new Date().getTime().toString();

      // Upload image to Firebase storage
      const imageRef = storageRef(storage, `images/${fileName}`);
      await uploadBytes(imageRef, blob);

      // Get image URL
      const imageUrl = await getDownloadURL(imageRef);

      // Add new Firebase document
      const userPostsCollectionRef = collection(FIRESTORE_DB, 'posts');
      const userPostsDocRef = await addDoc(userPostsCollectionRef, {
        image: imageUrl,
        caption,
        likes: 0,
        dislikes: 0,
        comments: [],
        timestamp: new Date().getTime(),
      });

      console.log('Post uploaded successfully!');
    } catch (error: any) {
      console.error(error);
      alert('Failed to upload post');
    } finally {
      // Set uploading back to false after upload completion (success or failure)
      setUploading(false);
      // Reset data after successful or failed upload
      setCaption('');
      setImage('');
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

      <TouchableOpacity
        style={[styles.uploadButton, { opacity: uploading ? 0.5 : 1 }]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Text>
      </TouchableOpacity>

      {/* Display a loading indicator while uploading */}
      {uploading && <ActivityIndicator size="large" color="blue" />}

      <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
        <Text style={styles.uploadButtonText}>Pick an Image</Text>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
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
  },
  uploadButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UploadPost;
