import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '../utils/queries';
import { random } from '../utils/randomizer';

function getWeekKey(date = new Date()) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - firstDay) / 86400000);
  return `${date.getFullYear()}-W${Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7)}`;
}

const WeeklyQuest = () => {
  const { data } = useQuery(GET_TASKS);
  const [quest, setQuest] = useState('');

  useEffect(() => {
    const currentWeek = getWeekKey();
    const storedWeek = localStorage.getItem('weeklyQuestWeek');
    let q;
    if (storedWeek === currentWeek) {
      q = localStorage.getItem('weeklyQuest');
    } else if (data?.tasks) {
      q = random(data.tasks)[0].task;
      localStorage.setItem('weeklyQuest', q);
      localStorage.setItem('weeklyQuestWeek', currentWeek);
    }
    if (q) {
      setQuest(q);
    }
  }, [data]);

  return (
    <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow mt-4 text-center">
      <p className="font-nexa font-bold text-emerald-500">Weekly Quest:</p>
      <p className="mt-2">{quest}</p>
    </div>
  );
};

export default WeeklyQuest;
