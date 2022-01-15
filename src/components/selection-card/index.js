import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import CustomText from '../../components/custom-text';
import { brown, cream } from '../../utilities/colors';

const SelectionCard = ({
  id,
  title,
  subtext,
  subtextColor,
  price,
  priceColor,
  discountedPrice,
  priceText,
  image,
  selected,
  setSelected,
  disabled,
}) => {
  const buttonStyle =
    id === selected
      ? { ...styles.button, borderColor: cream }
      : { ...styles.button, borderColor: 'rgba(0, 0, 0, 0)' };
  const subTextStyle = {
    color: subtextColor,
    fontWeight: subtextColor === 'black' ? 'normal' : 'bold',
    textAlign: 'left',
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={() => {
        setSelected(id);
      }}
      disabled={disabled}>
      <Image style={styles.image} source={image} />
      <View style={styles.descriptionView}>
        <View style={styles.leftContent}>
          <CustomText style={styles.title}>{title}</CustomText>
          <View style={styles.priceLineContainer}>
            {discountedPrice !== null ? (
              <View>
                <CustomText style={{ ...styles.oldPrice, color: priceColor}}>{price}{"\n"}{subtext}</CustomText>
                <CustomText style={{ ...styles.subTextStyle, color: priceColor}}>{discountedPrice}</CustomText>
              </View>
            ) : (
              <CustomText style={{ ...styles.price, color: priceColor }}>{price}{"\n"}{subtext}</CustomText>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 9,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: cream,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
    color: brown,
  },
  descriptionView: {
    flexDirection: 'row',
    flex: 1,
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 5,
  },
  leftContent: {
    marginLeft: 10,
    marginRight: 5,
  },
  image: {
    aspectRatio: 1,
    width: 60,
    resizeMode: 'contain',
  },
  priceLineContainer: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  priceTextContainer: {
    textAlign: 'center',
    color: brown,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'red',
    fontSize: 16,
  },
  subTextStyle: {
    fontSize: 14,
  }
});

export default SelectionCard;
