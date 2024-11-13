import React, { useState, useEffect } from 'react';
import { NativeEventEmitter, NativeModules, Modal, View, Text, Button, Alert } from 'react-native';

const NFCReader = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const { NFCReaderModule } = NativeModules;
        const nfcEventEmitter = new NativeEventEmitter(NFCReaderModule);
        let subscription;

        if (isModalVisible) {
            subscription = nfcEventEmitter.addListener('onNfcTagDetected', (data) => {
                console.log('NFC Tag Detected:', data);
                Alert.alert(`NFC Text`, data.text || 'No text found');
            });

            NFCReaderModule.startListening();
        }

        return () => {
            if (subscription) {
                subscription.remove();
            }
            NFCReaderModule.stopListening();
        };
    }, [isModalVisible]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Open NFC Reader" onPress={() => setModalVisible(true)} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, marginBottom: 15 }}>NFC Reader</Text>
                        <Text>Place your NFC tag near the device to read data.</Text>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default NFCReader;
