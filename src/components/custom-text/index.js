import React from 'react';
import { Text } from 'react-native';

const CustomText = React.forwardRef((props, ref) => {
  const font = 'CircularStd-Book';
  const { style, children, ...others } = props;
  return (
    <Text ref={ref} style={{ fontFamily: font, ...style }} {...others}>
      {children}
    </Text>
  );
});

export default CustomText;
