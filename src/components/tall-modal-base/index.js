import React from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {brown} from '../../utilities/colors/index.js'

const TallModalBase = ({ children, modalVisibility, onModalHide }) => {
  return (
    <Modal isVisible={modalVisibility} onModalHide={onModalHide} avoidKeyboard>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalView}>{children}</View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    width: 300,
    height: 440,
    backgroundColor: brown,
    alignItems: 'center',
    borderRadius: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: 'hidden',
  },
});

export default TallModalBase;
