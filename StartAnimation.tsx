import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet, Animated } from 'react-native';
import BootSplash from 'react-native-bootsplash';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Ana Sayfa</Text>
    <Button title="Detaylara Git" onPress={() => navigation.navigate('Details')} />
  </View>
);

const DetailsScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Detaylar Sayfası</Text>
    <Button title="Geri Dön" onPress={() => navigation.goBack()} />
  </View>
);

export default function App() {
  const [scaleAnim] = useState(new Animated.Value(10.0)); 

  useEffect(() => {
    BootSplash.hide({ fade: true }).then(() => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1, 
          duration: 600, 
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, 
          duration: 350, 
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  return (
    <Animated.View style={[styles.animatedContainer, { transform: [{ scale: scaleAnim }] }]}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detaylar' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
