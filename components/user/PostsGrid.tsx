import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView } from 'react-native';

const GridPictures = () => {
  // Sample data for the grid (replace with your actual picture URLs)
  const data = [
    { id: '1', uri: 'https://placekitten.com/200/200' },
    { id: '2', uri: 'https://placekitten.com/201/200' },
    { id: '3', uri: 'https://placekitten.com/202/200' },
    { id: '4', uri: 'https://placekitten.com/203/200' },
    { id: '5', uri: 'https://placekitten.com/204/200' },
    { id: '6', uri: 'https://placekitten.com/205/200' },
    { id: '7', uri: 'https://placekitten.com/206/200' },
    { id: '8', uri: 'https://placekitten.com/207/200' },
    { id: '9', uri: 'https://placekitten.com/208/200' },
    { id: '10', uri: 'https://placekitten.com/209/200' },
    { id: '11', uri: 'https://placekitten.com/210/200' },
    { id: '12', uri: 'https://placekitten.com/211/200' },
    { id: '13', uri: 'https://placekitten.com/212/200' },
    { id: '14', uri: 'https://placekitten.com/213/200' },
    { id: '15', uri: 'https://placekitten.com/214/200' },
    // Add more items as needed
  ];

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.gridContainer}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.gridItem} />
          )}
        />
      </View>
    </ScrollView>
  );
};

const PostsGrid = () => {
  return (
    <View style={styles.container}>
      <GridPictures />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
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
  gridContainer: {
    marginTop: 16,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1, 
    margin: 4,
    borderRadius: 8,
  },
  scrollContainer: {
    flex: 1,
  },
});

export default PostsGrid;
