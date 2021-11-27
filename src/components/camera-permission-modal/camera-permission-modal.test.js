import React from 'react';
import renderer, {act} from 'react-test-renderer';

import {Linking} from 'react-native';
jest.mock('Linking', () => {
  return {
    openSettings: jest.fn(),
  };
});

import {CameraPermissionModal} from '.';

const setModalVisibility = jest.fn();

describe('<CameraPermissionModal />', () => {
  it('modal visibility 1', () => {
    const component = renderer.create(
      <CameraPermissionModal
        modalVisibility={true}
        setModalVisibility={setModalVisibility}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const WideModalBase = component.root.findByProps({
      testID: 'wide-modal-base',
    });
    expect(WideModalBase.props.modalVisibility).toEqual(true);
  });

  it('modal visibility 2', () => {
    const component = renderer.create(
      <CameraPermissionModal
        modalVisibility={false}
        setModalVisibility={setModalVisibility}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const WideModalBase = component.root.findByProps({
      testID: 'wide-modal-base',
    });
    expect(WideModalBase.props.modalVisibility).toEqual(false);
  });

  it('cancel button pressed', () => {
    const component = renderer.create(
      <CameraPermissionModal
        modalVisibility={true}
        setModalVisibility={setModalVisibility}
      />,
    );
    const cancelButton = component.root.findByProps({
      testID: 'cancel-button',
    });
    cancelButton.props.onPress();
    expect(setModalVisibility).toHaveBeenCalledWith(false);
  });

  it('settings button pressed with modal hide', () => {
    const component = renderer.create(
      <CameraPermissionModal
        modalVisibility={true}
        setModalVisibility={setModalVisibility}
      />,
    );
    const settingsButton = component.root.findByProps({
      testID: 'settings-button',
    });
    act(() => {
      settingsButton.props.onPress();
    });
    expect(setModalVisibility).toHaveBeenCalledWith(false);
    const WideModalBase = component.root.findByProps({
      testID: 'wide-modal-base',
    });
    act(() => {
      WideModalBase.props.onModalHide();
    });
    expect(Linking.openSettings).toHaveBeenCalled();
  });
});
