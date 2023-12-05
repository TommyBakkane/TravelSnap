import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

interface Post {
    id: string;
    imageUrl: string;
    caption: string;
    likes: number;
    dislikes: number;
    comments: string[];
    }

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([
        { id: '1', imageUrl: 'https://www.themealdb.com/images/media/meals/oe8rg51699014028.jpg', caption: 'Beautiful sunrise!', likes: 10, dislikes: 2, comments: ['Great pic!', 'Awesome!'] },
        { id: '2', imageUrl: 'https://www.themealdb.com/images/media/meals/hqaejl1695738653.jpg', caption: 'Exploring nature!', likes: 15, dislikes: 1, comments: ['Beautiful!', 'Love it!'] },

      ]);

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
          <View style={styles.container}>

            <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
    });

export default Feed;
