import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

// Reusable GradientText component
const GradientText = ({
  text = 'Colorful Text',            // Default text
  colors = ['#FF6B6B', '#FFD93D'],   // Default gradient colors
  start = { x: 0, y: 0 },            // Default gradient start point
  end = { x: 1, y: 1 },              // Default gradient end point
  textStyle = {},                    // Customizable text styles
  gradientStyle = {},                // Customizable gradient styles
  backgroundColor = '#fff'           // Default background color (white)
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <MaskedView
        maskElement={
          <View style={styles.maskContainer}>
            <Text style={[styles.text, textStyle]}>{text}</Text>
          </View>
        }
      >
        {/* Gradient background */}
        <LinearGradient
          colors={colors}
          start={start}
          end={end}
          style={[styles.gradient, gradientStyle]}
        />
      </MaskedView>
    </View>
  );
};

// Default styles for the component
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black', // The text color for the mask
  },
  gradient: {
    height: 60, // Default height for the gradient
    width: 300,  // Default width for the gradient
  },
});

export default GradientText;
