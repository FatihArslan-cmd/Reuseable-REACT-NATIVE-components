import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import DeviceBrightness from '@adrianso/react-native-device-brightness';

const BrightnessModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [originalBrightness, setOriginalBrightness] = useState(0.4);

  useEffect(() => {
    // İlk açılışta mevcut parlaklık seviyesini al
    DeviceBrightness.getBrightnessLevel().then((brightness) => {
      setOriginalBrightness(brightness);
    });
  }, []);

  const openModal = () => {
    // Modal açıldığında parlaklığı %100 yap
    setModalVisible(true);
    DeviceBrightness.setBrightnessLevel(1.0);
  };

  const closeModal = () => {
    // Modal kapandığında parlaklığı eski haline döndür
    setModalVisible(false);
    DeviceBrightness.setBrightnessLevel(originalBrightness);
  };

  return (
    <View style={styles.container}>
      <Button title="Parlaklık Modunu Aç" onPress={openModal} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Parlaklık %100 Yapıldı!</Text>
            <Button title="Kapat" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default BrightnessModal;
