import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { startLocationUpdates } from './LocationTask';

export default function App() {
  const [location, setLocation] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      console.log("Starting location updates...");
      try {
        await startLocationUpdates((newLocation) => {
          setLocation(newLocation);
          setLastUpdated(new Date().toLocaleString());
        });
        console.log("Location updates started successfully");
      } catch (error) {
        console.error("Error starting location updates:", error);
      }
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Location Tracking App</Text>
      {location ? (
        <View>
          <Text style={styles.text}>Latitude: {location.latitude}</Text>
          <Text style={styles.text}>Longitude: {location.longitude}</Text>
          <Text style={styles.text}>Last Updated: {lastUpdated}</Text>
        </View>
      ) : (
        <Text style={styles.text}>Waiting for location...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  text: {
    fontSize: 18,
    margin: 10,
  },
});
