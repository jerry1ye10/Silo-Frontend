import React from 'react';
import { Image } from 'react-native';

export const getCardBrandIcon = (brand, style) => {
  const assetPath = '../../../assets/cards';
  switch (brand) {
    case 'American Express':
      return <Image source={require(`${assetPath}/amex.png`)} style={style} />;
    case 'Diners Club':
      return <Image source={require(`${assetPath}/diners.png`)} style={style} />;
    case 'Discover':
      return <Image source={require(`${assetPath}/discover.png`)} style={style} />;
    case 'JCB':
      return <Image source={require(`${assetPath}/jcb.png`)} style={style} />;
    case 'MasterCard':
      return <Image source={require(`${assetPath}/mastercard.png`)} style={style} />;
    case 'UnionPay':
      return <Image source={require(`${assetPath}/unionpay.png`)} style={style} />;
    case 'Visa':
      return <Image source={require(`${assetPath}/visa.png`)} style={style} />;
    case 'Unknown':
      return <Image source={require(`${assetPath}/default.png`)} style={style} />;
    default:
      return <Image source={require(`${assetPath}/default.png`)} style={style} />;
  }
};

// Helper function to make card object from Stripe smaller.
export const getTrimmedCard = (verboseCard) => {
  return (({ cardId, expMonth, expYear, last4, brand }) => ({
    id: cardId,
    expMonth,
    expYear,
    last4,
    brand,
    isDefault: 1,
  }))(verboseCard);
};
