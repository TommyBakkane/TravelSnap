import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const TravelSnapUserProfile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: 'https://placekitten.com/200/200' }} 
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>john_doe123</Text>
        </View>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>123</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1,234</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>567</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      <Text style={styles.biography}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel
        consectetur mauris. Integer commodo facilisis felis, non aliquam turpis
        euismod in.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      padding: 20,
    },
    profilePicture: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginLeft: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    statLabel: {
      color: '#666',
    },
    biography: {
      marginTop: 16,
      fontSize: 16,
      lineHeight: 22,
    },
  });

export default TravelSnapUserProfile;
