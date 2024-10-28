import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from '@react-native-community/blur';

const BottomSheet = () => {
  const bottomSheetHeight = useSharedValue(0);
  const threshold = 50;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: `${bottomSheetHeight.value * 100}%`,
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      bottomSheetHeight.value,
      [0, 0.3],
      [0, 1]
    );
    return {
      opacity,
      display: opacity === 0 ? 'none' : 'flex',
    };
  });

  const toggleSheet = () => {
    bottomSheetHeight.value = bottomSheetHeight.value === 0 ? withSpring(0.30) : withSpring(0);
  };

  const onGestureEvent = useCallback((event) => {
    const translationY = event.nativeEvent.translationY;

    if (translationY < 0) {
      bottomSheetHeight.value = withSpring(0.70);
    } else {
      if (bottomSheetHeight.value === 0.30 && translationY > threshold) {
        bottomSheetHeight.value = withSpring(0);
      } else {
        bottomSheetHeight.value = withSpring(0.30);
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Button title="Toggle Bottom Sheet" onPress={toggleSheet} />
      
      <Animated.View style={[styles.blurContainer, animatedBlurStyle]}>
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
      </Animated.View>

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
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 2,
    shadowRadius: 4,
    zIndex: 2, // Ensure bottom sheet is above blur
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 'auto'
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Below bottom sheet
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
