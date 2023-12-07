import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import FeedCardProps from "../interface/FeedCardProps";

  const FeedCard: React.FC<FeedCardProps> = ({ post, onLike, onDislike, onComment }) => {
    const [commentText, setCommentText] = useState("");
  
    return (
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <Image source={{ uri: post.image }} style={styles.postImage} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{post.caption}</Text>
            <View style={styles.locationContainer}>
                <Icon name="map-marker-alt" size={12} color="#000" />
                <Text style={styles.location}>Oslo, Norway</Text>
            </View>
          </View>
          <View style={styles.interactionsContainer}>
            <TouchableOpacity onPress={() => onLike(post.id)}>
              <Icon name="thumbs-up" size={20} color="#2AC12A" style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.count}>{post.likes}</Text>
            <TouchableOpacity onPress={() => onDislike(post.id)}>
              <Icon name="thumbs-down" size={20} color="#D32814" style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.count}>{post.dislikes}</Text>
          </View>
          <TextInput
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
            onSubmitEditing={() => onComment(post.id, commentText)}
            style={styles.commentInput}
          />
          {post.comments.map((comment, index) => (
            <Text key={index} style={styles.comment}>
              {comment}
            </Text>
          ))}
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 8,
      margin: 0,
    },
    profileCard: {
      backgroundColor: "#FAF9F6",
      borderRadius: 10,
      overflow: 'hidden',
      padding: 8,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    postImage: {
      width: '100%',
      aspectRatio: 2,
      borderRadius: 10,
    },
    title: {
      fontFamily: "titleMedium",
      fontSize: 24,
      fontWeight: "bold",
      letterSpacing: 0.15,
      lineHeight: 28,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 4,
      marginTop: 4,
    },
    location: {
      fontSize: 12,
      marginLeft: 4,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    interactionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 4,
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
  
  export default FeedCard;