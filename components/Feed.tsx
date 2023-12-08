import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FIRESTORE_DB } from '../config/firebase'; 
import { Post, Comment } from '../interface/Interfaces';
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

  const getCurrentUser = () => {
    const user = auth.currentUser;
    return user ? user.displayName : null;
  };



  const handleLike = async (id: string) => {
    try {
      const postRef = doc(FIRESTORE_DB, 'posts', id);
  
      const currentUser = getCurrentUser();
  
      const postSnapshot = await getDoc(postRef);
      const likedBy = postSnapshot.data()?.likedBy || [];
  
      if (likedBy.includes(currentUser)) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUser),
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUser),
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
  
      const currentUser = getCurrentUser();
  
      const postSnapshot = await getDoc(post);
      const dislikedBy = postSnapshot.data()?.dislikedBy || [];
  
      if (dislikedBy.includes(currentUser)) {
        await updateDoc(post, {
          dislikes: increment(-1),
          dislikedBy: arrayRemove(currentUser),
        });
      } else {
        await updateDoc(post, {
          dislikes: increment(1),
          dislikedBy: arrayUnion(currentUser),
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

  const handleComment = async (id: string, commentText: string) => {
    try {
      const postRef = doc(FIRESTORE_DB, 'posts', id);
  
      const currentUser = getCurrentUser();
  
      if (currentUser) {
        const newComment: Comment = {
          comment: commentText,
          user: currentUser,
        };
  
        await updateDoc(postRef, {
          comments: arrayUnion(newComment),
        });
  
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id ? { ...post, comments: [...post.comments, newComment] } : post
          )
        );
      } else {
        console.log('User not authenticated');
      }
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
              keyExtractor={(comment) => comment.comment}
              renderItem={({ item: comment }) => (
                <View>
                  <Text>{comment.user}</Text>
                  <Text>{comment.comment}</Text>
                </View>
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
}



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
