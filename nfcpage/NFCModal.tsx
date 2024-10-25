// NFCModal.tsx
import React from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { BlurView } from '@react-native-community/blur';

// Define the types for the props
interface NFCModalProps {
  visible: boolean;
  onClose: () => void;
  isAnimationVisible: boolean;
  isErrorVisible: boolean;
  retryScan: () => void;
}

const NFCModal: React.FC<NFCModalProps> = ({ visible, onClose, isAnimationVisible, isErrorVisible, retryScan }) => (
  <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
    <BlurView style={styles.absoluteBlur} blurType="light" blurAmount={1} />
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {isAnimationVisible ? (
          <LottieView
            source={require('../assets/Animation - 1729848788603.json')}
            autoPlay
            loop={false}
            onAnimationFinish={onClose}
            style={styles.lottie}
          />
        ) : isErrorVisible ? (
          <>
            <LottieView
              source={require('../assets/Animation - 1729858911794.json')}
              autoPlay
              loop={false}
              onAnimationFinish={retryScan}
              style={styles.lottie}
            />
            <Text style={styles.errorText}>Your card does not match!</Text>
          </>
        ) : (
          <>
            <Text style={styles.modalText}>Please approach your NFC tag to your phone</Text>
            <LottieView
              source={require('../assets/Animation - 1729848760683.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </>
        )}
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  lottie: { width: 250, height: 250, marginTop: 10 },
  modalText: { fontSize: 18, textAlign: 'center', color: '#A4C639' },
  errorText: { fontSize: 18, textAlign: 'center', color: '#cc0000' },
  absoluteBlur: { ...StyleSheet.absoluteFillObject },
});

export default NFCModal;
