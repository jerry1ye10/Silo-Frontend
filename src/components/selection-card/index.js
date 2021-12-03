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
          <CustomText style={subTextStyle}>{subtext}</CustomText>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.priceLineContainer}>
            {discountedPrice !== null ? (
              <>
                <CustomText style={styles.oldPrice}>{price}</CustomText>
                <CustomText style={styles.price}> {discountedPrice}</CustomText>
              </>
            ) : (
              <CustomText style={{ ...styles.price, color: priceColor }}>{price}</CustomText>
            )}
          </View>
          <CustomText style={styles.priceTextContainer}>{priceText}</CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
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
    width: 40,
  },
  priceLineContainer: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  priceTextContainer: {
    textAlign: 'right',
    color: brown,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'red',
    fontSize: 16,
  },
});

export default SelectionCard;
