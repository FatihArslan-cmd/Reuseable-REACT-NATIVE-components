import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BottomSheet = () => {
  const bottomSheetHeight = useSharedValue(0); // Closed initially
  const threshold = 50; // Threshold for drag distance in pixels

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: `${bottomSheetHeight.value * 100}%`,
    };
  });

  const toggleSheet = () => {
    bottomSheetHeight.value = bottomSheetHeight.value === 0 ? withSpring(0.30) : withSpring(0);
  };

  const onGestureEvent = useCallback((event) => {
    const translationY = event.nativeEvent.translationY;

    if (translationY < 0) {
      // Expand to 70% on upward drag
      bottomSheetHeight.value = withSpring(0.70);
    } else {
      // Collapse to 25% or close based on current state with threshold
      if (bottomSheetHeight.value === 0.30 && translationY > threshold) {
        bottomSheetHeight.value = withSpring(0); // Close the sheet
      } else {
        bottomSheetHeight.value = withSpring(0.30); // Collapse to 25%
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Button title="Toggle Bottom Sheet" onPress={toggleSheet} />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]}>
          <View style={styles.handleContainer}>
            <MaterialIcons name="drag-handle" size={24} color="gray" />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: -30,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15, // Adds shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 2,
    shadowRadius: 4,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 'auto'
  },
});
