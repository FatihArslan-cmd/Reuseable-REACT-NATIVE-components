import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const FACE_API_KEY = '';
const FACE_API_SECRET = '';

const ScanScreen = () => {
  const [referenceImage, setReferenceImage] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const camera = useRef(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission === 'denied') {
        Alert.alert('Camera Permission', 'Please allow camera access from settings');
      }
    };
    requestCameraPermission();
  }, []);

  const device = useCameraDevice(isFrontCamera ? 'front' : 'back');

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const selectReferenceImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets) {
      const resizedImage = await ImageResizer.createResizedImage(result.assets[0].uri, 800, 800, 'JPEG', 80);
      setReferenceImage(resizedImage.uri);
      setCapturedPhoto(true);
    }
  };

  const takePhoto = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off'
        });
        const capturedUri = `file://${photo.path}`;
        setCapturedPhoto(capturedUri);
        compareFaces(capturedUri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo. Please try again.');
        console.error('Failed to take photo:', error);
      }
    }
  };

  const compareFaces = async (capturedUri) => {
    if (!referenceImage) return;

    setLoading(true);
    const data = new FormData();
    data.append('api_key', FACE_API_KEY);
    data.append('api_secret', FACE_API_SECRET);
    data.append('image_file1', { uri: referenceImage, type: 'image/jpeg', name: 'reference.jpg' });
    data.append('image_file2', { uri: capturedUri, type: 'image/jpeg', name: 'captured.jpg' });

    try {
      const response = await axios.post(
        'https://api-us.faceplusplus.com/facepp/v3/compare',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSimilarityScore(response.data.confidence);
    } catch (error) {
      Alert.alert('Error', 'Face comparison failed. Please try again.');
      console.error('Face comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!referenceImage && (
        <Button title="Upload Reference Photo" onPress={selectReferenceImage} />
      )}

      {referenceImage && !capturedPhoto && (
        <Button title="Open Camera" onPress={() => setCapturedPhoto(true)} />
      )}

      {referenceImage && capturedPhoto && !similarityScore && device && (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            ref={camera}
            photo={true}
          />
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={takePhoto}
          >
            <Text style={styles.captureText}>Capture Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toggleButton} 
            onPress={toggleCamera}
          >
            <Text style={styles.toggleText}>Switch Camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <LottieView 
            source={require('./Animation - 1730390819293.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.loadingText}>Analyzing Photo...</Text>
        </View>
      )}

      {similarityScore !== null && (
        <View style={styles.resultContainer}>
          <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Text style={styles.imageLabel}>Reference Image</Text>
              <Image source={{ uri: referenceImage }} style={styles.image} />
            </View>
            <View style={styles.imageWrapper}>
              <Text style={styles.imageLabel}>Captured Photo</Text>
              <Image source={{ uri: capturedPhoto }} style={styles.image} />
            </View>
          </View>
          <Text style={[
            styles.resultText, 
            { color: similarityScore > 80 ? 'green' : 'red' }
          ]}>
            {similarityScore > 80 ? 'Authentication Successful' : 'Not You'} - {similarityScore.toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3e5ab', // Warmer background color
  },
  cameraContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    backgroundColor: '#ff8c42', // Friendly orange color
    padding: 15,
    borderRadius: 15,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: width * 0.8,
  },
  captureText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  toggleButton: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    backgroundColor: '#ff6f61', // Distinct orange for toggle button
    padding: 10,
    borderRadius: 15,
    width: width * 0.6,
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  },
  loadingText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 20,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export default ScanScreen;
