import React, { useEffect, useState } from "react";
import { FIRESTORE_DB } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ScrollView, View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";

interface Post {
  id: string;
  title: string;
  image: string;
  timestamp: string;
  description: string;
}

const ProfileGrid = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(FIRESTORE_DB, "user-posts");
        const postsSnapshot = await getDocs(postsCollection);
        const postsData = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
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