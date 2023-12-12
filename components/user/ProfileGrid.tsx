import React, { useEffect, useState } from "react";
import { collection, onSnapshot, QuerySnapshot, DocumentData, where, query } from "firebase/firestore";
import { FlatList, Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Post } from "../../interface/Interfaces";
import { FIRESTORE_DB } from "../../config/firebase";

interface ProfileGridProps {
  userId: string;
}

const ProfileGrid: React.FC<ProfileGridProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("userId:", userId); // Log userId
        if (!userId) {
          console.error("userId is undefined");
          return;
        }
    
        const postsCollection = collection(FIRESTORE_DB, "posts");
        const q = query(postsCollection, where("userId", "==", userId));
    
        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
          const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
          console.log("Fetched Posts:", postsData);
          setPosts(postsData);
        }, (error) => {
          console.error("Error fetching posts:", error);
        });
    
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error in fetchPosts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        onError={(error) => console.error("Error loading image:", error)}
      />
    </TouchableOpacity>
  );

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text>User ID is undefined</Text>
      </View>
    );
  }

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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
