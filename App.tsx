import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// import ReactNativeBiometrics from 'react-native-biometrics';
import {View, Text} from 'react-native';
import BottomTabNavigator from './src/components/bottom_tab_navigation/BottomTabsNavigator';

const Stack = createStackNavigator();

const App: React.FC = () => {
  // const [authenticated, setAuthenticated] = useState(false);

  // useEffect(() => {
  //   const rnBiometrics = new ReactNativeBiometrics();

  //   rnBiometrics
  //     .simplePrompt({promptMessage: 'Confirm fingerprint'})
  //     .then(resultObject => {
  //       const {success} = resultObject;

  //       if (success) {
  //         setAuthenticated(true);
  //       } else {
  //         console.log('User cancelled biometric prompt');
  //       }
  //     })
  //     .catch(() => {
  //       console.log('Biometrics failed');
  //     });
  // }, []);

  // if (!authenticated) {
  //   return (
  //     <View>
  //       <Text>Authenticating...</Text>
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
