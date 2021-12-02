import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

export const RectangleWithCornerBorders = () => {
  const [yOffset] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    const loop = () => {
      Animated.sequence([
        Animated.timing(yOffset, {
          toValue: sideLength - barThickness - borderRadius / 2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(yOffset, {
          toValue: borderRadius / 2,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        loop();
      });
    };
    loop();
  }, [yOffset]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedBar, { transform: [{ translateY: yOffset }] }]} />
      <View style={styles.topLeft} />
      <View style={styles.topRight} />
      <View style={styles.bottomLeft} />
      <View style={styles.bottomRight} />
    </View>
  );
};

const sideLength = 250;
const borderLength = 50;
const borderThickness = 3;
const barThickness = 3;
const borderRadius = 20;
const squareColor = '#7a593f';
const scanBarColor = '#ebdfcf';

const styles = StyleSheet.create({
  container: {
    width: sideLength + 2 * borderThickness,
    aspectRatio: 1,
  },
  animatedBar: {
    position: 'absolute',
    height: barThickness,
    width: sideLength - borderRadius,
    backgroundColor: scanBarColor,
    top: borderThickness,
    left: borderThickness + borderRadius / 2,
  },
  topLeft: {
    position: 'absolute',
    height: borderLength,
    width: borderLength,
    borderColor: squareColor,
    borderTopWidth: borderThickness,
    borderLeftWidth: borderThickness,
    top: 0,
    left: 0,
    borderTopLeftRadius: borderRadius,
  },
  topRight: {
    position: 'absolute',
    height: borderLength,
    width: borderLength,
    borderColor: squareColor,
    borderTopWidth: borderThickness,
    borderRightWidth: borderThickness,
    top: 0,
    left: sideLength - borderLength + 2 * borderThickness,
    borderTopRightRadius: borderRadius,
  },
  bottomLeft: {
    position: 'absolute',
    height: borderLength,
    width: borderLength,
    borderColor: squareColor,
    borderLeftWidth: borderThickness,
    borderBottomWidth: borderThickness,
    top: sideLength - borderLength + 2 * borderThickness,
    left: 0,
    borderBottomLeftRadius: borderRadius,
  },
  bottomRight: {
    position: 'absolute',
    height: borderLength,
    width: borderLength,
    borderColor: squareColor,
    borderRightWidth: borderThickness,
    borderBottomWidth: borderThickness,
    top: sideLength - borderLength + 2 * borderThickness,
    left: sideLength - borderLength + 2 * borderThickness,
    borderBottomRightRadius: borderRadius,
  },
});

export default RectangleWithCornerBorders;
