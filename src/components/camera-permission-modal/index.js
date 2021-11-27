import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import CustomText from '../custom-text';
import WideModalBase from '../wide-modal-base';

export const CameraPermissionModal = ({ modalVisibility, setModalVisibility }) => {
  const [settingsPressed, setSettingsPressed] = React.useState(false);

  return (
    <WideModalBase
      modalVisibility={modalVisibility}
      position="center"
      onModalHide={() => {
        if (settingsPressed) {
          Linking.openSettings();
          setSettingsPressed(false);
        }
      }}
      testID="wide-modal-base">
      <View style={styles.content}>
        <CustomText style={styles.title}>Enable Camera</CustomText>
        <CustomText style={styles.description}>
          Silo needs access to your{'\n'}camera to unlock desks in store.
        </CustomText>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              setSettingsPressed(true);
              setModalVisibility(false);
            }}
            testID="settings-button">
            <CustomText style={styles.settingsButtonText}>SETTINGS</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setSettingsPressed(false);
              setModalVisibility(false);
            }}
            testID="cancel-button">
            <CustomText style={styles.cancelButtonText}>CANCEL</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </WideModalBase>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  description: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  settingsButton: {
    paddingVertical: 10,
    width: '90%',
    backgroundColor: 'green',
    borderRadius: 2,
    margin: 5,
  },
  settingsButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    width: '90%',
    margin: 5,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
});

export default CameraPermissionModal;
