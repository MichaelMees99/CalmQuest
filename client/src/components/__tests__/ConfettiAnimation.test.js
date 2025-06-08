import React from 'react';
import { render, act } from '@testing-library/react';
import ConfettiAnimation from '../ConfettiAnimation';

jest.useFakeTimers();

jest.mock('react-dom-confetti', () => (props) => (
  <div data-testid="confetti" data-active={props.active}></div>
));

test('confetti activates when triggered', () => {
  const { rerender, getByTestId } = render(<ConfettiAnimation trigger={false} />);
  expect(getByTestId('confetti').getAttribute('data-active')).toBe('false');

  rerender(<ConfettiAnimation trigger={true} />);
  expect(getByTestId('confetti').getAttribute('data-active')).toBe('true');

  act(() => {
    jest.advanceTimersByTime(150);
  });
  rerender(<ConfettiAnimation trigger={true} />);
  expect(getByTestId('confetti').getAttribute('data-active')).toBe('false');
});
