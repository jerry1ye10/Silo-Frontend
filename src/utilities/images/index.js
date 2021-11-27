import base64 from 'react-native-base64';

export const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; ++i) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64.encode(binary);
};
