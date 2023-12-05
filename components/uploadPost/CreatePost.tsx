// PostUpload.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FIREBASE_APP, FIRESTORE_DB } from '../../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage(FIREBASE_APP)

const PostUpload = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const handleUpload = async () => {
    try {
      if (!title || !image || !description) {
        console.error('Please fill in all fields');
        return;
      }

      //convert image to blob(lol)
      const response = await fetch(image);
      const blob = await response.blob();  
    
      //create unique file name
      const fileName = new Date().getTime().toString();

      //upload image to firebase storage
      const imageRef = storageRef(storage, `images/${fileName}`);
      await uploadBytes(imageRef, blob);

      //get image url
      const imageUrl = await getDownloadURL(imageRef);

      //Add new firebase document
      const userPostsCollectionRef = collection(FIRESTORE_DB, 'user-posts');
      const userPostsDocRef = await addDoc(userPostsCollectionRef, {
        title,
        image: imageUrl,
        description,
        timestamp: new Date().getTime(),
      });

      //reset data after upload
      setTitle('');
      setImage('');
      setDescription('');

      console.log('Post uploaded successfully!');
    } catch (error: any) {
      console.error(error);
      alert('Failed to upload post')
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload a Post</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={(text) => setImage(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
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

export default PostUpload;
