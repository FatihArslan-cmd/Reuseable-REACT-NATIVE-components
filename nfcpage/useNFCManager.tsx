import { useState, useEffect } from 'react';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

export const useNFCManager = () => {
  const [isAnimationVisible, setAnimationVisible] = useState(false);
  const [isErrorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    NfcManager.start()
      .then(() => console.log('NFC Manager started'))
      .catch(error => console.warn('NFC start error:', error));

    const discoverTagListener = (tag:any) => {
      if (tag.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecord = tag.ndefMessage[0];
        const text = decodeNdefText(ndefRecord.payload);

        if (text === 'en18811993') {
          setAnimationVisible(true);
          setErrorVisible(false);
        } else {
          setErrorVisible(true);
          setAnimationVisible(false);
        }
      }

      NfcManager.unregisterTagEvent().catch(() => 0);
    };

    NfcManager.setEventListener(NfcEvents.DiscoverTag, discoverTagListener);

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch(() => 0);
    };
  }, []);

  const startNFCScan = async () => {
    const isEnabled = await NfcManager.isEnabled();
    if (!isEnabled) throw new Error('NFC Disabled');
    await NfcManager.registerTagEvent();
    setAnimationVisible(false);
    setErrorVisible(false);
  };

  const decodeNdefText = (payload:any) => {
    if (!payload || payload.length < 1) return '';
    const textBytes = payload.slice(1);
    return String.fromCharCode(...textBytes);
  };

  return { isAnimationVisible, isErrorVisible, startNFCScan };
};