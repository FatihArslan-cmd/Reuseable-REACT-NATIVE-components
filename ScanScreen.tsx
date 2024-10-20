import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Vibration,
  FlatList,
  Modal,
  Text,
  ActivityIndicator,
  Share,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';


const ScanScreen = () => {
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [scannedCodes, setScannedCodes] = useState([]); 
  const [showHistory, setShowHistory] = useState(false); 
  const [loading, setLoading] = useState(false); 

  const onSuccess = useCallback(e => {
    Vibration.vibrate(100); // 100ms titreme

    Alert.alert(
      "Scanned QR Code",
      e.data,
      [
        { text: "Share", onPress: () => shareScannedCode(e.data) },
        { text: "OK", onPress: () => console.log('OK Pressed') }
      ]
    );

    setScannedCodes(prevCodes => [...prevCodes, e.data]); 
  }, []);

  const shareScannedCode = async (data) => {
    try {
      await Share.share({
        message: `Scanned QR Code: ${data}`,
      });
    } catch (error) {
      alert('Error sharing code');
    }
  };

  const toggleFlash = () => {
    setFlashMode(prevFlashMode =>
      prevFlashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.torch
        : RNCamera.Constants.FlashMode.off
    );
  };

  const toggleCamera = () => {
    setCameraType(prevCameraType =>
      prevCameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  const goBack = () => {
    console.log('Back button pressed');
  };

  const toggleHistoryModal = () => {
    setShowHistory(!showHistory);
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={flashMode}
        cameraType={cameraType}
        topContent={null}
        bottomContent={null}
        cameraStyle={styles.camera}
        reactivate={true} // Tarama sonrasında kamera tekrar aktif olur
        reactivateTimeout={2000} // 2 saniye sonra yeniden taramaya başlar
        onCameraReady={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Image
        source={require('./assets/scanning.png')}
        style={styles.centerImage}
      />

      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <Icon
          name={flashMode === RNCamera.Constants.FlashMode.off ? 'flash-off' : 'flash'}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.cameraButton} onPress={toggleCamera}>
        <Icon name="camera-reverse" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.historyButton} onPress={toggleHistoryModal}>
        <Icon name="time" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showHistory} animationType="slide" transparent={true}>
        <View style={styles.historyModal}>
          <Text style={styles.historyTitle}>Scanned QR Code History</Text>
          <FlatList
            data={scannedCodes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.historyItem}>{item}</Text>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={toggleHistoryModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    width: '100%',
    height: '100%',
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
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
  },
  historyButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
  },
  historyModal: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  historyItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
});

export default ScanScreen;
