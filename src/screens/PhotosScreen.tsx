// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Modal,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';

// interface PhotoNode {
//   node: {
//     image: {
//       uri: string;
//     };
//   };
// }

// const PhotosScreen: React.FC = () => {
//   const [photos, setPhotos] = useState<PhotoNode[]>([]);
//   const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     loadPhotos();
//   }, []);

//   const loadPhotos = async () => {
//     if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
//       return;
//     }

//     const photosResult = await CameraRoll.getPhotos({
//       first: 20,
//       assetType: 'Photos',
//     });
//     setPhotos(photosResult.edges);
//   };

//   const hasAndroidPermission = async (): Promise<boolean> => {
//     const getCheckPermissionPromise = (): Promise<boolean> => {
//       if (Number(Platform.Version) >= 33) {
//         return Promise.all([
//           PermissionsAndroid.check(
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//           ),
//           PermissionsAndroid.check(
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//           ),
//         ]).then(
//           ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
//             hasReadMediaImagesPermission && hasReadMediaVideoPermission,
//         );
//       } else {
//         return PermissionsAndroid.check(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         );
//       }
//     };

//     const hasPermission = await getCheckPermissionPromise();
//     if (hasPermission) {
//       return true;
//     }
//     const getRequestPermissionPromise = (): Promise<boolean> => {
//       if (Number(Platform.Version) >= 33) {
//         return PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//         ]).then(
//           statuses =>
//             statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
//               PermissionsAndroid.RESULTS.GRANTED &&
//             statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
//               PermissionsAndroid.RESULTS.GRANTED,
//         );
//       } else {
//         return PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
//       }
//     };

//     return await getRequestPermissionPromise();
//   };

//   const handleMediaPress = (uri: string) => {
//     setSelectedMedia(uri);
//     setModalVisible(true);
//   };

//   return (
//     <View style={{flex: 1}}>
//       <FlatList
//         data={photos}
//         keyExtractor={item => item.node.image.uri}
//         renderItem={({item}) => (
//           <TouchableOpacity
//             // Added key prop directly to TouchableOpacity
//             key={item.node.image.uri}
//             onPress={() => handleMediaPress(item.node.image.uri)}>
//             <Image
//               source={{uri: item.node.image.uri}}
//               style={{width: 100, height: 100}}
//             />
//           </TouchableOpacity>
//         )}
//       />
//       <Modal
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}>
//         <View style={{flex: 1}}>
//           {selectedMedia && (
//             <Image
//               source={{uri: selectedMedia}}
//               style={{width: '100%', height: '100%'}}
//             />
//           )}
//           <Button title="Close" onPress={() => setModalVisible(false)} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default PhotosScreen;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Platform,
//   StyleSheet,
// } from 'react-native';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import Modal from 'react-native-modal';

// interface PhotoNode {
//   node: {
//     image: {
//       uri: string;
//     };
//   };
// }

// const PhotosScreen: React.FC = () => {
//   const [photos, setPhotos] = useState<PhotoNode[]>([]);
//   const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     requestPermissionsAndLoadPhotos();
//   }, []);

//   const requestPermissionsAndLoadPhotos = async () => {
//     const hasPermission = await requestPermissions();
//     if (hasPermission) {
//       loadPhotos();
//     }
//   };

//   const requestPermissions = async (): Promise<boolean> => {
//     let permission;
//     if (Platform.OS === 'ios') {
//       permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
//     } else if (Platform.OS === 'android') {
//       permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
//     }
//     if (permission) {
//       const result = await request(permission);
//       return result === RESULTS.GRANTED;
//     }
//     return false;
//   };

//   const loadPhotos = async () => {
//     const photosResult = await CameraRoll.getPhotos({
//       first: 20,
//       assetType: 'Photos',
//     });
//     setPhotos(photosResult.edges);
//   };

//   const handleMediaPress = (uri: string) => {
//     setSelectedMedia(uri);
//     setModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={photos}
//         keyExtractor={item => item.node.image.uri}
//         renderItem={({item}) => (
//           <TouchableOpacity
//             style={styles.imageContainer}
//             onPress={() => handleMediaPress(item.node.image.uri)}>
//             <Image source={{uri: item.node.image.uri}} style={styles.image} />
//           </TouchableOpacity>
//         )}
//         numColumns={3}
//         key={3} // Change this key if numColumns changes
//         contentContainerStyle={styles.flatListContent}
//       />
//       <Modal
//         isVisible={modalVisible}
//         onBackdropPress={() => setModalVisible(false)}
//         style={styles.modal}
//         animationIn="slideInUp"
//         animationOut="slideOutDown"
//         animationInTiming={600}
//         animationOutTiming={600}>
//         <View style={styles.modalContent}>
//           {selectedMedia && (
//             <Image source={{uri: selectedMedia}} style={styles.modalImage} />
//           )}
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setModalVisible(false)}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//   },
//   flatListContent: {
//     padding: 10,
//   },
//   imageContainer: {
//     flex: 1,
//     margin: 5,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: 120,
//     borderRadius: 10,
//   },
//   modal: {
//     justifyContent: 'center',
//     margin: 0,
//   },
//   modalContent: {
//     height: '60%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalImage: {
//     width: '100%',
//     height: '80%',
//     borderRadius: 10,
//   },
//   closeButton: {
//     width: '100%',
//     marginTop: 10,
//     paddingVertical: 10,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'black',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default PhotosScreen;



import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

interface PhotoNode {
  node: {
    image: {
      uri: string;
    };
  };
}

interface PhotosScreenProps {
  photos: PhotoNode[];
  onMediaPress: (uri: string) => void;
}

const PhotosScreen: React.FC<PhotosScreenProps> = ({photos, onMediaPress}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={item => item.node.image.uri}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => onMediaPress(item.node.image.uri)}>
            <Image source={{uri: item.node.image.uri}} style={styles.image} />
          </TouchableOpacity>
        )}
        numColumns={3}
        key={3} // Change this key if numColumns changes
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  flatListContent: {
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
});

export default PhotosScreen;