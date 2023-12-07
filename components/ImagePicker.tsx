import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, Image, Button } from 'react-native';
import * as ImagePickerModule from 'expo-image-picker';



const ImagePicker = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
          const { status } = await ImagePickerModule.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            console.log('Sorry, we need media library permissions to make this work.');
          }
        })();
      }, []);

      const pickImage = async () => {
        const result = await ImagePickerModule.launchImageLibraryAsync({
          mediaTypes: ImagePickerModule.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri);
        }
      };


    return (
        <View>
            {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />}
            <Button title="Pick an image" onPress={pickImage} />
        </View>
    );
};

export default ImagePicker;