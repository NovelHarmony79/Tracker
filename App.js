import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { startLocationUpdates } from './LocationTask';

export default function App() {
  useEffect(() => {
    startLocationUpdates();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Location Tracking App</Text>
    </View>
  );
}
