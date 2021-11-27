import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';

import { eggshell } from '../../utilities/colors';

const BottomModalBase = ({children,
  modalVisibility,
  setModalVisibility,
  onModalHide,
  onModalWillShow,
  canDismiss,
}) => {
  return (
    <Modal
      style={styles.modal}
      isVisible={modalVisibility}
      onModalHide={onModalHide}
      onModalWillShow={onModalWillShow}
      avoidKeyboard
      onBackdropPress={() => {
        if (canDismiss) {
          setModalVisibility(false);
        }
      }}>
      <SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
        <View style={styles.modalView}>{children}</View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  modalView: {
    width: '100%',
    backgroundColor: eggshell,
    alignItems: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});

export default BottomModalBase;
