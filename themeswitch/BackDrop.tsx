import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';

type Props = {
  translateY: SharedValue<number>;
  openHeight: number;
  closeHeight: number;
  close: () => void;
};

const BackDrop = ({ translateY, openHeight, closeHeight, close }: Props) => {
  const backDropAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [closeHeight, openHeight],
      [0, 1]  // Make sure opacity goes up to 1 for full visibility
    );
    const display = opacity === 0 ? 'none' : 'flex';
    return {
      opacity,
      display,
    };
  });

  return (
    <TouchableWithoutFeedback onPress={close}>
      <Animated.View style={[styles.container, backDropAnimation]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark" // Use 'dark' or 'extraDark' for maximum effect
          blurAmount={3} // Increased blur amount for stronger effect
          reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.5)" // Fallback color
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default BackDrop;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    display: 'none',
  },
});
