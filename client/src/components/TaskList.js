import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import ConfettiAnimation from './ConfettiAnimation';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from "../utils/queries";
import { random } from '../utils/randomizer';

const TaskList = () => {
  const { data } = useQuery(GET_TASKS);
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // Current date in 'YYYY-MM-DD' format
    const storedDate = localStorage.getItem('tasksDate');
    let randomTasks;

    if (storedDate === today) {
      // Use stored tasks for today
      randomTasks = JSON.parse(localStorage.getItem('tasks'));
      const storedCheckedTasks = JSON.parse(localStorage.getItem('checkedTasks')) || [];
      setCheckedTasks(storedCheckedTasks.length ? storedCheckedTasks : new Array(randomTasks.length).fill(false));
    } else if (data?.tasks) {
      // Generate new tasks for a new day
      randomTasks = random(data.tasks).slice(0, 4);
      localStorage.setItem('tasks', JSON.stringify(randomTasks));
      localStorage.setItem('tasksDate', today);
      const defaultCheckedTasks = new Array(randomTasks.length).fill(false);
      localStorage.setItem('checkedTasks', JSON.stringify(defaultCheckedTasks));
      setCheckedTasks(defaultCheckedTasks);
    }

    if (randomTasks) {
      setTasks(randomTasks);
    }
  }, [data]);

  useEffect(() => {
    // Store the checked state in localStorage whenever it changes
    localStorage.setItem('checkedTasks', JSON.stringify(checkedTasks));
  }, [checkedTasks]);

  return (
    <ul className="mb-6 mx-auto w-1/2">
      <ConfettiAnimation allTasksDone={checkedTasks.every(Boolean)} />
      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task.task} // Pass the task's "task" property to TaskItem component
          index={index}
          checkedTasks={checkedTasks}
          setCheckedTasks={setCheckedTasks}
        />
      ))}
    </ul>
  );
};

export default TaskList;