import React from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';

export const WideModalBase = ({ children, modalVisibility, position, onModalHide }) => {
  return (
    <Modal isVisible={modalVisibility} onModalHide={onModalHide} avoidKeyboard testID="modal">
      <SafeAreaView style={{ ...styles.topContainer, justifyContent: position }} testID="container">
        <View style={styles.modalView} testID="modal-view">
          {children}
        </View>
        {position === 'flex-end' ? <View style={styles.spacer} testID="spacer" /> : null}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalView: {
    width: 300,
    height: 250,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 20,
    overflow: 'hidden',
  },
  spacer: {
    height: 30,
  },
});

export default WideModalBase;
