import { useState } from 'react';

const useAlert = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const handleOpenAlert = () => setIsAlertVisible(true);
  const handleConfirm = () => setIsAlertVisible(false);
  const handleCancel = () => setIsAlertVisible(false);

  return {
    isAlertVisible,
    handleOpenAlert,
    handleConfirm,
    handleCancel,
  };
};

export default useAlert;

--------------------------------------------------------------------

import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AlertComponent from './AlertComponent'; // Make sure the path is correct
import useAlert from './hooks/useAlert';

const HomeScreen = () => {
  const { isAlertVisible, handleOpenAlert, handleConfirm, handleCancel } = useAlert();

 
  return (
    <View style={styles.container}>
      <Button title="Show Alert" onPress={handleOpenAlert} />

      <AlertComponent
        visible={isAlertVisible}
        title="User not found"
        onCancel={handleCancel}
        message="You have to use a different name"
        onConfirm={handleConfirm}
        confirmText="Ok"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
