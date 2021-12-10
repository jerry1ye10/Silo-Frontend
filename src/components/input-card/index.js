import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomText from '../custom-text';
import CustomTextInput from '../custom-text-input';
import { brown, cream } from '../../utilities/colors';

const InputCard = ({ inputInfo }) => {
  const [didEditText, setDidEditText] = React.useState(false);
  const [textInput, setTextInput] = React.useState(inputInfo.defaultValue);

  const containerStyle = inputInfo.isLast
    ? styles.container
    : { ...styles.container, ...styles.notLastContainer };

  const inputStyle =
    Platform.OS === 'android'
      ? { ...styles.textInput, paddingVertical: 5 }
      : { ...styles.textInput, paddingVertical: 0 };

  let saveButton;
  if (inputInfo.isChanging) {
    saveButton = (
      <TouchableOpacity style={{ ...styles.button, ...styles.loadingButtonColor }}>
        <ActivityIndicator color="white" />
      </TouchableOpacity>
    );
  } else if (didEditText) {
    saveButton = (
      <TouchableOpacity
        style={{ ...styles.button, ...styles.saveButtonColor }}
        onPress={() => {
          inputInfo.onPress(textInput, () => {
            setDidEditText(false);
            Keyboard.dismiss();
          });
        }}>
        <CustomText style={styles.buttonText}>Save</CustomText>
      </TouchableOpacity>
    );
  } else {
    saveButton = (
      <TouchableOpacity style={{ ...styles.button, ...styles.hiddenButtonColor }} disabled>
        <CustomText style={styles.hiddenButtonText}>Save</CustomText>
      </TouchableOpacity>
    );
  }

  const uneditableContentStyle = inputInfo.contentTextColor
    ? { color: inputInfo.contentTextColor }
    : { color: 'gray' };
  if (inputInfo.contentBold) {
    uneditableContentStyle.fontWeight = 'bold';
  }

  const cardToBeDisplayed = inputInfo.isChangeable ? (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => {
        if (this.textInput) {
          this.textInput.focus();
        }
      }}>
      <CustomText style={styles.titleText}>{inputInfo.title}</CustomText>
      <View style={styles.actionView}>
        <CustomTextInput
          autoCorrect={false}
          autoCapitalize="words"
          style={inputStyle}
          onChangeText={(e) => {
            setTextInput(e);
            setDidEditText(true);
          }}
          onSubmitEditing={() => {
            if (textInput !== inputInfo.defaultValue) {
              inputInfo.onPress(textInput, () => {
                setDidEditText(false);
                Keyboard.dismiss();
              });
            }
          }}
          ref={(input) => {
            this.textInput = input;
          }}
          value={textInput}
        />
        {saveButton}
      </View>
    </TouchableOpacity>
  ) : (
    <View style={containerStyle}>
      <CustomText style={styles.titleText}>{inputInfo.title}</CustomText>
      <CustomText style={uneditableContentStyle}>{inputInfo.content}</CustomText>
    </View>
  );

  return cardToBeDisplayed;
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'lightgray',
    paddingVertical: 20,
  },
  notLastContainer: {
    borderBottomWidth: 1,
  },
  titleText: {
    flex: 1,
    color: brown,
    marginVertical: 5,
    fontSize: 16,
  },
  actionView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    color: brown,
    paddingHorizontal: 0,
  },
  button: {
    width: 55,
    height: 25,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonColor: {
    backgroundColor: brown,
  },
  loadingButtonColor: {
    backgroundColor: 'gray',
  },
  hiddenButtonColor: {
    color: cream,
  },
  buttonText: {
    color: cream,
  },
  hiddenButtonText: {
    color: cream,
  },
});

export default InputCard;
