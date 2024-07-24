import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      console.log('Location in background:', location);

      // Send location data via WebSocket
      sendLocationToWebSocket(location);
    }
  }
});

let websocket;

export const initializeWebSocket = () => {
  websocket = new WebSocket('ws://10.0.0.241:8080');
  websocket.onopen = () => {
    console.log('WebSocket connected');
  };
  websocket.onmessage = (message) => {
    console.log('Message from server:', message.data);
  };
  websocket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  websocket.onclose = () => {
    console.log('WebSocket disconnected');
  };
};

export const sendLocationToWebSocket = (location) => {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    const data = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date().toISOString(),
    };
    websocket.send(JSON.stringify(data));
  }
};