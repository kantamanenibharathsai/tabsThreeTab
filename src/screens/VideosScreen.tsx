// import React, {useState, useEffect} from 'react';
// import {View, FlatList, TouchableOpacity, Modal, Button} from 'react-native';
// import {useCameraRoll} from '@react-native-camera-roll/camera-roll';
// import Video from 'react-native-video';

// const VideosScreen: React.FC = () => {
//   const [videos, setVideos] = useState<{node: {image: {uri: string}}}[]>([]);
//   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const [photos, getPhotos] = useCameraRoll();

//   useEffect(() => {
//     const fetchVideos = async () => {
//       await getPhotos({first: 20, assetType: 'Videos'});
//       setVideos(photos.edges);
//     };
//     fetchVideos();
//   }, [getPhotos, photos.edges]);

//   const handleVideoPress = (uri: string) => {
//     setSelectedVideo(uri);
//     setModalVisible(true);
//   };

//   return (
//     <View style={{flex: 1}}>
//       <FlatList
//         data={videos}
//         keyExtractor={item => item.node.image.uri}
//         renderItem={({item}) => (
//           <TouchableOpacity
//             onPress={() => handleVideoPress(item.node.image.uri)}>
//             <Video
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
//           {selectedVideo && (
//             <Video
//               source={{uri: selectedVideo}}
//               style={{width: '100%', height: '100%'}}
//               controls
//             />
//           )}
//           <Button title="Close" onPress={() => setModalVisible(false)} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default VideosScreen;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Platform,
//   StyleSheet,
// } from 'react-native';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
// import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import Modal from 'react-native-modal';
// import Video from 'react-native-video';

// interface VideoNode {
//   node: {
//     image: {
//       uri: string;
//     };
//   };
// }

// const VideosScreen: React.FC = () => {
//   const [videos, setVideos] = useState<VideoNode[]>([]);
//   const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     requestPermissionsAndLoadVideos();
//   }, []);

//   const requestPermissionsAndLoadVideos = async () => {
//     const hasPermission = await requestPermissions();
//     if (hasPermission) {
//       loadVideos();
//     }
//   };

//   const requestPermissions = async (): Promise<boolean> => {
//     let permission;
//     if (Platform.OS === 'ios') {
//       permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
//     } else if (Platform.OS === 'android') {
//       permission = PERMISSIONS.ANDROID.READ_MEDIA_VIDEO;
//     }
//     if (permission) {
//       const result = await request(permission);
//       return result === RESULTS.GRANTED;
//     }
//     return false;
//   };

//   const loadVideos = async () => {
//     const videosResult = await CameraRoll.getPhotos({
//       first: 20,
//       assetType: 'Videos',
//     });
//     setVideos(videosResult.edges);
//   };

//   const handleMediaPress = (uri: string) => {
//     setSelectedMedia(uri);
//     setModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={videos}
//         keyExtractor={item => item.node.image.uri}
//         renderItem={({item}) => (
//           <TouchableOpacity
//             style={styles.imageContainer}
//             onPress={() => handleMediaPress(item.node.image.uri)}>
//             <Text style={styles.videoText}>Video</Text>
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
//             <Video
//               source={{uri: selectedMedia}}
//               style={styles.modalVideo}
//               controls
//               resizeMode="contain"
//               paused={false}
//             />
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
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoText: {
//     color: 'black',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   modalVideo: {
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

// export default VideosScreen;


import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';

interface VideoNode {
  node: {
    image: {
      extension: string | null;
      uri: string;
    };
  };
}

interface VideosScreenProps {
  videos: VideoNode[];
  onMediaPress: (uri: string) => void;
}

const VideosScreen: React.FC<VideosScreenProps> = ({videos, onMediaPress}) => {
  const renderVideoItem = ({item}: {item: VideoNode}) => (
    <TouchableOpacity
      style={styles.videoContainer}
      onPress={() => onMediaPress(item.node.image.uri)}>
      <Video
        source={{uri: item.node.image.uri}}
        style={styles.video}
        controls
        resizeMode="contain"
        paused={true}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {videos.length > 0 ? (
        <FlatList
          data={videos}
          keyExtractor={item => item.node.image.uri}
          renderItem={renderVideoItem}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.noVideosContainer}>
          <Text style={styles.noVideosText}>No videos available</Text>
        </View>
      )}
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  videoContainer: {
    width: width - 20,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  separator: {
    height: 10,
  },
  noVideosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noVideosText: {
    fontSize: 18,
    color: '#888',
  },
});

export default VideosScreen;