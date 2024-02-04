import React, { useState, useEffect } from "react";
import {
    View,
    Button,
    Image,
    StyleSheet,
} from "react-native";
import ImagePicker from 'react-native-image-picker'

const AddPicture = (image, onImagePicked) => {

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (image) {
            console.log("useEffect" + image)
            setSelectedImage({ uri: image });
        }
    }, [image])

    const pickImageHandler = () => {
        ImagePicker.showImagePicker({ title: 'Pick an Image', maxWidth: 800, maxHeight: 600 },
            response => {
                if (response.error) {
                    console.log("Image picker error: ", response.error);
                } else if (!response.didCancel) {
                    console.log("Image URI: ", response.uri);
                    setSelectedImage({ uri: response.uri });
                    onImagePicked({ uri: response.uri });
                }
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={selectedImage} style={styles.previewImage}>

                </Image>
            </View>
            <View style={styles.button}>
                <Button title="Pick Image" onPress={this.pickImageHandler} >

                </Button>
            </View>
        </View>
    );
};



// Styles for the addPicture
const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: "center",
    },
    imageContainer: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#eee',
        width: '80%',
        height: 150
    },
    button: {
        color: 'green',
        margin: 10,
        borderRadius: 10,
    },
    previewImage: {
        width: '100%',
        height: '100%'
    },
});

export default AddPicture;
