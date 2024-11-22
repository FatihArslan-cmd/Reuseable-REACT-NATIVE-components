import React, { useState } from 'react';
import { View, Text, NativeModules, Button, TouchableOpacity, StatusBar } from 'react-native';

const { NavigationBarModule } = NativeModules;

const App = () => {
  const [selectedColor, setSelectedColor] = useState('#000000'); // Default color
  const [lightIcons, setLightIcons] = useState(true);

  const hideNavigationBar = () => {
    NavigationBarModule.setNavigationBarVisibility(false);
  };

  const showNavigationBar = () => {
    NavigationBarModule.setNavigationBarVisibility(true);
  };

  const changeColors = () => {
    // Change navigation bar color
    NavigationBarModule.setNavigationBarColor(selectedColor, lightIcons);

    // Change status bar color
    StatusBar.setBackgroundColor(selectedColor, true);
    StatusBar.setBarStyle(lightIcons ? 'light-content' : 'dark-content', true);
  };

  // Predefined colors
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFD700', '#8A2BE2', '#FF1493'];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>Status and Navigation Bar Control</Text>

      <Button title="Hide Navigation Bar" onPress={hideNavigationBar} />
      <View style={{ marginVertical: 10 }}>
        <Button title="Show Navigation Bar" onPress={showNavigationBar} />
      </View>

      <Text style={{ marginTop: 20 }}>Select Color:</Text>
      <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 20 }}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => setSelectedColor(color)}
            style={{
              backgroundColor: color,
              width: 40,
              height: 40,
              margin: 5,
              borderRadius: 20,
              borderWidth: selectedColor === color ? 2 : 0,
              borderColor: 'black',
            }}
          />
        ))}
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button
          title={`Set Icons: ${lightIcons ? 'Light' : 'Dark'}`}
          onPress={() => setLightIcons(!lightIcons)}
        />
      </View>

      <Button title="Apply Colors" onPress={changeColors} />
    </View>
  );
};

export default App;
