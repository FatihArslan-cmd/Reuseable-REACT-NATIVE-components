import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Button,
  Animated,
  Easing,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import heartImage from './assets/heart.png';

function App() {
  const openerAnim = useRef(new Animated.Value(0)).current;
  const [animDone, setAnimDone] = useState(false);

  const appOpacity = {
    opacity: openerAnim.interpolate({
      inputRange: [0, 15, 30],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    }),
  };

  const appScale = {
    transform: [
      {
        scale: openerAnim.interpolate({
          inputRange: [0, 100],
          outputRange: [1.1, 1]
        }),
      },
    ],
  };

  const maskScale = {
    transform: [
      {
        scale: openerAnim.interpolate({
          inputRange: [0, 10, 100],
          outputRange: [1, 0.8, 70],
        }),
      },
    ],
  };

  useEffect(() => {
    Animated.timing(
      openerAnim,
      {
        toValue: 100,
        duration: 2000,
        easing: Easing.cubic,
        useNativeDriver: true
      }
    ).start(() => {
      setAnimDone(true);
    });
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      { !animDone ? <View style={[StyleSheet.absoluteFill, styles.backgroundFillBlue]}></View> : null }
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <View style={styles.maskWrapper}>
            <Animated.Image source={heartImage}
              style={[styles.mask, maskScale]}/>
          </View>
        }>
        { !animDone ? <View style={[StyleSheet.absoluteFill, styles.backgroundFillWhite]}></View> : null }
        <Animated.View style={[styles.loginBox, appScale, appOpacity]}>
          <TextInput
            value=""
            placeholder="Username"
            placeholderTextColor="#666"
            style={styles.input}
          />
          <TextInput
            value=""
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry={true}
            style={styles.input}
          />
          <View style={styles.separator}/>
          <Button title="Login"/>
        </Animated.View>
      </MaskedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  maskedView: {
    flex: 1,
  },
  maskWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    width: 150,
    height: 150,
  },
  loginBox: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 40
  },
  backgroundFillBlue: {
    backgroundColor: '#0091ff',
  },
  backgroundFillWhite: {
    backgroundColor: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  separator: {
    height: 20
  }
});

export default App;
