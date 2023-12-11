import React, { useEffect, useState } from "react";
import { FIRESTORE_DB } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Post } from "../../interface/Interfaces";

const ProfileGrid = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = () => {
      try {
        const postsCollection = collection(FIRESTORE_DB, 'posts');
        const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
          setPosts(postsData);
        });
  
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    fetchPosts();
  }, []); 
  

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPostItem}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    padding: 4,
  },
  gridItem: {
    flex: 1,
    margin: 8,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 2,
    resizeMode: "cover",
  },
  title: {
    marginTop: 8,
    textAlign: "center",
  },
});

export default ProfileGrid;
