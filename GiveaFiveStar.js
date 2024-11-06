import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Button, Dimensions, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for star icons

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.7;
const MIN_TRANSLATE_Y = 0;

const BottomSheet = () => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);

  const [rating, setRating] = useState(0); // Rating state
  const scale = useSharedValue(1); // For glowing effect (scale)
  const opacity = useSharedValue(1); // For glowing effect (opacity)

  const springConfig = {
    damping: 10,
    mass: 0.5,
    stiffness: 100,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y / 2],
      [0, 1],
      'clamp'
    );
    return {
      opacity,
      display: opacity === 0 ? 'none' : 'flex',
    };
  });

  const toggleSheet = () => {
    if (active.value) {
      translateY.value = withSpring(0, springConfig);
    } else {
      translateY.value = withSpring(MAX_TRANSLATE_Y / 2, springConfig);
    }
    active.value = !active.value;
  };

  const gestureHandler = useCallback(
    (event) => {
      'worklet';
      const { translationY, velocityY, state } = event.nativeEvent;

      if (state === 4) {
        const projectedY = translateY.value + velocityY * 0.2;

        const snapPoints = [
          MAX_TRANSLATE_Y,
          MAX_TRANSLATE_Y / 2,
          MIN_TRANSLATE_Y,
        ];

        let nearestPoint = snapPoints[0];
        let minDistance = Math.abs(projectedY - snapPoints[0]);

        snapPoints.forEach((point) => {
          const distance = Math.abs(projectedY - point);
          if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = point;
          }
        });

        translateY.value = withSpring(nearestPoint, {
          ...springConfig,
          velocity: velocityY,
        });

        active.value = nearestPoint !== 0;
      } else {
        const newTranslateY = translateY.value + translationY;
        translateY.value = Math.max(MAX_TRANSLATE_Y, Math.min(MIN_TRANSLATE_Y, newTranslateY));
      }
    },
    []
  );

  const handleStarPress = (index) => {
    setRating(index + 1); 
    scale.value = withTiming(1.5, { duration: 200 }, () => {
      scale.value = withTiming(1, { duration: 150 }); // Pulse effect
    });
    opacity.value = withTiming(1, { duration: 300 });
  };

  const renderStars = () => {
    return Array(5).fill(null).map((_, index) => {
      const isFilled = index < rating;
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleStarPress(index)}
          style={styles.starContainer}
        >
          <Animated.View
            style={[
              styles.star,
              isFilled && styles.filledStar,
              {
                transform: [{ scale: isFilled ? scale : 1 }],
                opacity: isFilled ? opacity : 1,
              },
            ]}
          >
            <Icon
              name={isFilled ? 'star' : 'star-o'}
              size={40}
              color={isFilled ? '#ffcc00' : '#e0e0e0'}
            />
          </Animated.View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Button title="Toggle Bottom Sheet" onPress={toggleSheet} />

      <Animated.View style={[styles.blurContainer, animatedBlurStyle]}>
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={3}
          reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.5)"
        />
      </Animated.View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.titleText}>Give us 5 stars</Text>

          <View style={styles.starsContainer}>
            {renderStars()}
          </View>

          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => alert(`You rated: ${rating} stars`)}
          >
            <Text style={styles.rateButtonText}>Rate</Text>
          </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  bottomSheet: {
    position: 'absolute',
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 16,
    alignItems: 'center',
    bottom: -SCREEN_HEIGHT + 30,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 2,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#00000040',
    borderRadius: 2,
    marginBottom: 8,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
  starContainer: {
    marginHorizontal: 12,
  },
  star: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledStar: {
    backgroundColor: 'transparent', 
  },
  rateButton: {
    marginTop: 80,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#ffcc00',
    borderRadius: 20,
    alignItems: 'center',
  },
  rateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
