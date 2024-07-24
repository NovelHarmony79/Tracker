import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const WebSocketClient = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    // Replace with your Raspberry Pi's IP address
    const ws = new WebSocket('ws://192.168.1.10:8080');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setStatus('Connected');
      ws.send('Hello from client!');
    };

    ws.onmessage = (event) => {
      console.log(`Received: ${event.data}`);
      setMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('Error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setStatus('Disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <View>
      <Text>Status: {status}</Text>
      <Text>Message: {message}</Text>
    </View>
  );
};

export default WebSocketClient;
