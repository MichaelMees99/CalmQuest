import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@apollo/client', () => ({
  useQuery: () => ({ data: { tasks: [{ task: 'demo' }] } }),
}));

jest.mock('../../utils/queries', () => ({ GET_TASKS: {} }));

import WeeklyQuest from '../WeeklyQuest';

test('renders weekly quest header', () => {
  render(<WeeklyQuest />);
  expect(screen.getByText('Weekly Quests:')).toBeInTheDocument();
});
