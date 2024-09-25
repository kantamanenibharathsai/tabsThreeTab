import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  Dimensions,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-camera-roll/camera-roll';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';


const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const DownloadTab = () => {
  const [url, setUrl] = useState(
    'https://img.lovepik.com/photo/48013/0603.jpg_wh860.jpg',
  );
    const [dimensions, setDimensions] = useState({
      window: windowDimensions,
      screen: screenDimensions,
    });


      useEffect(() => {
        const subscription = Dimensions.addEventListener(
          'change',
          ({window, screen}) => {
            setDimensions({window, screen});
          },
        );
        return () => subscription?.remove();
      });

      console.log(dimensions);

  // const checkPermissions = async () => {
  //   if (Platform.OS === 'ios') {
  //     const status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
  //     if (status === RESULTS.GRANTED) {
  //       return true;
  //     } else {
  //       const requestStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
  //       return requestStatus === RESULTS.GRANTED;
  //     }
  //   } else {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   }
  // };

  // const downloadFile = async () => {
  //   const hasPermission = true;
  //   if (!hasPermission) {
  //     Alert.alert(
  //       'Permission required',
  //       'Please grant storage permissions to download the file.',
  //     );
  //     return;
  //   }

  //   const {dirs} = RNFetchBlob.fs;
  //   const dirToSave =
  //     Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
  //   const fileName = `DownloadedFile${new Date().getTime()}.jpg`; // You can dynamically set file extension based on content type
  //   const filePath = `${dirToSave}/${fileName}`;

  //   const config = {
  //     fileCache: true,
  //     appendExt: 'jpg', // Set based on your content type (e.g., jpg, mp4, png)
  //     path: filePath,
  //     notification: true,
  //     useDownloadManager: true,
  //     title: fileName,
  //     mediaScannable: true,
  //   };

  //   RNFetchBlob.config(config)
  //     .fetch('GET', url)
  //     .then(res => {
  //       if (Platform.OS === 'ios') {
  //         CameraRoll.save(filePath, {type: 'photo'})
  //           .then(() => {
  //             Alert.alert('Success', 'File saved to camera roll');
  //           })
  //           .catch(err => {
  //             console.log('Save to camera roll error:', err);
  //           });
  //       } else {
  //         Alert.alert('Success', 'File downloaded successfully');
  //       }
  //     })
  //     .catch(err => {
  //       console.log('File download error:', err);
  //     });
  // };

  const actualDownload = () => {
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: `Invoice.png`,
        path: `${dirs.DownloadDir}/Invoice.png`,
      },
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'Invoice.png',
      path: `${dirToSave}/Invoice.p`,
    };
    const configOptions = Platform.select({
      ios: configfb,
      android: configfb,
    });

    RNFetchBlob.config(configOptions || {})
      .fetch('GET', url, {})
      .then(res => {
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        if (Platform.OS === 'android') {
          console.log('file downloaded');
        }
      })
      .catch(e => {
        console.log('invoice Download==>', e);
      });
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 10}}>
        Enter URL to Download:
      </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        placeholder="Enter video or image URL"
        value={url}
        onChangeText={setUrl}
      />
      <TouchableOpacity
        onPress={actualDownload}
        style={{
          backgroundColor: '#4CAF50',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white', fontSize: 16}}>Download</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DownloadTab;
