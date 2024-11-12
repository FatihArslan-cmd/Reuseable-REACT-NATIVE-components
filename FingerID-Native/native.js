import React, { useState } from 'react';
import { NativeModules, Button, Text, View, InteractionManager } from 'react-native';

const { FingerprintModule } = NativeModules;

const requestFingerprintAuth = (setResult) => {
  InteractionManager.runAfterInteractions(() => {
    FingerprintModule.authenticateFingerPrint((result) => {
      setResult(result);
    });
  });
};

export default function Finger() {
  const [authResult, setAuthResult] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <Button
        title="Authenticate with Fingerprint"
        onPress={() => requestFingerprintAuth(setAuthResult)}
      />
      {authResult ? (
        <Text style={{ marginTop: 20, fontSize: 16 }}>{authResult}</Text>
      ) : null}
    </View>
  );
}
