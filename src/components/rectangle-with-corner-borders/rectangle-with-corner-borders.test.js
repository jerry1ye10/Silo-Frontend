import React from 'react';
import renderer from 'react-test-renderer';

import {RectangleWithCornerBorders} from '.';

describe('<RectangleWithCornerBorders />', () => {
  it('snapshot', () => {
    const component = renderer.create(<RectangleWithCornerBorders />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
