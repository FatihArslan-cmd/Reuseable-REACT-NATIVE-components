import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NFCModal from './NFCModal';
import { useNFCManager } from './useNFCManager';

const NFCPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { isAnimationVisible, isErrorVisible, startNFCScan } = useNFCManager();

  const initiateNFCScan = async () => {
    try {
      await startNFCScan();
      setModalVisible(true);
    } catch (error) {
      Alert.alert('NFC Disabled', 'Please enable NFC to start the scan.', [{ text: 'OK' }]);
    }
  };

  const closeModal = () => setModalVisible(false);
  const retryScan = () => initiateNFCScan();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>made by Fatih Arslan</Text>
      </View>

      <TouchableOpacity onPress={initiateNFCScan} style={styles.nfcButton}>
        <Icon name="nfc" size={50} color="#fff" />
        <Text style={styles.buttonText}>Start NFC Scan</Text>
      </TouchableOpacity>

      <NFCModal
        visible={isModalVisible}
        onClose={closeModal}
        isAnimationVisible={isAnimationVisible}
        isErrorVisible={isErrorVisible}
        retryScan={retryScan}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa', // Light gray border for contrast
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    color: '#ff6f61', // Vibrant color for title text
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  nfcButton: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#00A3E0', // Lively blue for button
    borderRadius: 15,
    marginTop: 50,
    shadowColor: '#00A3E0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default NFCPage;
