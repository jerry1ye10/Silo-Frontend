import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

import CustomText from '../custom-text';
import { brown, cream } from '../../utilities/colors';

const LoadingCardCard = ({ isActive }) => {
  const user = useSelector((state) => state.user);
  const containerStyle =
    user.cards.length === 0 ? styles.container : [styles.container, styles.bottomBorder];
  return (
    <View style={containerStyle}>
      {isActive ? (
        <>
          <Icon name="credit-card-alt" size={30} color="gray" />
          <ActivityIndicator style={styles.activityIndicator} size="small" />
        </>
      ) : (
        <CustomText style={styles.text}>No payments methods added</CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cream,
  },
  text: {
    color: brown,
  },
  bottomBorder: {
    borderColor: 'lightgray',
    borderBottomWidth: 1,
  },
  activityIndicator: {
    marginLeft: 20,
    color: 'gray',
  },
});

export default LoadingCardCard;
