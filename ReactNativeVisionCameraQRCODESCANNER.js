import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  getCameraDevice,
} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const App = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [flashMode, setFlashMode] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [zoomLevel, setZoomLevel] = useState(1); // Initialize zoom level to 1 (no zoom)
  const device = useCameraDevice(cameraPosition); // Use cameraPosition to dynamically select device

  useFocusEffect(
    useCallback(() => {
      const getPermissions = async () => {
        const cameraPermission = await Camera.requestCameraPermission();
        setHasPermission(cameraPermission === 'authorized');
      };
      getPermissions();
    }, [])
  );
  

  const codeScanner = useCodeScanner({
    codeTypes: ['code-128'],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        setIsScanning(false);
        Alert.alert('Scanned Code', `${code.value}`, [
          {
            text: 'OK',
            onPress: () => setIsScanning(true), // Resume scanning after alert
          },
        ]);
      }
    },
  });

  const toggleFlash = () => {
    setFlashMode((prev) => !prev);
  };

  const toggleCamera = () =>
    setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));

  const zoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel((prevZoom) => prevZoom + 0.1); // Daha hassas zoom
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel((prevZoom) => prevZoom - 0.1);
    }
  };

  if (!device) {
    return <></>;
  }
  return (
    <SafeAreaView style={styles.container}>
        <Camera
        style={StyleSheet.absoluteFill}
        device={device} // Use the fetched camera device
        isActive={true}
        frameProcessorFps={2}
        torch={flashMode ? 'on' : 'off'} // Use torch instead of flash
        zoom={zoomLevel} // Use the updated zoomLevel
        codeScanner={isScanning ? codeScanner : undefined}
      />
      <Image source={require('./scanning.png')} style={styles.centerImage} />

      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => Alert.alert('Go Back')}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Flashlight Toggle */}
      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <Ionicons name={flashMode ? 'flash' : 'flash-off'} size={30} color="#fff" />
      </TouchableOpacity>

      {/* Camera Switch */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleCamera}>
        <Ionicons name="camera-reverse" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Zoom In */}
      <TouchableOpacity style={styles.zoomInButton} onPress={zoomIn}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Zoom Out */}
      <TouchableOpacity style={styles.zoomOutButton} onPress={zoomOut}>
        <Ionicons name="remove" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -100,
    marginTop: -100,
    opacity: 0.6,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
  },
  zoomInButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
  },
  zoomOutButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
  },
});

export default App;
