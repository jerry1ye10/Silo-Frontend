import React from 'react';
import { TextInput } from 'react-native';

const CustomTextInput = React.forwardRef((props, ref) => {
  const font = 'CircularStd-Book';
  const { style, children, ...others } = props;
  return (
    <TextInput ref={ref} style={{ fontFamily: font, ...style }} {...others}>
      {children}
    </TextInput>
  );
});

export default CustomTextInput;
