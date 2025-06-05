import React, { useEffect, useState } from 'react';
import { random } from '../utils/randomizer';
import WeeklyTaskItem from './WeeklyTaskItem';
import ConfettiAnimation from './ConfettiAnimation';

function getWeekKey(date = new Date()) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - firstDay) / 86400000);
  return `${date.getFullYear()}-W${Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7)}`;
}

const WeeklyQuest = () => {
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const weeklyPool = [
      { task: 'Spend 30 minutes meditating' },
      { task: 'Write in a gratitude journal each day' },
      { task: 'Try a new relaxation technique' },
      { task: 'Take a long walk outdoors' },
      { task: 'Do a one-day digital detox' },
    ];

    const currentWeek = getWeekKey();
    const storedWeek = localStorage.getItem('weeklyWeek');
    let weekTasks;

    if (storedWeek === currentWeek) {
      weekTasks = JSON.parse(localStorage.getItem('weeklyTasks'));
      const storedChecked = JSON.parse(localStorage.getItem('weeklyCheckedTasks')) || [];
      setCheckedTasks(
        storedChecked.length ? storedChecked : new Array(weekTasks.length).fill(false)
      );
    } else {
      weekTasks = random(weeklyPool).slice(0, 2);
      localStorage.setItem('weeklyTasks', JSON.stringify(weekTasks));
      localStorage.setItem('weeklyWeek', currentWeek);
      const defaultChecked = new Array(weekTasks.length).fill(false);
      localStorage.setItem('weeklyCheckedTasks', JSON.stringify(defaultChecked));
      setCheckedTasks(defaultChecked);
    }

    if (weekTasks) {
      setTasks(weekTasks);
    }
  }, []);

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
      <p className="text-xl lg:text-2xl bg-gradient-to-l from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent font-nexa font-bold mb-2">Weekly Quests:</p>
      <ul className="mb-6 mx-auto w-full">
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
