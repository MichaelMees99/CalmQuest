import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import ConfettiAnimation from './ConfettiAnimation';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from "../utils/queries";
import { random } from '../utils/randomizer';

const TaskList = ({ onProgressChange = () => {} }) => {
  const { data } = useQuery(GET_TASKS);
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // Current date in 'YYYY-MM-DD' format
    const storedDate = localStorage.getItem('tasksDate');
    let randomTasks;

    if (storedDate === today) {
      // Use stored tasks for today
      randomTasks = JSON.parse(localStorage.getItem('tasks'));
      const storedCheckedTasks = JSON.parse(localStorage.getItem('checkedTasks')) || [];
      setCheckedTasks(storedCheckedTasks.length ? storedCheckedTasks : new Array(randomTasks.length).fill(false));
      onProgressChange();
    } else if (data?.tasks) {
      // Generate new tasks for a new day
      randomTasks = random(data.tasks).slice(0, 3);
      localStorage.setItem('tasks', JSON.stringify(randomTasks));
      localStorage.setItem('tasksDate', today);
      const defaultCheckedTasks = new Array(randomTasks.length).fill(false);
      localStorage.setItem('checkedTasks', JSON.stringify(defaultCheckedTasks));
      setCheckedTasks(defaultCheckedTasks);
      onProgressChange();
    }

    if (randomTasks) {
      setTasks(randomTasks);
    }
  }, [data]);

  useEffect(() => {
    // Store the checked state in localStorage whenever it changes
    localStorage.setItem('checkedTasks', JSON.stringify(checkedTasks));
    onProgressChange();
  }, [checkedTasks, onProgressChange]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 200);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 200);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div>
      <p className="text-xl lg:text-2xl bg-gradient-to-l from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent font-nexa font-bold mb-2">Daily Quests:</p>
      <ul className="mb-6 mx-auto w-full">
        <ConfettiAnimation trigger={showConfetti} />
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task.task} // Pass the task's "task" property to TaskItem component
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

export default TaskList;