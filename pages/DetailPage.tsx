import React from 'react';
import { View, Text, Image, StyleSheet  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { Post } from '../interface/Interfaces';

const DetailPage: React.FC = () => {
    const route = useRoute();
    const { post } = route.params as { post: Post };

  return (
    <View style={styles.container}>
     
      <Text style={styles.caption}>{post.caption}</Text>
      <Image source={{ uri: post.image }} style={styles.image} />

      {/* this code doesnt work on web*/}
      <MapView
            style={styles.map}
            initialRegion={{
            latitude: post.location.latitude,
            longitude: post.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
        >
            <Marker
            coordinate={{
                latitude: post.location.latitude,
                longitude: post.location.longitude,
            }}
            />
        </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    caption: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    image: {
      width: '100%',
      aspectRatio: 1,
      marginBottom: 12,
    },
    map: {
      width: '100%',
      height: 200,
    },
  });



export default DetailPage;