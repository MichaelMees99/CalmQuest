import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '../utils/queries';
import { random } from '../utils/randomizer';
import WeeklyTaskItem from './WeeklyTaskItem';
import ConfettiAnimation from './ConfettiAnimation';

function getWeekKey(date = new Date()) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - firstDay) / 86400000);
  return `${date.getFullYear()}-W${Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7)}`;
}

const WeeklyQuest = () => {
  const { data } = useQuery(GET_TASKS);
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const currentWeek = getWeekKey();
    const storedWeek = localStorage.getItem('weeklyWeek');
    let weekTasks;

    if (storedWeek === currentWeek) {
      weekTasks = JSON.parse(localStorage.getItem('weeklyTasks'));
      const storedChecked = JSON.parse(localStorage.getItem('weeklyCheckedTasks')) || [];
      setCheckedTasks(storedChecked.length ? storedChecked : new Array(weekTasks.length).fill(false));
    } else if (data?.tasks) {
      weekTasks = random(data.tasks).slice(0, 3);
      localStorage.setItem('weeklyTasks', JSON.stringify(weekTasks));
      localStorage.setItem('weeklyWeek', currentWeek);
      const defaultChecked = new Array(weekTasks.length).fill(false);
      localStorage.setItem('weeklyCheckedTasks', JSON.stringify(defaultChecked));
      setCheckedTasks(defaultChecked);
    }

    if (weekTasks) {
      setTasks(weekTasks);
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('weeklyCheckedTasks', JSON.stringify(checkedTasks));
  }, [checkedTasks]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 200);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="mt-4">
      <ConfettiAnimation trigger={showConfetti} />
      <p className="text-xl lg:text-2xl text-center bg-gradient-to-l from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent font-nexa font-bold">Weekly Quests:</p>
      <ul className="mb-6 mx-auto w-1/2">
        {tasks.map((task, index) => (
          <WeeklyTaskItem
            key={index}
            task={task.task}
            index={index}
            checkedTasks={checkedTasks}
            setCheckedTasks={setCheckedTasks}
            onComplete={() => setShowConfetti(true)}
          />
        ))}
      </ul>
    </div>
  );
};

export default WeeklyQuest;
