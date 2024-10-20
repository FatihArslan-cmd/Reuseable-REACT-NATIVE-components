import React from 'react';
import { Button, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const BiometricButton = () => {
  const handleBiometricAuth = () => {
    const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics
      .simplePrompt({ promptMessage: 'Authenticate with Biometrics' })
      .then(resultObject => {
        const { success } = resultObject;

        if (success) {
          Alert.alert('Authenticated successfully!');
        } else {
          Alert.alert('Authentication failed');
        }
      })
      .catch(() => {
        Alert.alert('Biometrics not available');
      });
  };

  return <Button title="Authenticate with Fingerprint" onPress={handleBiometricAuth} />;
};

export default BiometricButton;
