import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FIRESTORE_DB } from '../config/firebase'; 
import { Post } from '../interface/Post';
import { collection, addDoc, getDocs, updateDoc, doc, arrayUnion, arrayRemove, getDoc, increment } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is logged in:', user.uid, user.displayName);
    } else {
      console.log('User is logged out');
    }
  });

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

  const getCurrentUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
  };



  const handleLike = async (id: string) => {
    try {
      const postRef = doc(FIRESTORE_DB, 'posts', id);
  
      const currentUserId = getCurrentUserId();
  
      const postSnapshot = await getDoc(postRef);
      const likedBy = postSnapshot.data()?.likedBy || [];
  
      if (likedBy.includes(currentUserId)) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUserId),
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUserId),
        });
      }
  
      const updatedPostSnapshot = await getDoc(postRef);
      const updatedPost = { id: updatedPostSnapshot.id, ...updatedPostSnapshot.data() } as Post;
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleDislike = async (id: string) => {
    try {
      const post = doc(FIRESTORE_DB, 'posts', id);
  
      const currentUserId = getCurrentUserId();
  
      const postSnapshot = await getDoc(post);
      const dislikedBy = postSnapshot.data()?.dislikedBy || [];
  
      if (dislikedBy.includes(currentUserId)) {
        await updateDoc(post, {
          dislikes: increment(-1),
          dislikedBy: arrayRemove(currentUserId),
        });
      } else {
        await updateDoc(post, {
          dislikes: increment(1),
          dislikedBy: arrayUnion(currentUserId),
        });
      }
  
      const updatedPostSnapshot = await getDoc(post);
      const updatedPost = { id: updatedPostSnapshot.id, ...updatedPostSnapshot.data() } as Post;
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = async (id: string, comment: string) => {
    try {
      const postRef = doc(FIRESTORE_DB, 'posts', id);
  
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });
  
      setPosts((post) =>
        post.map((post) =>
          post.id === id ? { ...post, comments: [...(post.comments || []), comment] } : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  


  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.caption}>{item.caption}</Text>

            <View style={styles.interactionsContainer}>

              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <Icon name="thumbs-up" size={25} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.count}>{item.likes}</Text>
              <TouchableOpacity onPress={() => handleDislike(item.id)}>
                <Icon name="thumbs-down" size={25} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.count}>{item.dislikes}</Text>
            </View>



            <FlatList
              data={item.comments}
              keyExtractor={(comment, index) => index.toString()}
              renderItem={({ item: comment }) => (
                <Text style={styles.comment}>{comment}</Text>
              )}
            />

            <TextInput
              placeholder="Add a comment..."
              onSubmitEditing={({ nativeEvent }) =>
                handleComment(item.id, nativeEvent.text)
              }
              style={styles.commentInput}
            />
        </View>
      )}
    />
  );
};



const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    image: {
      width: '100%',
      aspectRatio: 1,
    },
    caption: {
      fontSize: 24,
      paddingHorizontal: 16,
      fontStyle: 'italic',
    },
    interactionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginVertical: 8,
    },
    count: {
      fontSize: 16,
      marginHorizontal: 4,
    },
    commentInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontSize: 16,
      },
      comment: {
        fontSize: 16,
        marginLeft: 16,
      },
      icon: {
        fontSize: 16,
      },
    });

export default Feed;
