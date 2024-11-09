import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import {
  Canvas,
  Path,
  Group,
  usePathValue,
  SweepGradient,
  BlurMask,
} from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue, withTiming, interpolate, Extrapolate } from 'react-native-reanimated';
import { vec } from '@shopify/react-native-skia';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const logarithmicSpiral = ({ angle, index }) => {
  'worklet';
  const a = index / 2;
  const k = 0.008;
  return {
    x: a * Math.exp(k * angle) * Math.cos(angle * index) * 1.5,
    y: a * Math.exp(k * angle) * Math.sin(angle * index) * 1.5,
  };
};

const SpiralAnimation = () => {
  const spiralCircleCount = 175;
  const angle = useSharedValue(14); // Start angle from 0 to make points appear from the right initially

  useEffect(() => {
    // Immediately change angle when the component mounts
    angle.value = Math.PI * 2 * Math.random();

    // Then continue with interval updates
    const interval = setInterval(() => {
      angle.value = Math.PI * 2 * Math.random();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const spiralCoordinates = useDerivedValue(() => {
    return Array.from({ length: spiralCircleCount }, (_, index) => {
      const { x, y } = logarithmicSpiral({ angle: angle.value, index });
      return { x, y };
    });
  });

  const animatedSpiralCoordinatesX = useDerivedValue(() => {
    return withTiming(
      spiralCoordinates.value.map((coordinate) => coordinate.x),
      { duration: 1000 }
    );
  });

  const animatedSpiralCoordinatesY = useDerivedValue(() => {
    return withTiming(
      spiralCoordinates.value.map((coordinate) => coordinate.y),
      { duration: 1000 }
    );
  });

  const MAX_DISTANCE_FROM_CENTER = Math.sqrt(
    (windowWidth / 2) ** 2 + (windowHeight / 2) ** 2
  );

  const path = usePathValue((skPath) => {
    'worklet';
    skPath.reset();

    for (let index = 0; index < spiralCircleCount; index++) {
      const x = animatedSpiralCoordinatesX.value[index];
      const y = animatedSpiralCoordinatesY.value[index];

      const distanceFromCenter = Math.sqrt(x ** 2 + y ** 2);
      const radius = interpolate(
        distanceFromCenter,
        [0, MAX_DISTANCE_FROM_CENTER],
        [2, 0.5],
        Extrapolate.CLAMP
      );

      skPath.addCircle(x, y, radius);
    }

    return skPath;
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Canvas style={{ flex: 1 }}>
        <Group
          transform={[
            { translateX: windowWidth / 2 },
            { translateY: windowHeight / 2 },
            { scale: 1.8 },
          ]}
        >
          <Path path={path}>
            <SweepGradient c={vec(0, 0)} colors={['cyan', 'magenta', 'yellow', 'cyan']} />
            <BlurMask blur={5} style="solid" />
          </Path>
        </Group>
      </Canvas>
    </View>
  );
};

export default SpiralAnimation;
