import {StyleSheet, useColorScheme} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from './BottomSheet';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import Button from './Button';
import { BottomSheetMethods } from './BottomSheet';

const Setting = () => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const [theme, setTheme] = useState<string | null | undefined>(colorScheme);
  const [themeSwitch, setThemeSwitch] = useState<string>('system');

  useEffect(() => {
    if (themeSwitch === 'system') {
      setTheme(colorScheme);
    }
  }, [colorScheme, themeSwitch]);

  const backgroundColorAnimation = useAnimatedStyle(() => {
    return {
      backgroundColor:
        theme === 'dark' ? withTiming('black') : withTiming('white'),
    };
  });
  return (
    <Animated.View
      style={[
        styles.container,
        {paddingTop: insets.top},
        backgroundColorAnimation,
      ]}>

      <Button bottomSheetRef={bottomSheetRef} theme={theme} />
      <BottomSheet
        ref={bottomSheetRef}
        setTheme={setTheme}
        theme={theme}
        setThemeSwitch={setThemeSwitch}
        themeSwitch={themeSwitch}
      />
    </Animated.View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});