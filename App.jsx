import React, { useEffect, useState } from 'react';
import { View, Button, Image, StyleSheet, Text, Alert, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const App = () => {
  const [imageUri, setImageUri] = useState(null);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('You cancelled image picker.');
      } else if (response.errorCode) {
        Alert.alert(`ImagePicker Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs access to your camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        Alert.alert("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  
  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to your storage to save photos",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the storage");
      } else {
        Alert.alert("Storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  
  // Call these functions in your component or useEffect to request permissions
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
      requestStoragePermission();
    }
  }, []);

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        Alert.alert('You cancelled camera.');
      } else if (response.errorCode) {
        Alert.alert(`Camera Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Image from Gallery" onPress={selectImage} />
      <Button title="Take Photo with Camera" onPress={openCamera} />
      {imageUri && (
        <>
          <Text style={styles.text}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default App;
