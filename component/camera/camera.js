import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import ImagePicker from 'react-native-image-picker';



const Camera = (props) => {

    const [path, setPath] = useState('C');
    const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    function updateAvatar() {

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const data = new FormData();
                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                data.append('file', { type: 'image/jpg', uri: response.uri, name: "file" });
                console.log(response);
                setPath(response.uri);
            }
        })
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: path }} style={{ width: 100, height: 100 }}>
            </Image>
            <TouchableOpacity style={{ backgroundColor: 'orange' }} onPress={updateAvatar}>
                <Image source={{ uri: 'https://i.pinimg.com/originals/fb/45/06/fb45063579e1fc6873bffbd8192889cf.png' }} style={{ width: 100, height: 100 }}>
                </Image>
            </TouchableOpacity>


        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange'
    }
})

export default Camera;