// import React from 'react';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// import VideosScreen from '../screens/VideosScreen';
// import PhotosScreen from '../screens/PhotosScreen';

// const Tab = createMaterialTopTabNavigator();

// const TopTabsNavigator: React.FC = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName="Photos"
//       screenOptions={{
//         tabBarActiveTintColor: '#e91e63',
//         tabBarStyle: {
//           backgroundColor: '#ffffff',
//         },
//         tabBarIndicatorStyle: {
//           backgroundColor: '#e91e63',
//         },
//       }}>
//       <Tab.Screen
//         name="Photos"
//         component={PhotosScreen}
//         options={{tabBarLabel: 'Photos'}}
//       />
//       <Tab.Screen
//         name="Videos"
//         component={VideosScreen}
//         options={{tabBarLabel: 'Videos'}}
//       />
//     </Tab.Navigator>
//   );
// };

// export default TopTabsNavigator;
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import VideosScreen from '../screens/VideosScreen';
import PhotosScreen from '../screens/PhotosScreen';
import MediaModal from './MediaModal';

const Tab = createMaterialTopTabNavigator();

interface MediaNode {
  node: {
    image: {
      extension: string | null;
      uri: string;
    };
    type: 'image' | 'video';
  };
}

const TopTabsNavigator: React.FC = () => {
  const [photos, setPhotos] = useState<MediaNode[]>([]);
  const [videos, setVideos] = useState<MediaNode[]>([]);
  const [selectedMediaType, setSelectedMediaType] = useState<
    'image' | 'video' | null
  >(null);
  const [selectedMediaUri, setSelectedMediaUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    }
    if (permission) {
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    }
    return false;
  };

  const requestPermissionsAndLoadMedia = async () => {
    const hasPermission = await requestPermissions();
    if (hasPermission) {
      loadPhotos();
      loadVideos();
    }
  };

  useEffect(() => {
    requestPermissionsAndLoadMedia();
  }, []);

  const loadPhotos = async () => {
    const photosResult = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    });
    setPhotos(photosResult.edges as MediaNode[]);
  };

  const loadVideos = async () => {
    const videosResult = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'Videos',
    });
    setVideos(videosResult.edges as MediaNode[]);
  };

  const handleMediaPress = (mediaType: 'image' | 'video', uri: string) => {
    setSelectedMediaType(mediaType);
    setSelectedMediaUri(uri);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Photos"
        screenOptions={{
          tabBarActiveTintColor: '#e91e63',
          tabBarStyle: {
            backgroundColor: '#ffffff',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#e91e63',
          },
        }}>
        <Tab.Screen name="Photos" options={{tabBarLabel: 'Photos'}}>
          {() => (
            <PhotosScreen
              photos={photos}
              onMediaPress={uri => handleMediaPress('image', uri)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Videos" options={{tabBarLabel: 'Videos'}}>
          {() => (
            <VideosScreen
              videos={videos}
              onMediaPress={uri => handleMediaPress('video', uri)}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <MediaModal
        isVisible={modalVisible}
        mediaUri={selectedMediaUri}
        onClose={() => setModalVisible(false)}
        mediaType={selectedMediaType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TopTabsNavigator;