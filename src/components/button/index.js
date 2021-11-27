import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import CustomText from '../custom-text';

const Button = ({
  text,
  color,
  backgroundColor,
  borderColor = 'black',
  borderWidth = 0,
  marginBottom = 0,
  onPress,
  disabled = false,
  showActivityIndicator = false,
}) => {
  let containerStyle = disabled
    ? {
        ...styles.container,
        backgroundColor: 'gray',
        borderColor,
        borderWidth,
        marginBottom,
      }
    : {
        ...styles.container,
        backgroundColor,
        borderColor,
        borderWidth,
        marginBottom,
      };
  containerStyle = { ...containerStyle, ...styles.shadow };
  const textStyle = { ...styles.text, color: disabled ? 'black' : color };
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} disabled={disabled}>
      {showActivityIndicator ? (
        <ActivityIndicator />
      ) : (
        <CustomText style={textStyle}>{text}</CustomText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default Button;
