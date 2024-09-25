import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FileFolderScreen from '../../screens/FileFolderScreen';
import TopTabsNavigator from '../TopTabsNavigator';
import DownloadTab from '../../screens/DownloadScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Permissions"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 74,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginBottom: 1,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Permissions"
        component={TopTabsNavigator}
        options={{
          tabBarLabel: 'Permissions',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="view-gallery-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Folders"
        component={FileFolderScreen}
        options={{
          tabBarLabel: 'Folders',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="folder-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Download"
        component={DownloadTab}
        options={{
          tabBarLabel: 'Download',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="cloud-download-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
