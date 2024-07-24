// App.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { initializeWebSocket, sendLocationToWebSocket } from './LocationTask';

const LOCATION_TASK_NAME = 'background-location-task';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sharedLocations, setSharedLocations] = useState([]);

  useEffect(() => {
    initializeWebSocket();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        setErrorMsg('Permission to access background location was denied');
        return;
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1, // Minimum distance (in meters) to wait before receiving updates.
        deferredUpdatesInterval: 1000, // Minimum time interval (in milliseconds) to wait before receiving updates.
      });
    })();

    return () => {
      TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
    };
  }, []);

  const shareLocation = () => {
    if (location) {
      sendLocationToWebSocket(location);
    }
  };

  let locationText = 'Waiting..';
  if (errorMsg) {
    locationText = errorMsg;
  } else if (location) {
    locationText = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text>{locationText}</Text>
      <Button title="Share Location" onPress={shareLocation} />
      <Text>Shared Locations:</Text>
      {sharedLocations.map((loc, index) => (
        <Text key={index}>
          {loc.latitude}, {loc.longitude}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
