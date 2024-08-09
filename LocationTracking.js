import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import axios from 'axios';

const LOCATION_TASK_NAME = 'background-location-task';

let locationCallback = null;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("TaskManager error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    if (locationCallback) {
      locationCallback(coords);
    }
    try {
      await axios.post('http://your-raspberry-pi-ip:5000/location', coords);
    } catch (err) {
      console.error("Error sending location to server:", err);
    }
  }
});

export const startLocationUpdates = async (callback) => {
  locationCallback = callback;
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

  } else {
    console.error('Location permission not granted');
  }
};
