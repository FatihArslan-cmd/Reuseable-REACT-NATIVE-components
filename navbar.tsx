import React, { useState } from 'react';
import { SafeAreaView, Button, View, StyleSheet, ScrollView } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import { showNavigationBar } from 'react-native-navigation-bar-color';

export default function App() {
  const [isHidden, setIsHidden] = useState(false);

  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF6',
    '#F3FF33', '#8D33FF', '#FF8833', '#33FFD1', '#FF3333'
  ];

  const toggleNavigationBar = () => {
    if (isHidden) {
      showNavigationBar();
      setIsHidden(false);
    } else {
      hideNavigationBar();
      setIsHidden(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Button title={isHidden ? 'Show Navigation Bar' : 'Hide Navigation Bar'} onPress={toggleNavigationBar} />
        {colors.map((color, index) => (
          <View style={styles.buttonContainer} key={index}>
            <Button
              title={`Set to Color ${index + 1}`}
              color={color}
              onPress={() => changeNavigationBarColor(color, true, true)}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop:100,
  },
  buttonContainer: {
    marginVertical: 5,
    marginHorizontal: 20,
  }
});
