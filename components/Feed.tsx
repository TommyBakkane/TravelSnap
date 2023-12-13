import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FIRESTORE_DB } from '../config/firebase';
import { Post, Comment } from '../interface/Interfaces';
import { collection, updateDoc, doc, arrayUnion, arrayRemove, getDoc, increment, onSnapshot } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentText, setCommentText] = useState('');
  const auth = getAuth();
  const navigation = useNavigation();

  //this code is used to get the posts from the database
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIRESTORE_DB, 'posts'), (snapshot) => {
      const posts: Post[] = [];

      snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as Post);
      });

      setPosts(posts);
    });

    return () => unsubscribe();
  }, []);

  // this code is used to get the current user's name
  const getCurrentUser = () => {
    const user = auth.currentUser;
    return user ? user.displayName : null;
  };


 //this function makes it so that when the user presses the like button, the like count goes up by on, and when they press it again, it goes down by one
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

  //this function makes it so that when the user presses the dislike button, the dislike count goes up by on, and when they press it again, it goes down by one
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

  //this function allows the user to add a comment to a post
  const handleComment = async (id: string, commentText: string) => {
    try {
      const postRef = doc(FIRESTORE_DB, 'posts', id);
  
      const currentUser = getCurrentUser();
  
      if (currentUser) {
        // Check if the commentText is not empty or only contains whitespace
        if (commentText.trim() === '') {
          console.log('Comment cannot be empty');
          return; // Exit the function if the comment is empty
        }
  
        const newComment: Comment = {
          commentId: Date.now() + '_' + Math.floor(Math.random() * 1000),
          comment: commentText,
          user: currentUser,
        };
  
        await updateDoc(postRef, {
          comments: arrayUnion(newComment),
        });
  
        setCommentText('');
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  //this function allows the user to delete their own comments
  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const postRef = doc(FIRESTORE_DB, 'posts', postId);
  
      const postSnapshot = await getDoc(postRef);
      const existingComments = postSnapshot.data()?.comments || [];
  
      const updatedComments = existingComments.filter((comment: { commentId: string; }) => comment.commentId !== commentId);
  
      await updateDoc(postRef, { comments: updatedComments });
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: updatedComments,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  //this function allows the user to navigate to the details page when they press on an image, this code gives an error, but it still works
  const handleImagePress = (post: Post) => {
    navigation.navigate('Details', {
      post,
    });
  };


  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <Pressable onPress={() => handleImagePress(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </Pressable>
            <Text style={styles.caption}>{item.caption}</Text>

            <View style={styles.interactionsContainer}>

              <Pressable onPress={() => handleLike(item.id)}>
                <Icon name="thumbs-up" size={25} color="#000" style={styles.icon} />
              </Pressable>
              <Text style={styles.count}>{item.likes}</Text>
              <Pressable onPress={() => handleDislike(item.id)}>
                <Icon name="thumbs-down" size={25} color="#000" style={styles.icon} />
              </Pressable>
              <Text style={styles.count}>{item.dislikes}</Text>
            </View>



            <FlatList
              data={item.comments}
              keyExtractor={(comment) => comment.comment}
              renderItem={({ item: comment }) => (
                <View style={styles.commentContainer}>
                  <Text style={styles.commentUser}>{comment.user}:</Text>
                  <Text style={styles.commentText}>{comment.comment}</Text>
                  {comment.user === getCurrentUser() && (
                    <Pressable onPress={() => handleDeleteComment(item.id, comment.commentId)}>
                      <Icon name="trash" size={20} color="red" style={styles.icon} />
                    </Pressable>
                  )}
                </View>
              )}
            />

            <TextInput
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={(text) => setCommentText(text)}
              onSubmitEditing={() => {
                handleComment(item.id, commentText);
                setCommentText(''); 
              }}
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
      icon: {
        fontSize: 16,
        marginEnd: 16,
      },
      commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 16,
      },
      commentUser: {
        fontWeight: 'bold',
        marginRight: 8,
      },
      commentText: {
        flex: 1,
      },
    });

export default Feed;
