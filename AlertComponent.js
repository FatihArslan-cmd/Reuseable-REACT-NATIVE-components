import React, { memo } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

const { width, height } = Dimensions.get('window');

const AlertComponent = ({
  visible,
  title,
  message,
  onConfirm,
  confirmText,
  cancelText = 'Cancel',
  onCancel,
  modalStyle = {},
  confirmButtonStyle = {},
  cancelButtonStyle = {},
  confirmTextStyle = {fontSize:18},
  cancelTextStyle = {fontSize:18},
  confirmGradientColors = ['#56ab2f', '#a8e063'],
  cancelGradientColors = ['#D31027', '#EA384D'],
}) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel} // Android back button için
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.centeredView}>
          {/* Blur the background outside the modal */}
          <BlurView
            style={styles.absoluteBlur}
            blurType="light"  // You can change this to "dark" or "extra light"
            blurAmount={1}   // Adjust the blur amount to make it more intense
          />
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalView, modalStyle]}>
              <Text style={[styles.modalTitle]}>{title}</Text>
              <Text style={[styles.modalMessage]}>{message}</Text>
              <View style={styles.buttonContainer}>
                {onCancel && (
                  <LinearGradient 
                    colors={cancelGradientColors}
                    start={{x: 0, y: 0}} 
                    end={{x: 1, y: 1}}
                    style={[styles.linearGradient, cancelButtonStyle, styles.buttonGap]}
                  >
                    <TouchableOpacity 
                      onPress={onCancel}
                      style={styles.buttonContent}
                      accessibilityLabel="Cancel"
                      accessibilityRole="button"
                    >
                      <Text style={[styles.buttonText, cancelTextStyle]}>{cancelText}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                )}
                <LinearGradient 
                  colors={confirmGradientColors}
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 1}}
                  style={[styles.linearGradient, confirmButtonStyle]}
                >
                  <TouchableOpacity 
                    onPress={onConfirm}
                    style={styles.buttonContent}
                    accessibilityLabel="Confirm"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.buttonText, confirmTextStyle]}>{confirmText}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 50,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: height * 0.005,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 32,
    color: 'black',
    fontFamily: 'Poppins-Bold',
  },
  modalMessage: {
    marginVertical: 30,
    textAlign: 'center',
    fontSize: 22,
    color: '#555',
    fontFamily: 'Poppins-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
  linearGradient: {
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  buttonContent: {
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonGap: {
    marginRight: 15,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  absoluteBlur: {
    position: 'absolute',
    width: width,
    height: height,
  },
});

export default memo(AlertComponent);
