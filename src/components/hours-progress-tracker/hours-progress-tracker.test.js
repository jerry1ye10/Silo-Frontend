import React from 'react';
import renderer from 'react-test-renderer';
import HoursProgressTracker from '.';

describe('<HoursProgressTracker />', () => {
  it('1 total 0 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={1} hoursUsed={0} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(1);
    expect(bars[0].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(2);
    expect(digits[0].props.style.color).toEqual('green');
    expect(digits[1].props.style.color).toEqual('white');
  });

  it('2 total 0 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={2} hoursUsed={0} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(2);
    expect(bars[0].props.style.backgroundColor).toEqual('white');
    expect(bars[1].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(3);
    expect(digits[0].props.style.color).toEqual('green');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('white');
  });

  it('2 total 1 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={2} hoursUsed={1} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(2);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(3);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('green');
    expect(digits[2].props.style.color).toEqual('white');
  });

  it('3 total 0 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={3} hoursUsed={0} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(3);
    expect(bars[0].props.style.backgroundColor).toEqual('white');
    expect(bars[1].props.style.backgroundColor).toEqual('white');
    expect(bars[2].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(4);
    expect(digits[0].props.style.color).toEqual('green');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('white');
    expect(digits[3].props.style.color).toEqual('white');
  });

  it('3 total 1 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={3} hoursUsed={1} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(3);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('white');
    expect(bars[2].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(4);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('green');
    expect(digits[2].props.style.color).toEqual('white');
    expect(digits[3].props.style.color).toEqual('white');
  });

  it('3 total 2 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={3} hoursUsed={2} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(3);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('green');
    expect(bars[2].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(4);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('green');
    expect(digits[3].props.style.color).toEqual('white');
  });

  it('4 total 2 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={4} hoursUsed={2} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(4);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('green');
    expect(bars[2].props.style.backgroundColor).toEqual('white');
    expect(bars[3].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(5);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('green');
    expect(digits[3].props.style.color).toEqual('white');
    expect(digits[4].props.style.color).toEqual('white');
  });

  it('5 total 1 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={5} hoursUsed={1} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(5);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('white');
    expect(bars[2].props.style.backgroundColor).toEqual('white');
    expect(bars[3].props.style.backgroundColor).toEqual('white');
    expect(bars[4].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(6);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('green');
    expect(digits[2].props.style.color).toEqual('white');
    expect(digits[3].props.style.color).toEqual('white');
    expect(digits[4].props.style.color).toEqual('white');
    expect(digits[5].props.style.color).toEqual('white');
  });

  it('6 total 5 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={6} hoursUsed={5} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(6);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('green');
    expect(bars[2].props.style.backgroundColor).toEqual('green');
    expect(bars[3].props.style.backgroundColor).toEqual('green');
    expect(bars[4].props.style.backgroundColor).toEqual('green');
    expect(bars[5].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(7);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('white');
    expect(digits[3].props.style.color).toEqual('white');
    expect(digits[4].props.style.color).toEqual('white');
    expect(digits[5].props.style.color).toEqual('green');
    expect(digits[6].props.style.color).toEqual('white');
  });

  it('7 total 0 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={7} hoursUsed={0} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(7);
    expect(bars[0].props.style.backgroundColor).toEqual('white');
    expect(bars[1].props.style.backgroundColor).toEqual('white');
    expect(bars[2].props.style.backgroundColor).toEqual('white');
    expect(bars[3].props.style.backgroundColor).toEqual('white');
    expect(bars[4].props.style.backgroundColor).toEqual('white');
    expect(bars[5].props.style.backgroundColor).toEqual('white');
    expect(bars[6].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(8);
    expect(digits[0].props.style.color).toEqual('green');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('white');
    expect(digits[3].props.style.color).toEqual('white');
    expect(digits[4].props.style.color).toEqual('white');
    expect(digits[5].props.style.color).toEqual('white');
    expect(digits[6].props.style.color).toEqual('white');
    expect(digits[7].props.style.color).toEqual('white');
  });

  it('8 total 2 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={8} hoursUsed={2} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(8);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('green');
    expect(bars[2].props.style.backgroundColor).toEqual('white');
    expect(bars[3].props.style.backgroundColor).toEqual('white');
    expect(bars[4].props.style.backgroundColor).toEqual('white');
    expect(bars[5].props.style.backgroundColor).toEqual('white');
    expect(bars[6].props.style.backgroundColor).toEqual('white');
    expect(bars[7].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(9);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('green');
    expect(digits[3].props.style.color).toEqual('white');
    expect(digits[4].props.style.color).toEqual('white');
    expect(digits[5].props.style.color).toEqual('white');
    expect(digits[6].props.style.color).toEqual('white');
    expect(digits[7].props.style.color).toEqual('white');
    expect(digits[8].props.style.color).toEqual('white');
  });

  it('9 total 6 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={9} hoursUsed={6} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(9);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('green');
    expect(bars[2].props.style.backgroundColor).toEqual('green');
    expect(bars[3].props.style.backgroundColor).toEqual('green');
    expect(bars[4].props.style.backgroundColor).toEqual('green');
    expect(bars[5].props.style.backgroundColor).toEqual('green');
    expect(bars[6].props.style.backgroundColor).toEqual('white');
    expect(bars[7].props.style.backgroundColor).toEqual('white');
    expect(bars[8].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(10);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('white');
    expect(digits[3].props.style.color).toEqual('white');
    expect(digits[4].props.style.color).toEqual('white');
    expect(digits[5].props.style.color).toEqual('white');
    expect(digits[6].props.style.color).toEqual('green');
    expect(digits[7].props.style.color).toEqual('white');
    expect(digits[8].props.style.color).toEqual('white');
    expect(digits[9].props.style.color).toEqual('white');
  });

  it('10 total 5 used', () => {
    const component = renderer.create(
      <HoursProgressTracker totalHours={10} hoursUsed={5} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const barsContainer = component.root.findByProps({
      testID: 'bars-container',
    });
    const bars = barsContainer.props.children;
    expect(bars.length).toEqual(10);
    expect(bars[0].props.style.backgroundColor).toEqual('green');
    expect(bars[1].props.style.backgroundColor).toEqual('green');
    expect(bars[2].props.style.backgroundColor).toEqual('green');
    expect(bars[3].props.style.backgroundColor).toEqual('green');
    expect(bars[4].props.style.backgroundColor).toEqual('green');
    expect(bars[5].props.style.backgroundColor).toEqual('white');
    expect(bars[6].props.style.backgroundColor).toEqual('white');
    expect(bars[7].props.style.backgroundColor).toEqual('white');
    expect(bars[8].props.style.backgroundColor).toEqual('white');
    expect(bars[9].props.style.backgroundColor).toEqual('white');
    const digitsContainer = component.root.findByProps({
      testID: 'digits-container',
    });
    const digits = digitsContainer.props.children;
    expect(digits.length).toEqual(11);
    expect(digits[0].props.style.color).toEqual('white');
    expect(digits[1].props.style.color).toEqual('white');
    expect(digits[2].props.style.color).toEqual('white');
    expect(digits[3].props.style.color).toEqual('white');
    expect(digits[4].props.style.color).toEqual('white');
    expect(digits[5].props.style.color).toEqual('green');
    expect(digits[6].props.style.color).toEqual('white');
    expect(digits[7].props.style.color).toEqual('white');
    expect(digits[8].props.style.color).toEqual('white');
    expect(digits[9].props.style.color).toEqual('white');
    expect(digits[10].props.style.color).toEqual('white');
  });
});
