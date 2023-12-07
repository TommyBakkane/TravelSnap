import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FIRESTORE_DB } from '../config/firebase'; 
import { Post } from '../interface/Post';
import { collection, addDoc, getDocs, updateDoc, doc, arrayUnion, arrayRemove, getDoc, increment, onSnapshot } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FeedCard from './FeedCard';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsCollection = collection(FIRESTORE_DB, 'posts');
        const querySnapshot = await getDocs(postsCollection);

        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(fetchedPosts);
        console.log(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchData();
  }, []);
  
    const handleLike = (postId: string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    };

    const handleDislike = (postId: string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
        )
      );
    };

    const handleComment = (postId: string, comment: string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
        ));
    };

    const handleCommentPost = (postId: string, comment: string) => {
      if (comment.trim() !== '') {
          handleComment(postId, comment);
      }
  };


  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FeedCard
          post={item}
          onLike={handleLike}
          onDislike={handleDislike}
          onComment={handleComment}
        />
      )}
    />
  );
};




export default Feed;
