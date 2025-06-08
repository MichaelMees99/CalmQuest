import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@apollo/client', () => ({
  useQuery: () => ({ data: { tasks: [{ task: 'a' }, { task: 'b' }, { task: 'c' }] } }),
}));

jest.mock('../../utils/queries', () => ({ GET_TASKS: {} }));

import TaskList from '../TaskList';

test('invokes progress callback on mount', () => {
  const cb = jest.fn();
  render(<TaskList onProgressChange={cb} />);
  expect(cb).toHaveBeenCalled();
});
