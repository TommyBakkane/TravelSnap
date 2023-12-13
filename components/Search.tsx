import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Image, Dimensions, StyleSheet, Pressable } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../interface/Interfaces';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [itemWidth, setItemWidth] = useState(0);
  const navigation = useNavigation();

 // this was used to help with the grid layout, but after making changes to the layout, I believe we can delete this. Will test when product is working agian.
  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const padding = 16;
    setItemWidth(screenWidth - padding * 2);
  }, []);

  //this is to ensure that the first letter of the search query is capitalized for formatting purposes
  const capitalizeFirstLetter = (text: string) => {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  //this is the function that will search the database for the search query and return the results
  const handleSearch = async () => {
    try {
      const postsCollectionRef = collection(FIRESTORE_DB, 'posts');
      const querySnapshot = await getDocs(
        query(postsCollectionRef, where('caption', '==', searchQuery))
      );

      const results: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({ id: doc.id, ...data } as Post);
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  //this is the function that will handle the image press and navigate to the details page
  const handleImagePress = (post: Post) => {
    navigation.navigate('Details', {
      post,
    });
  };

  //this is the function that will render the grid item. Also believe this can be removed due to changes in layout. Will test when product is working agian.
  const renderGridItem: React.FC<{ item: Post }> = ({ item }) => (
    <View style={{ ...styles.itemContainer, width: itemWidth }}>
      <Pressable onPress={() => handleImagePress(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(capitalizeFirstLetter(text))}
      />
      <Button title="Search" onPress={handleSearch} />

      {searchResults.length > 0 && (
        <FlatList
          style={styles.flatListContainer}
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <>{renderGridItem({ item })}</>}
        />
      )}
    </View>
  );
};

//styling for search page component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  flatListContainer: {
    flex: 1,
  },
  itemContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 8, 
  },
  itemImage: {
    width: '100%',
    height: 200, 
    borderRadius: 8,
  },
  itemCaption: {
    padding: 4,
    textAlign: 'center',
  },
});

export default Search;
