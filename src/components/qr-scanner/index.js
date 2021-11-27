import React from 'react';
import { StyleSheet } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import ScanOverlay from '../scan-overlay';

const QRScanner = ({ shouldReactivate, setShouldReactivate, onScanSuccess }) => {
  // Reference to be able to invoke the reactivate function.
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (shouldReactivate && ref.current) {
      setShouldReactivate(false);
      ref.current.reactivate();
    }
  }, [shouldReactivate, setShouldReactivate]);

  return (
    <QRCodeScanner
      bottomViewStyle={styles.bottomViewStyle}
      cameraStyle={styles.cameraStyle}
      containerStyle={styles.containerStyle}
      customMarker={<ScanOverlay headerText="Scan QR Code on Desk" />}
      fadeIn={false}
      onRead={onScanSuccess}
      ref={ref}
      showMarker
      topViewStyle={styles.topViewStyle}
      vibrate={false}
    />
  );
};

const styles = StyleSheet.create({
  cameraStyle: {
    flex: 1,
    width: '100%',
  },
  topViewStyle: {
    flex: 0,
  },
  bottomViewStyle: {
    flex: 0,
  },
  containerStyle: {
    flex: 1,
    alignItems: 'center',
  },
});

export default QRScanner;
