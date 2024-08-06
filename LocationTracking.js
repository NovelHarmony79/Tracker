import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import axios from 'axios';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    try {
      await axios.post('http://your-raspberry-pi-ip:5000/location', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (err) {
      console.error(err);
    }
  }
});

export const startLocationUpdates = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10, // Update every 10 meters
    });
  } else {
    console.error('Location permission not granted');
  }
};
