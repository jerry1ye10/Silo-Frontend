import React from 'react';
import {View} from 'react-native';
import renderer from 'react-test-renderer';

import {WideModalBase} from '.';

const children1 = (
  <View>
    <View />
    <View />
  </View>
);
const children2 = (
  <View>
    <View />
    <View />
    <View />
    <View />
  </View>
);
const onModalHide = jest.fn();

describe('<WideModalBase />', () => {
  it('children present 1', () => {
    const component = renderer.create(
      <WideModalBase
        modalVisibility={true}
        onModalHide={onModalHide}
        position="center"
        children={children1}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const modalView = component.root.findByProps({testID: 'modal-view'});
    expect(modalView.props.children.props.children.length).toEqual(2);
  });

  it('children present 2', () => {
    const component = renderer.create(
      <WideModalBase
        modalVisibility={true}
        onModalHide={onModalHide}
        position="flex-end"
        children={children2}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const modalView = component.root.findByProps({testID: 'modal-view'});
    expect(modalView.props.children.props.children.length).toEqual(4);
  });

  it('modal visibility 1', () => {
    const component = renderer.create(
      <WideModalBase
        modalVisibility={true}
        onModalHide={onModalHide}
        position="center"
        children={children1}
      />,
    );
    const modal = component.root.findByProps({testID: 'modal'});
    expect(modal.props.isVisible).toEqual(true);
  });

  it('modal visibility 2', () => {
    const component = renderer.create(
      <WideModalBase
        modalVisibility={false}
        onModalHide={onModalHide}
        position="flex-end"
        children={children1}
      />,
    );
    const modal = component.root.findByProps({testID: 'modal'});
    expect(modal.props.isVisible).toEqual(false);
  });

  it('position center', () => {
    const component = renderer.create(
      <WideModalBase
        modalVisibility={true}
        onModalHide={onModalHide}
        position="center"
        children={children1}
      />,
    );
    const modal = component.root.findByProps({testID: 'modal'});
    const container = modal.findByProps({testID: 'container'});
    expect(container.props.children[1]).toBeNull();
  });

  it('position flex end', () => {
    const component = renderer.create(
      <WideModalBase
        modalVisibility={false}
        onModalHide={onModalHide}
        position="flex-end"
        children={children1}
      />,
    );
    const modal = component.root.findByProps({testID: 'modal'});
    const container = modal.findByProps({testID: 'container'});
    const spacer = container.findByProps({testID: 'spacer'});
    expect(spacer).toBeDefined();
  });

  it('on modal hide', () => {
    const component = renderer.create(
      <WideModalBase
        modalVisibility={true}
        onModalHide={onModalHide}
        position="center"
        children={children1}
      />,
    );
    const modal = component.root.findByProps({testID: 'modal'});
    modal.props.onModalHide();
    expect(onModalHide).toHaveBeenCalled();
  });
});
