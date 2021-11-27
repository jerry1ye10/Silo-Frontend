import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { black } from '../../utilities/colors';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../assets/app-logo-with-text-transparent.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '70%',
    height: 'auto',
    aspectRatio: 1,
  },
});

export default LoadingScreen;
