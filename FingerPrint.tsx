import React, { useCallback, useEffect, useState } from 'react';
import { Button, Alert, StyleSheet, View, ActivityIndicator } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const FingerprintButton = ({ onAuthSuccess, onAuthError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFingerPrintAvailable, setIsFingerPrintAvailable] = useState(false);
  
  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    checkFingerprintAvailability();
  }, []);

  const checkFingerprintAvailability = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      setIsFingerPrintAvailable(available);
    } catch (error) {
      console.error('Error checking fingerprint sensor:', error);
      setIsFingerPrintAvailable(false);
    }
  };

  const handleFingerprintAuth = useCallback(async () => {
    if (!isFingerPrintAvailable) {
      Alert.alert(
        'Fingerprint Unavailable',
        'Fingerprint authentication is not available on your device.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with Fingerprint',
        cancelButtonText: 'Cancel',
      });

      if (success) {
        onAuthSuccess?.();
        Alert.alert('Success', 'Fingerprint authentication successful!');
      } else {
        onAuthError?.('User cancelled fingerprint authentication');
        Alert.alert('Failed', 'Fingerprint authentication failed.');
      }
    } catch (error) {
      console.error('Fingerprint authentication error:', error);
      onAuthError?.(error);
      Alert.alert('Error', 'An error occurred during fingerprint authentication.');
    } finally {
      setIsLoading(false);
    }
  }, [isFingerPrintAvailable, onAuthSuccess, onAuthError]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Authenticate with Fingerprint"
          onPress={handleFingerprintAuth}
          disabled={!isFingerPrintAvailable || isLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
});

export default FingerprintButton;
